<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Resource extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'type',
        'category',
        'content',
        'file_path',
        'external_url',
        'tags',
        'is_published',
        'view_count',
        'created_by',
    ];

    protected $casts = [
        'tags' => 'array',
        'is_published' => 'boolean',
        'view_count' => 'integer',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    // Scopes
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    // Get valid resource types
    public static function getValidTypes()
    {
        return ['article', 'link', 'emergency'];
    }

    public function scopeInCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function incrementViewCount()
    {
        $this->increment('view_count');
    }
}
