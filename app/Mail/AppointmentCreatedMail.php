<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Appointment;

class AppointmentCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Appointment $appointment)
    {
    }

    public function build()
    {
        $subject = 'New appointment request: ' . ($this->appointment->first_name ?? '');
        return $this->subject($subject)
                    ->view('emails.appointment_created')
                    ->with(['appointment' => $this->appointment]);
    }
}
