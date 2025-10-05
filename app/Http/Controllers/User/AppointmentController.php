<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Jobs\LogAppointmentActivity;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    use AuthorizesRequests;
    
    public function index()
    {
        $appointments = Auth::user()->appointments()->latest()->paginate(10);
        return Inertia::render('user/appointments/index', [
            'appointments' => $appointments,
        ]);
    }

    public function show(Appointment $appointment)
    {
        $this->authorize('view', $appointment);
        return Inertia::render('user/appointments/show', [
            'appointment' => $appointment,
        ]);
    }

    public function cancel(Appointment $appointment)
    {
        $this->authorize('update', $appointment);
        
        if ($appointment->status === 'cancelled') {
            return redirect()->back()->with('error', 'Appointment is already cancelled.');
        }
        
        $oldStatus = $appointment->status;
        $appointment->update(['status' => 'cancelled']);
        
        LogAppointmentActivity::dispatch(
            appointmentId: $appointment->id,
            userId: Auth::id(),
            action: 'status_changed',
            fromStatus: $oldStatus,
            toStatus: 'cancelled'
        );
        
        return redirect()->back()->with('success', 'Appointment cancelled successfully.');
    }

    public function reschedule(Request $request, Appointment $appointment)
    {
        $this->authorize('update', $appointment);
        
        $request->validate([
            'preferred_date' => 'required|date|after:today',
            'preferred_time' => 'required|string',
        ]);
        
        $oldDate = $appointment->preferred_date;
        $oldTime = $appointment->preferred_time;
        
        $appointment->update([
            'preferred_date' => $request->preferred_date,
            'preferred_time' => $request->preferred_time,
            'status' => 'pending', // Reset to pending after reschedule
        ]);
        
        LogAppointmentActivity::dispatch(
            appointmentId: $appointment->id,
            userId: Auth::id(),
            action: 'rescheduled',
            fromStatus: null,
            toStatus: null,
            metadata: [
                'old_date' => $oldDate,
                'old_time' => $oldTime,
                'new_date' => $request->preferred_date,
                'new_time' => $request->preferred_time,
            ]
        );
        
        return redirect()->back()->with('success', 'Appointment rescheduled successfully.');
    }
}
