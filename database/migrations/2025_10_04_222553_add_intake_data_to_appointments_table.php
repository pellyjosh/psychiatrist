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
        Schema::table('appointments', function (Blueprint $table) {
            // Check if columns don't exist before adding them
            if (!Schema::hasColumn('appointments', 'service')) {
                $table->string('service')->nullable();
            }
            if (!Schema::hasColumn('appointments', 'preferred_date')) {
                $table->date('preferred_date')->nullable();
            }
            if (!Schema::hasColumn('appointments', 'preferred_time')) {
                $table->string('preferred_time')->nullable();
            }
            if (!Schema::hasColumn('appointments', 'provider')) {
                $table->string('provider')->nullable();
            }
            if (!Schema::hasColumn('appointments', 'reason')) {
                $table->text('reason')->nullable();
            }
            if (!Schema::hasColumn('appointments', 'previous_treatment')) {
                $table->text('previous_treatment')->nullable();
            }
            if (!Schema::hasColumn('appointments', 'medications')) {
                $table->text('medications')->nullable();
            }
            if (!Schema::hasColumn('appointments', 'emergency_contact')) {
                $table->string('emergency_contact')->nullable();
            }
            
            // Emergency contact details (only add relationship since name and phone exist)
            if (!Schema::hasColumn('appointments', 'emergency_contact_relationship')) {
                $table->string('emergency_contact_relationship')->nullable();
            }
            
            // Insurance information
            if (!Schema::hasColumn('appointments', 'has_insurance')) {
                $table->boolean('has_insurance')->default(true);
            }
            if (!Schema::hasColumn('appointments', 'insurance_policy_number')) {
                $table->string('insurance_policy_number')->nullable();
            }
            if (!Schema::hasColumn('appointments', 'insurance_group_number')) {
                $table->string('insurance_group_number')->nullable();
            }
            if (!Schema::hasColumn('appointments', 'subscriber_name')) {
                $table->string('subscriber_name')->nullable();
            }
            if (!Schema::hasColumn('appointments', 'subscriber_dob')) {
                $table->date('subscriber_dob')->nullable();
            }
            if (!Schema::hasColumn('appointments', 'subscriber_relationship')) {
                $table->string('subscriber_relationship')->nullable();
            }
            
            // Service details
            if (!Schema::hasColumn('appointments', 'alternate_date')) {
                $table->date('alternate_date')->nullable();
            }
            if (!Schema::hasColumn('appointments', 'alternate_time')) {
                $table->string('alternate_time')->nullable();
            }
            
            // Medical history (add new fields)
            if (!Schema::hasColumn('appointments', 'reason_for_visit')) {
                $table->text('reason_for_visit')->nullable();
            }
            if (!Schema::hasColumn('appointments', 'current_symptoms')) {
                $table->text('current_symptoms')->nullable();
            }
            if (!Schema::hasColumn('appointments', 'previous_psychiatric_treatment')) {
                $table->boolean('previous_psychiatric_treatment')->default(false);
            }
            if (!Schema::hasColumn('appointments', 'previous_psychiatric_details')) {
                $table->text('previous_psychiatric_details')->nullable();
            }
            if (!Schema::hasColumn('appointments', 'allergies')) {
                $table->text('allergies')->nullable();
            }
            if (!Schema::hasColumn('appointments', 'family_mental_health_history')) {
                $table->text('family_mental_health_history')->nullable();
            }
            if (!Schema::hasColumn('appointments', 'substance_use')) {
                $table->text('substance_use')->nullable();
            }
            
            // Intake questions
            if (!Schema::hasColumn('appointments', 'suicidal_thoughts')) {
                $table->boolean('suicidal_thoughts')->default(false);
            }
            if (!Schema::hasColumn('appointments', 'suicidal_thoughts_details')) {
                $table->text('suicidal_thoughts_details')->nullable();
            }
            if (!Schema::hasColumn('appointments', 'homicidal_thoughts')) {
                $table->boolean('homicidal_thoughts')->default(false);
            }
            if (!Schema::hasColumn('appointments', 'current_therapist')) {
                $table->boolean('current_therapist')->default(false);
            }
            if (!Schema::hasColumn('appointments', 'current_therapist_details')) {
                $table->text('current_therapist_details')->nullable();
            }
            if (!Schema::hasColumn('appointments', 'hospitalization_history')) {
                $table->boolean('hospitalization_history')->default(false);
            }
            if (!Schema::hasColumn('appointments', 'hospitalization_details')) {
                $table->text('hospitalization_details')->nullable();
            }
            
            // Preferences and additional info
            if (!Schema::hasColumn('appointments', 'language_preference')) {
                $table->string('language_preference')->default('English');
            }
            if (!Schema::hasColumn('appointments', 'accommodation_needs')) {
                $table->text('accommodation_needs')->nullable();
            }
            if (!Schema::hasColumn('appointments', 'referral_source')) {
                $table->string('referral_source')->nullable();
            }
            if (!Schema::hasColumn('appointments', 'primary_care_physician')) {
                $table->string('primary_care_physician')->nullable();
            }
            if (!Schema::hasColumn('appointments', 'medical_conditions')) {
                $table->text('medical_conditions')->nullable();
            }
            if (!Schema::hasColumn('appointments', 'current_stressors')) {
                $table->text('current_stressors')->nullable();
            }
            if (!Schema::hasColumn('appointments', 'suicidal_ideation')) {
                $table->boolean('suicidal_ideation')->default(false);
            }
            if (!Schema::hasColumn('appointments', 'preferred_communication')) {
                $table->string('preferred_communication')->default('phone');
            }
            if (!Schema::hasColumn('appointments', 'special_accommodations')) {
                $table->text('special_accommodations')->nullable();
            }
            
            // Legal and consent
            if (!Schema::hasColumn('appointments', 'terms')) {
                $table->boolean('terms')->default(false);
            }
            if (!Schema::hasColumn('appointments', 'hipaa_consent')) {
                $table->boolean('hipaa_consent')->default(false);
            }
            if (!Schema::hasColumn('appointments', 'telehealth_consent')) {
                $table->boolean('telehealth_consent')->default(false);
            }
            if (!Schema::hasColumn('appointments', 'consent_to_treatment')) {
                $table->boolean('consent_to_treatment')->default(false);
            }
            if (!Schema::hasColumn('appointments', 'privacy_policy')) {
                $table->boolean('privacy_policy')->default(false);
            }
            if (!Schema::hasColumn('appointments', 'telehealth')) {
                $table->boolean('telehealth')->default(false);
            }
            if (!Schema::hasColumn('appointments', 'financial_responsibility')) {
                $table->boolean('financial_responsibility')->default(false);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            // Only drop columns that exist and were added by this migration
            $columnsToCheck = [
                'service', 'preferred_date', 'preferred_time', 'provider', 'reason',
                'previous_treatment', 'medications', 'emergency_contact',
                'emergency_contact_relationship', 'has_insurance', 'insurance_policy_number',
                'insurance_group_number', 'subscriber_name', 'subscriber_dob',
                'subscriber_relationship', 'alternate_date', 'alternate_time',
                'reason_for_visit', 'current_symptoms', 'previous_psychiatric_treatment',
                'previous_psychiatric_details', 'allergies', 'family_mental_health_history',
                'substance_use', 'suicidal_thoughts', 'suicidal_thoughts_details',
                'homicidal_thoughts', 'current_therapist', 'current_therapist_details',
                'hospitalization_history', 'hospitalization_details', 'language_preference',
                'accommodation_needs', 'referral_source', 'primary_care_physician',
                'medical_conditions', 'current_stressors', 'suicidal_ideation',
                'preferred_communication', 'special_accommodations', 'terms',
                'hipaa_consent', 'telehealth_consent', 'consent_to_treatment',
                'privacy_policy', 'telehealth', 'financial_responsibility'
            ];
            
            foreach ($columnsToCheck as $column) {
                if (Schema::hasColumn('appointments', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
