<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon; // Laravel 12 uses support Carbon facade

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        // Try to locate existing patient & admin
        $patient = User::where('email', 'patient@example.com')->first();
        $admin = User::where('email', 'admin@example.com')->first();

        if (!$patient) {
            $this->command?->warn('Patient user not found. Skipping appointment seeding.');
            return;
        }

        $basePatientData = [
            'first_name' => 'Test',
            'last_name' => 'Patient',
            'email' => $patient->email,
            'phone' => '555-123-4567',
            'date_of_birth' => '1990-05-14',
            'insurance_provider' => 'BlueCross',
            'previous_treatment' => 'Prior CBT sessions in 2023',
            'medications' => 'Sertraline 50mg daily',
            'emergency_contact' => 'Jane Doe - 555-222-1111',
        ];

        $now = now();

        $samples = [
            [
                'service' => 'Initial Psychiatric Evaluation',
                'preferred_date' => $now->copy()->subDays(14)->toDateString(),
                'preferred_time' => '09:00',
                'provider' => 'Dr. Johnson',
                'status' => 'completed',
                'reason' => 'New onset anxiety & trouble sleeping.',
                'admin_notes' => 'Completed intake; follow-up in 4 weeks.',
                'confirmed_at' => $now->copy()->subDays(15),
            ],
            [
                'service' => 'Medication Management',
                'preferred_date' => $now->copy()->subDays(3)->toDateString(),
                'preferred_time' => '11:30',
                'provider' => 'Dr. Johnson',
                'status' => 'completed',
                'reason' => 'Review response to SSRI therapy.',
                'admin_notes' => 'Medication stable; no dose change.',
                'confirmed_at' => $now->copy()->subDays(7),
            ],
            [
                'service' => 'Follow-up Consultation',
                'preferred_date' => $now->toDateString(),
                'preferred_time' => '14:00',
                'provider' => 'Dr. Johnson',
                'status' => 'confirmed',
                'reason' => 'Assess progress and sleep quality.',
                'admin_notes' => 'Bring updated sleep log.',
                'confirmed_at' => $now->copy()->subDay(),
            ],
            [
                'service' => 'Medication Management',
                'preferred_date' => $now->copy()->addDays(2)->toDateString(),
                'preferred_time' => '10:30',
                'provider' => 'Dr. Johnson',
                'status' => 'pending',
                'reason' => 'Evaluate side effects.',
            ],
            [
                'service' => 'Initial Psychiatric Evaluation',
                'preferred_date' => $now->copy()->addDays(5)->toDateString(),
                'preferred_time' => '09:30',
                'provider' => 'Dr. Lee',
                'status' => 'confirmed',
                'reason' => 'Transfer of care from another provider.',
                'confirmed_at' => $now,
            ],
            [
                'service' => 'Follow-up Consultation',
                'preferred_date' => $now->copy()->addDays(10)->toDateString(),
                'preferred_time' => '16:00',
                'provider' => 'Dr. Lee',
                'status' => 'pending',
                'reason' => 'General progress review.',
            ],
            [
                'service' => 'Medication Management',
                'preferred_date' => $now->copy()->addDays(3)->toDateString(),
                'preferred_time' => '13:15',
                'provider' => 'Dr. Johnson',
                'status' => 'cancelled',
                'reason' => 'Scheduling conflict reported by patient.',
                'cancelled_at' => $now,
                'admin_notes' => 'Patient will reschedule next week.',
            ],
        ];

        $created = 0;
        foreach ($samples as $data) {
            Appointment::firstOrCreate(
                [
                    'user_id' => $patient->id,
                    'preferred_date' => $data['preferred_date'],
                    'preferred_time' => $data['preferred_time'],
                    'service' => $data['service'],
                ],
                array_merge($basePatientData, $data, [
                    'first_name' => $basePatientData['first_name'],
                    'last_name' => $basePatientData['last_name'],
                ])
            );
            $created++;
        }

        $this->command?->info("Seeded {$created} sample appointments for patient@example.com");
    }
}
