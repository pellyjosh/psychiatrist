<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;
use App\Models\User;
use App\Notifications\AppointmentReminder;
use Illuminate\Support\Facades\Log;

class ReminderController extends Controller
{
    /**
     * Send reminders for appointments 24 hours ahead
     */
    public function remind24Hours(Request $request)
    {
        // Verify secret key
        if ($request->query('secret') !== config('app.cron_key')) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $sent = $this->sendReminders('24 hours', 24 * 60);
        
        return response()->json([
            'success' => true,
            'message' => "Sent reminders for {$sent} appointments (24 hours)",
            'count' => $sent
        ]);
    }

    /**
     * Send reminders for appointments 30 minutes ahead
     */
    public function remind30Minutes(Request $request)
    {
        // Verify secret key
        if ($request->query('secret') !== config('app.cron_key')) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $sent = $this->sendReminders('30 minutes', 30);
        
        return response()->json([
            'success' => true,
            'message' => "Sent reminders for {$sent} appointments (30 minutes)",
            'count' => $sent
        ]);
    }

    /**
     * Core reminder logic
     * 
     * @param string $label The label for the reminder (e.g., "24 hours before")
     * @param int $minutes Minutes ahead to check
     * @return int Number of reminders sent
     */
    private function sendReminders(string $label, int $minutes): int
    {
        $now = now();
        $target = $now->copy()->addMinutes($minutes);
        
        // Build target datetime and search window (+/- 5 minutes)
        $targetDate = $target->toDateString();
        $targetTime = $target->format('H:i:s');
        
        $targetDateTime = \Carbon\Carbon::parse("{$targetDate} {$targetTime}");
        $start = $targetDateTime->copy()->subMinutes(5);
        $end = $targetDateTime->copy()->addMinutes(5);
        
        // Find confirmed appointments in the time window
        $appointments = Appointment::where('status', 'confirmed')
            ->whereRaw("(appointment_date || ' ' || appointment_time) BETWEEN ? AND ?", [
                $start->toDateTimeString(), 
                $end->toDateTimeString()
            ])
            ->get();
        
        $count = 0;
        foreach ($appointments as $appointment) {
            try {
                // Notify user
                if ($appointment->user) {
                    $appointment->user->notify(new AppointmentReminder($appointment, $label));
                }
                
                // Notify admins
                $admins = User::where('role', 'admin')->get();
                foreach ($admins as $admin) {
                    $admin->notify(new AppointmentReminder($appointment, $label));
                }
                
                $count++;
            } catch (\Exception $e) {
                Log::error('Reminder delivery failed for appointment ' . $appointment->id . ': ' . $e->getMessage());
            }
        }
        
        return $count;
    }
}
