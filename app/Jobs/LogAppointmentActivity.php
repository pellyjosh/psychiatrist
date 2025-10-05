<?php

namespace App\Jobs;

use App\Models\AppointmentActivity;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class LogAppointmentActivity implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public int $appointmentId,
        public ?int $userId,
        public string $action,
        public ?string $fromStatus = null,
        public ?string $toStatus = null,
        public array $meta = []
    ) {}

    public function handle(): void
    {
        AppointmentActivity::create([
            'appointment_id' => $this->appointmentId,
            'user_id' => $this->userId,
            'action' => $this->action,
            'from_status' => $this->fromStatus,
            'to_status' => $this->toStatus,
            'meta' => $this->meta,
        ]);
    }
}
