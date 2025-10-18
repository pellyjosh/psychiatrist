<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;

class NewsletterNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public string $subject, public string $content)
    {
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return new \App\Mail\NewsletterMail($this->subject, $this->content);
    }

    public function toArray($notifiable)
    {
        return [
            'subject' => $this->subject,
            'content' => $this->content,
        ];
    }
}
