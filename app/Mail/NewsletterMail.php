<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewsletterMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public string $subject, public string $content)
    {
    }

    public function build()
    {
        return $this->subject($this->subject)
                    ->view('emails.newsletter')
                    ->with(['content' => $this->content]);
    }
}
