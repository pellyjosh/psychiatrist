<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AppointmentType;

class AppointmentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $appointmentTypes = [
            [
                'code' => 'telehealth',
                'name' => 'Telehealth',
                'description' => 'Virtual appointment via video call',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'code' => 'in-person',
                'name' => 'In-Person',
                'description' => 'Face-to-face appointment at the clinic',
                'is_active' => true,
                'sort_order' => 2,
            ],
        ];

        foreach ($appointmentTypes as $type) {
            AppointmentType::create($type);
        }
    }
}
