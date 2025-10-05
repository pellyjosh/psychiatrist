<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Base factories if desired
        // User::factory()->count(5)->create();

        $this->call([
            AdminUserSeeder::class,
            PatientUserSeeder::class,
            AppointmentSeeder::class,
            ResourceSeeder::class,
        ]);

        // Output quick credentials hint
        $this->command?->info('Seeded admin (admin@example.com / password) and patient (patient@example.com / password) accounts.');
    }
}
