<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
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
        // Ensure this is a patient (not an admin)
        if ($user->role !== 'user') {
            abort(404);
        }

        $user->load(['appointments' => function ($query) {
            $query->orderBy('preferred_date', 'desc')->orderBy('preferred_time', 'desc');
        }]);

        return Inertia::render('admin/patients/show', [
            'patient' => $user,
        ]);
    }
}