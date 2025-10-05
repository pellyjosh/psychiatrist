<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResourceController extends Controller
{
    public function index(Request $request)
    {
        $query = Resource::published()->with('creator');

        // Handle search by title or description
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by type
        if ($type = $request->get('type')) {
            $query->ofType($type);
        }

        // Filter by category
        if ($category = $request->get('category')) {
            $query->inCategory($category);
        }

        $resources = $query->orderBy('created_at', 'desc')
                          ->paginate(12)
                          ->withQueryString();

        // Get categories for filter dropdown
        $categories = Resource::published()
                             ->whereNotNull('category')
                             ->distinct()
                             ->pluck('category')
                             ->sort()
                             ->values();

        return Inertia::render('user/resources/index', [
            'resources' => $resources,
            'filters' => [
                'search' => $request->get('search'),
                'type' => $request->get('type'),
                'category' => $request->get('category'),
            ],
            'categories' => $categories,
        ]);
    }

    public function show(Resource $resource)
    {
        // Only show published resources to users
        if (!$resource->is_published) {
            abort(404);
        }

        $resource->load('creator');
        $resource->incrementViewCount();
        
        // Get related resources
        $relatedResources = Resource::published()
                                  ->where('id', '!=', $resource->id)
                                  ->where(function ($query) use ($resource) {
                                      $query->where('category', $resource->category)
                                            ->orWhere('type', $resource->type);
                                  })
                                  ->limit(3)
                                  ->get();

        return Inertia::render('resource-show', [
            'resource' => $resource,
            'relatedResources' => $relatedResources,
        ]);
    }
}
