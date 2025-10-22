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
        Schema::table('appointments', function (Blueprint $table) {
            if (!Schema::hasColumn('appointments', 'appointment_date')) {
                $table->date('appointment_date')->nullable()->after('preferred_date');
            }
            if (!Schema::hasColumn('appointments', 'appointment_time')) {
                $table->string('appointment_time')->nullable()->after('preferred_time');
            }
        });

        // Backfill appointment_date/time from preferred_date/preferred_time for existing rows
        // Use DB::table to avoid model casts
        try {
            DB::table('appointments')
                ->whereNotNull('preferred_date')
                ->update(['appointment_date' => DB::raw('preferred_date')]);

            DB::table('appointments')
                ->whereNotNull('preferred_time')
                ->update(['appointment_time' => DB::raw('preferred_time')]);
        } catch (\Exception $e) {
            // If the database engine doesn't support the raw assignment this way,
            // do nothing here; column will remain nullable and can be backfilled later.
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            if (Schema::hasColumn('appointments', 'appointment_time')) {
                $table->dropColumn('appointment_time');
            }
            if (Schema::hasColumn('appointments', 'appointment_date')) {
                $table->dropColumn('appointment_date');
            }
        });
    }
};
