<?php

namespace App\Policies;

use App\Models\Appointment;
use App\Models\User;

class AppointmentPolicy
{
    public function view(User $user, Appointment $appointment): bool
    {
        return $user->role === 'admin' || $appointment->user_id === $user->id;
    }

    public function update(User $user, Appointment $appointment): bool
    {
        return $user->role === 'admin';
    }

    public function delete(User $user, Appointment $appointment): bool
    {
        return $user->role === 'admin';
    }
    public function viewAny(User $user): bool
    {
        return $user->role === 'admin';
    }
}
