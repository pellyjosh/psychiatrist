<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('resources', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->enum('type', ['article', 'link', 'emergency'])->default('article');
            $table->string('category')->nullable();
            $table->text('content')->nullable(); // For article content
            $table->string('file_path')->nullable(); // For uploaded files
            $table->string('external_url')->nullable(); // For external links
            $table->json('tags')->nullable(); // Store tags as JSON array
            $table->boolean('is_published')->default(true);
            $table->integer('view_count')->default(0);
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            
            $table->index(['type', 'category']);
            $table->index('is_published');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resources');
    }
};
