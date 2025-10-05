<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResourceController extends Controller
{
    public function index(Request $request)
    {
        $query = Resource::with('creator');

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

        // Filter by published status
        if ($request->has('published')) {
            $published = $request->boolean('published');
            $query->where('is_published', $published);
        }

        $resources = $query->orderBy('created_at', 'desc')
                          ->paginate(15)
                          ->withQueryString();

        // Get statistics
                $stats = [
            'total' => Resource::count(),
            'published' => Resource::where('is_published', true)->count(),
            'unpublished' => Resource::where('is_published', false)->count(),
            'articles' => Resource::where('type', 'article')->count(),
            'links' => Resource::where('type', 'link')->count(),
            'emergency' => Resource::where('type', 'emergency')->count(),
        ];

        // Get categories for filter dropdown
        $categories = Resource::whereNotNull('category')
                             ->distinct()
                             ->pluck('category')
                             ->sort()
                             ->values();

        return Inertia::render('admin/resources/index', [
            'resources' => $resources,
            'filters' => [
                'search' => $request->get('search'),
                'type' => $request->get('type'),
                'category' => $request->get('category'),
                'published' => $request->get('published'),
            ],
            'stats' => $stats,
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/resources/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|in:article,video,pdf,link,audio',
            'category' => 'nullable|string|max:100',
            'content' => 'nullable|string',
            'external_url' => 'nullable|url',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'is_published' => 'boolean',
        ]);

        $validated['created_by'] = $request->user()->id;

        $resource = Resource::create($validated);

        return redirect()->route('admin.resources.index')
                        ->with('success', 'Resource created successfully.');
    }

    public function show(Resource $resource)
    {
        $resource->load('creator');
        
        return Inertia::render('resource-show', [
            'resource' => $resource,
        ]);
    }

    public function edit(Resource $resource)
    {
        return Inertia::render('admin/resources/edit', [
            'resource' => $resource,
        ]);
    }

    public function update(Request $request, Resource $resource)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|in:article,video,pdf,link,audio',
            'category' => 'nullable|string|max:100',
            'content' => 'nullable|string',
            'external_url' => 'nullable|url',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'is_published' => 'boolean',
        ]);

        $resource->update($validated);

        return redirect()->route('admin.resources.index')
                        ->with('success', 'Resource updated successfully.');
    }

    public function destroy(Resource $resource)
    {
        $resource->delete();

        return redirect()->route('admin.resources.index')
                        ->with('success', 'Resource deleted successfully.');
    }
}
