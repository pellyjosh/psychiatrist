<?php

namespace Database\Seeders;

use App\Models\Resource;
use App\Models\User;
use Illuminate\Database\Seeder;

class ResourceSeeder extends Seeder
{
    public function run(): void
    {
        // Get the first admin user
        $admin = User::where('role', 'admin')->first();
        
        if (!$admin) {
            // Skip seeding if no admin exists
            return;
        }

        // Sample resources
        $resources = [
            [
                'title' => 'Understanding Anxiety: A Comprehensive Guide',
                'description' => 'Learn about the different types of anxiety disorders, their symptoms, and effective coping strategies.',
                'type' => 'article',
                'category' => 'Mental Health',
                'content' => 'Anxiety is a normal human emotion that everyone experiences from time to time. However, when anxiety becomes persistent, excessive, and interferes with daily life, it may indicate an anxiety disorder...',
                'tags' => ['anxiety', 'mental health', 'coping', 'self-help'],
                'is_published' => true,
                'created_by' => $admin->id,
            ],
            [
                'title' => 'Self-Care Strategies for Mental Wellness',
                'description' => 'Practical self-care techniques to support your mental health journey.',
                'type' => 'article',
                'category' => 'Self-Help',
                'content' => 'Self-care is an essential part of maintaining good mental health. Here are some effective strategies you can incorporate into your daily routine...',
                'tags' => ['self-care', 'wellness', 'mental health', 'daily habits'],
                'is_published' => true,
                'created_by' => $admin->id,
            ],
            [
                'title' => 'Crisis Helpline Directory',
                'description' => 'Important phone numbers and resources for mental health emergencies.',
                'type' => 'emergency',
                'category' => 'Emergency',
                'content' => 'CRISIS HOTLINES:\n\n24/7 Crisis Support:\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• National Domestic Violence Hotline: 1-800-799-7233\n\nLocal Emergency:\n• Emergency Services: 911\n• Local Crisis Center: (347) 450-3015\n\nOnline Support:\n• Crisis Chat: suicidepreventionlifeline.org\n• Veterans Crisis Line: 1-800-273-8255',
                'tags' => ['crisis', 'emergency', 'helpline', 'support'],
                'is_published' => true,
                'created_by' => $admin->id,
            ],
        ];

        foreach ($resources as $resource) {
            Resource::create($resource);
        }
    }
}
