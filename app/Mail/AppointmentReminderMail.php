<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Appointment;

class AppointmentReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Appointment $appointment, public string $whenLabel)
    {
    }

    public function build()
    {
        $subject = "Appointment reminder: {$this->whenLabel}";
        return $this->subject($subject)
                    ->view('emails.appointment_reminder')
                    ->with([
                        'appointment' => $this->appointment,
                        'whenLabel' => $this->whenLabel,
                    ]);
    }
}
