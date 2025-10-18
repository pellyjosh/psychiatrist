<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Appointment;

class AppointmentStatusChangedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Appointment $appointment, public string $oldStatus, public string $newStatus)
    {
    }

    public function build()
    {
        $subject = 'Appointment status updated';
        return $this->subject($subject)
                    ->view('emails.appointment_status_changed')
                    ->with([
                        'appointment' => $this->appointment,
                        'old' => $this->oldStatus,
                        'new' => $this->newStatus,
                    ]);
    }
}
