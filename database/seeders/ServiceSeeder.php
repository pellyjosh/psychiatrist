<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Service;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'code' => 'initial-evaluation',
                'name' => 'Initial Psychiatric Evaluation',
                'description' => 'Comprehensive initial assessment and evaluation',
                'duration' => '60 minutes',
                'price' => 250.00,
                'is_available_for_booking' => true, // Available for user booking
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'code' => 'follow-up',
                'name' => 'Follow-up Appointment',
                'description' => 'Regular follow-up appointment for existing patients',
                'duration' => '30 minutes',
                'price' => 150.00,
                'is_available_for_booking' => true, // Available for user booking
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'code' => 'medication-management',
                'name' => 'Medication Management',
                'description' => 'Medication review and management session',
                'duration' => '30 minutes',
                'price' => 150.00,
                'is_available_for_booking' => false, // Admin only
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'code' => 'adhd-treatment',
                'name' => 'ADHD Treatment',
                'description' => 'Specialized ADHD assessment and treatment',
                'duration' => '45 minutes',
                'price' => 200.00,
                'is_available_for_booking' => false, // Admin only
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'code' => 'anxiety-depression',
                'name' => 'Anxiety & Depression Care',
                'description' => 'Treatment for anxiety and depression disorders',
                'duration' => '45 minutes',
                'price' => 200.00,
                'is_available_for_booking' => false, // Admin only
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'code' => 'trauma-ptsd',
                'name' => 'Trauma & PTSD Support',
                'description' => 'Specialized trauma and PTSD treatment',
                'duration' => '60 minutes',
                'price' => 250.00,
                'is_available_for_booking' => false, // Admin only
                'is_active' => true,
                'sort_order' => 6,
            ],
            [
                'code' => 'perinatal-mental-health',
                'name' => 'Perinatal Mental Health',
                'description' => 'Mental health support during pregnancy and postpartum',
                'duration' => '45 minutes',
                'price' => 225.00,
                'is_available_for_booking' => false, // Admin only
                'is_active' => true,
                'sort_order' => 7,
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
