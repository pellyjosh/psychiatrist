<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        // Stats for admin overview
        $stats = [
            'totalAppointments' => Appointment::thisWeek()->count(),
            'pendingAppointments' => Appointment::pending()->count(),
            'completedToday' => Appointment::today()->where('status', 'completed')->count(),
            'newInquiries' => Appointment::where('created_at', '>=', now()->subWeek())->count(),
        ];

        $recentAppointments = Appointment::today()
            ->orderBy('preferred_time')
            ->take(5)
            ->get();

        // Return same inertia page for now or create a dedicated one later
        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentAppointments' => $recentAppointments,
            'appointments' => Appointment::latest()->get(),
            'auth' => ['user' => Auth::user()],
        ]);
    }
}
