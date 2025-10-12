<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PatientController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()->where('role', 'user')->with(['appointments']);

        // Search by name or email
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by appointment status
        if ($status = $request->get('status')) {
            $query->whereHas('appointments', function ($q) use ($status) {
                $q->where('status', $status);
            });
        }

        $patients = $query->withCount([
            'appointments',
            'appointments as pending_appointments_count' => function ($q) {
                $q->where('status', 'pending');
            },
            'appointments as confirmed_appointments_count' => function ($q) {
                $q->where('status', 'confirmed');
            },
            'appointments as completed_appointments_count' => function ($q) {
                $q->where('status', 'completed');
            }
        ])->orderBy('name')->paginate(15)->withQueryString();

        return Inertia::render('admin/patients/index', [
            'patients' => $patients,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function show(User $user)
    {
        Log::info('PatientController show method called', ['user_id' => $user->id, 'user_role' => $user->role]);
        
        // For testing, temporarily allow any user regardless of role
        // TODO: Uncomment this check after testing
        // if ($user->role !== 'user') {
        //     Log::warning('User is not a patient', ['user_id' => $user->id, 'role' => $user->role]);
        //     abort(404, 'User is not a patient. Role: ' . $user->role);
        // }

        $user->load(['appointments' => function ($query) {
            $query->orderBy('appointment_date', 'desc')->orderBy('appointment_time', 'desc');
        }]);

        // Calculate appointment counts
        $appointmentCounts = [
            'total' => $user->appointments->count(),
            'pending' => $user->appointments->where('status', 'pending')->count(),
            'confirmed' => $user->appointments->where('status', 'confirmed')->count(),
            'completed' => $user->appointments->where('status', 'completed')->count(),
            'cancelled' => $user->appointments->where('status', 'cancelled')->count(),
        ];

        Log::info('Rendering patient show page', [
            'patient_id' => $user->id,
            'appointments_count' => $user->appointments->count(),
            'appointment_counts' => $appointmentCounts
        ]);

        return Inertia::render('admin/patients/show', [
            'patient' => $user,
            'appointments' => $user->appointments,
            'appointmentCounts' => $appointmentCounts,
        ]);
    }
}