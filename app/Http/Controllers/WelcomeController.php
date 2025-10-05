<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    public function index(): Response
    {
        // Get published resources for the welcome page (limit to 6 for display)
        $resources = Resource::published()
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get()
            ->map(function ($resource) {
                return [
                    'id' => $resource->id,
                    'title' => $resource->title,
                    'description' => $resource->description,
                    'category' => $resource->category,
                    'type' => $resource->type,
                ];
            });

        return Inertia::render('welcome', [
            'resources' => $resources,
        ]);
    }
}