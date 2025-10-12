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
                  ->orWhere('reason_for_visit', 'like', "%{$search}%")
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
                // Use actual appointment date/time (not preferred which might be null)
                'appointment_date' => $appointment->appointment_date ?? $appointment->preferred_date,
                'appointment_time' => $appointment->appointment_time ?? $appointment->preferred_time,
                // Status and basic info
                'status' => $appointment->status,
                'reason' => $appointment->reason ?? $appointment->reason_for_visit,
                'notes' => $appointment->admin_notes,
                'created_at' => $appointment->created_at,
                // Service details
                'service' => $appointment->service,
                'appointment_type' => $appointment->appointment_type,
                // Alternate preferences (for edit form)
                'alternate_date' => $appointment->alternate_date,
                'alternate_time' => $appointment->alternate_time,
                // Medical information
                'current_symptoms' => $appointment->current_symptoms,
                'current_medications' => $appointment->current_medications,
                'allergies' => $appointment->allergies,
                // User information
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

        // Get services and appointment types for the frontend
        $services = \App\Models\Service::active()->ordered()->get(['id', 'code', 'name', 'duration']);
        $appointmentTypes = \App\Models\AppointmentType::active()->ordered()->get(['id', 'code', 'name']);

        return Inertia::render('admin/appointments/index', [
            'appointments' => $appointments,
            'filters' => [
                'search' => $request->get('search'),
                'status' => $request->get('status'),
                'date' => $request->get('date'),
            ],
            'stats' => $stats,
            'services' => $services,
            'appointmentTypes' => $appointmentTypes,
        ]);
    }

    public function show(Appointment $appointment)
    {
        $this->authorize('view', $appointment);
        return Inertia::render('admin/appointments/show', [
            'appointment' => $appointment,
        ]);
    }

    public function create()
    {
        $users = \App\Models\User::orderBy('name')->get(['id', 'name', 'email']);
        
        return Inertia::render('admin/appointments/create', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'service' => 'required|string',
            'preferred_date' => 'required|date|after_or_equal:today',
            'preferred_time' => 'required|string',
            'alternateDate' => 'nullable|date|after_or_equal:today',
            'alternateTime' => 'nullable|string',
            'appointment_type' => 'required|in:telehealth,in-person',
            'reason' => 'required|string|max:1000',
            'currentSymptoms' => 'nullable|string',
            'currentMedications' => 'nullable|string',
            'allergies' => 'nullable|string',
            'admin_notes' => 'nullable|string',
        ]);

        $appointment = Appointment::create([
            'user_id' => $validated['user_id'],
            'service' => $validated['service'],
            'preferred_date' => $validated['preferred_date'],
            'preferred_time' => $validated['preferred_time'],
            'appointment_date' => $validated['preferred_date'], // Also set appointment_date for consistency
            'appointment_time' => $validated['preferred_time'], // Also set appointment_time for consistency
            'alternate_date' => $validated['alternateDate'],
            'alternate_time' => $validated['alternateTime'],
            'appointment_type' => $validated['appointment_type'],
            'reason' => $validated['reason'],
            'reason_for_visit' => $validated['reason'], // Also set reason_for_visit for consistency
            'current_symptoms' => $validated['currentSymptoms'],
            'current_medications' => $validated['currentMedications'],
            'allergies' => $validated['allergies'],
            'admin_notes' => $validated['admin_notes'],
            'status' => 'confirmed', // Admin-created appointments are auto-confirmed
        ]);

        LogAppointmentActivity::dispatch(
            appointmentId: $appointment->id,
            userId: $request->user()->id,
            action: 'created_by_admin',
            fromStatus: null,
            toStatus: 'confirmed',
            meta: ['service' => $validated['service']]
        );

        return redirect()->route('admin.appointments.index')
            ->with('success', 'Appointment created successfully.');
    }

    public function update(Request $request, Appointment $appointment)
    {
        $this->authorize('update', $appointment);
        $originalService = $appointment->service;
        
        $validated = $request->validate([
            // Basic appointment details
            'preferred_date' => 'required|date',
            'preferred_time' => 'required|string',
            'service' => 'required|string',
            'appointment_type' => 'required|in:telehealth,in-person',
            'reason' => 'required|string',
            
            // Medical information
            'currentSymptoms' => 'nullable|string',
            'currentMedications' => 'nullable|string',
            'allergies' => 'nullable|string',
            'admin_notes' => 'nullable|string',
        ]);

        // Map frontend field names to database field names
        $updateData = [
            'appointment_date' => $validated['preferred_date'],
            'appointment_time' => $validated['preferred_time'],
            'preferred_date' => $validated['preferred_date'],
            'preferred_time' => $validated['preferred_time'],
            'service' => $validated['service'],
            'appointment_type' => $validated['appointment_type'],
            'reason' => $validated['reason'],
            'reason_for_visit' => $validated['reason'],
            'current_symptoms' => $validated['currentSymptoms'],
            'current_medications' => $validated['currentMedications'],
            'allergies' => $validated['allergies'],
            'admin_notes' => $validated['admin_notes'],
        ];

        $appointment->update($updateData);

        // Log service changes
        if ($originalService !== $validated['service']) {
            LogAppointmentActivity::dispatch(
                appointmentId: $appointment->id,
                userId: $request->user()->id ?? null,
                action: 'service_changed',
                fromStatus: $originalService,
                toStatus: $validated['service'],
                meta: ['changed_by_admin' => true]
            );
        }

        return redirect()->back()->with('success', 'Appointment updated successfully.');
    }

    public function reschedule(Request $request, Appointment $appointment)
    {
        $this->authorize('update', $appointment);

        $validated = $request->validate([
            'preferred_date' => 'required|date|after_or_equal:today',
            'preferred_time' => 'required|string',
            'reschedule_reason' => 'nullable|string|max:500',
        ]);

        $originalDate = $appointment->preferred_date;
        $originalTime = $appointment->preferred_time;

        $appointment->update([
            'preferred_date' => $validated['preferred_date'],
            'preferred_time' => $validated['preferred_time'],
        ]);

        LogAppointmentActivity::dispatch(
            appointmentId: $appointment->id,
            userId: $request->user()->id,
            action: 'rescheduled',
            fromStatus: $originalDate . ' ' . $originalTime,
            toStatus: $validated['preferred_date'] . ' ' . $validated['preferred_time'],
            meta: [
                'reason' => $validated['reschedule_reason'] ?? null,
                'rescheduled_by' => 'admin'
            ]
        );

        return redirect()->back()->with('success', 'Appointment rescheduled successfully.');
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
