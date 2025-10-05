<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AppointmentActivity; // legacy direct use for backwards compatibility
use App\Jobs\LogAppointmentActivity;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    use AuthorizesRequests;
    public function index(Request $request)
    {
        $query = Appointment::with('user');

        // Handle search by patient name or reason
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('reason', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by status
        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        // Filter by specific date
        if ($date = $request->get('date')) {
            $query->whereDate('preferred_date', $date);
        }

        $appointments = $query->orderBy('preferred_date', 'desc')
                             ->orderBy('preferred_time', 'desc')
                             ->paginate(15)
                             ->withQueryString();

        // Transform the data to match frontend expectations
        $appointments->getCollection()->transform(function ($appointment) {
            return [
                'id' => $appointment->id,
                'appointment_date' => $appointment->preferred_date,
                'appointment_time' => $appointment->preferred_time,
                'status' => $appointment->status,
                'reason' => $appointment->reason,
                'notes' => $appointment->notes,
                'created_at' => $appointment->created_at,
                'user' => [
                    'id' => $appointment->user->id,
                    'name' => $appointment->user->name,
                    'email' => $appointment->user->email,
                ]
            ];
        });

        // Calculate stats
        $stats = [
            'total' => Appointment::count(),
            'pending' => Appointment::where('status', 'pending')->count(),
            'confirmed' => Appointment::where('status', 'confirmed')->count(),
            'completed' => Appointment::where('status', 'completed')->count(),
            'cancelled' => Appointment::where('status', 'cancelled')->count(),
        ];

        return Inertia::render('admin/appointments/index', [
            'appointments' => $appointments,
            'filters' => [
                'search' => $request->get('search'),
                'status' => $request->get('status'),
                'date' => $request->get('date'),
            ],
            'stats' => $stats,
        ]);
    }

    public function show(Appointment $appointment)
    {
        $this->authorize('view', $appointment);
        return Inertia::render('admin/appointments/show', [
            'appointment' => $appointment,
        ]);
    }

    public function update(Request $request, Appointment $appointment)
    {
        $this->authorize('update', $appointment);
        $originalStatus = $appointment->status;
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed',
            'admin_notes' => 'nullable|string',
        ]);

        $appointment->update($validated);

        if ($validated['status'] === 'confirmed') {
            $appointment->update(['confirmed_at' => now()]);
        } elseif ($validated['status'] === 'cancelled') {
            $appointment->update(['cancelled_at' => now()]);
        }

        if ($originalStatus !== $validated['status']) {
            LogAppointmentActivity::dispatch(
                appointmentId: $appointment->id,
                userId: $request->user()->id ?? null,
                action: 'status_changed',
                fromStatus: $originalStatus,
                toStatus: $validated['status'],
                meta: ['notes_present' => filled($validated['admin_notes'] ?? null)]
            );
        }

        return redirect()->back()->with('success', 'Appointment updated successfully.');
    }

    public function destroy(Appointment $appointment)
    {
        $this->authorize('delete', $appointment);
        $appointment->delete();
        LogAppointmentActivity::dispatch(
            appointmentId: $appointment->id,
            userId: request()->user()->id ?? null,
            action: 'deleted',
            fromStatus: $appointment->status,
            toStatus: null
        );
        return redirect()->route('admin.appointments.index')->with('success', 'Appointment archived (soft deleted).');
    }

    public function trashed()
    {
        $this->authorize('viewAny', Appointment::class);
        $appointments = Appointment::onlyTrashed()->orderByDesc('deleted_at')->paginate(15);
        return Inertia::render('admin/appointments/trashed', [
            'appointments' => $appointments,
        ]);
    }

    public function restore(int $id)
    {
        $appointment = Appointment::onlyTrashed()->findOrFail($id);
        $this->authorize('update', $appointment);
        $appointment->restore();
        LogAppointmentActivity::dispatch(
            appointmentId: $appointment->id,
            userId: request()->user()->id ?? null,
            action: 'restored',
            fromStatus: null,
            toStatus: $appointment->status
        );
        return redirect()->route('admin.appointments.index')->with('success', 'Appointment restored.');
    }

    public function approve(Appointment $appointment)
    {
        $this->authorize('update', $appointment);
        
        $oldStatus = $appointment->status;
        $appointment->update(['status' => 'confirmed']);
        
        LogAppointmentActivity::dispatch(
            appointmentId: $appointment->id,
            userId: request()->user()->id,
            action: 'status_changed',
            fromStatus: $oldStatus,
            toStatus: 'confirmed'
        );
        
        return redirect()->back()->with('success', 'Appointment approved successfully.');
    }

    public function decline(Appointment $appointment)
    {
        $this->authorize('update', $appointment);
        
        $oldStatus = $appointment->status;
        $appointment->update(['status' => 'cancelled']);
        
        LogAppointmentActivity::dispatch(
            appointmentId: $appointment->id,
            userId: request()->user()->id,
            action: 'status_changed',
            fromStatus: $oldStatus,
            toStatus: 'cancelled'
        );
        
        return redirect()->back()->with('success', 'Appointment declined successfully.');
    }
}
