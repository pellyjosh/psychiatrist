<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

use App\Models\Appointment;
use App\Models\User;

Artisan::command('appointments:send-reminders {when}', function ($when) {
    // when = "24h" or "1h"
    $this->comment("Running appointment reminders: {$when}");

    $now = now();
    $target = null;
    $label = '';

    if ($when === '24h') {
        $target = $now->copy()->addDay();
        $label = '24 hours before';
    } elseif ($when === '1h') {
        $target = $now->copy()->addHour();
        $label = '1 hour before';
    } else {
        $this->error('Unknown when argument; use 24h or 1h');
        return 1;
    }

    // Match appointments by constructing a target datetime and searching within a +/- 5 minute window.
    // This avoids DB-specific functions like strftime and supports minute precision.
    $targetDate = $target->toDateString();
    $targetTime = $target->format('H:i:s');

    $targetDateTime = \Carbon\Carbon::parse("{$targetDate} {$targetTime}");
    $start = $targetDateTime->copy()->subMinutes(5);
    $end = $targetDateTime->copy()->addMinutes(5);

    // Assuming appointments store appointment_date (date) and appointment_time (time) as separate columns
    // Build a whereBetween on the combined datetime using raw concatenation (works on many DBs)
    $appointments = Appointment::where('status', 'confirmed')
        ->whereRaw("(appointment_date || ' ' || appointment_time) BETWEEN ? AND ?", [$start->toDateTimeString(), $end->toDateTimeString()])
        ->get();

    $this->comment('Found ' . $appointments->count() . ' appointments to remind.');

    foreach ($appointments as $appointment) {
        try {
            // Notify user
            $appointment->user->notify(new \App\Notifications\AppointmentReminder($appointment, $label));

            // Notify admins
            $admins = User::where('role', 'admin')->get();
            foreach ($admins as $admin) {
                $admin->notify(new \App\Notifications\AppointmentReminder($appointment, $label));
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Reminder delivery failed: ' . $e->getMessage());
        }
    }

    $this->info('Done.');
})->describe('Send appointment reminders (24h or 1h)');

Artisan::command('newsletter:send {subject} {--content=} {--to=all}', function ($subject) {
    $content = $this->option('content') ?? '';
    $to = $this->option('to');

    $this->comment("Sending newsletter: {$subject}");

    $query = \App\Models\User::query();
    if ($to && $to !== 'all') {
        // allow sending to role segments like 'admin' or 'user'
        $query->where('role', $to);
    }

    $count = 0;
    $query->chunk(100, function ($users) use ($subject, $content, &$count) {
        foreach ($users as $user) {
            try {
                $user->notify(new \App\Notifications\NewsletterNotification($subject, $content));
                $count++;
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Newsletter send failed: ' . $e->getMessage());
            }
        }
    });

    $this->info("Newsletter sent to {$count} users.");
})->describe('Send newsletter to users (optionally by role)');
