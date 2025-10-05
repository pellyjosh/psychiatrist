<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, update any existing video/document/pdf resources to appropriate types
        DB::table('resources')
            ->where('type', 'video')
            ->update(['type' => 'link']);
            
        DB::table('resources')
            ->where('type', 'document')
            ->update(['type' => 'article']);
            
        DB::table('resources')
            ->where('type', 'pdf')
            ->update(['type' => 'article']);

        // Drop the old check constraint and create a new one
        Schema::table('resources', function (Blueprint $table) {
            $table->dropColumn('type');
        });
        
        Schema::table('resources', function (Blueprint $table) {
            $table->enum('type', ['article', 'link', 'emergency'])->after('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('resources', function (Blueprint $table) {
            $table->dropColumn('type');
        });
        
        Schema::table('resources', function (Blueprint $table) {
            $table->enum('type', ['article', 'video', 'link', 'document'])->after('description');
        });
    }
};
