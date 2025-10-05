<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Practice Owner',
                'password' => Hash::make('password'), // Change in production
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );
    }
}
