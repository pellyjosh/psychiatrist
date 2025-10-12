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
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // e.g., 'initial-evaluation'
            $table->string('name'); // e.g., 'Initial Psychiatric Evaluation'
            $table->text('description')->nullable();
            $table->string('duration')->nullable(); // e.g., '60 minutes'
            $table->decimal('price', 8, 2)->nullable();
            $table->boolean('is_available_for_booking')->default(false); // Only follow-up and initial-evaluation for user booking
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
