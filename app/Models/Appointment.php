<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\SoftDeletes;

class Appointment extends Model
{
	use HasFactory, SoftDeletes;

	protected $fillable = [
		'user_id',
		'first_name',
		'last_name',
		'email',
		'phone',
		'date_of_birth',
		'service',
		'preferred_date',
		'preferred_time',
		'provider',
		'insurance_provider',
		'reason',
		'previous_treatment',
		'medications',
		'emergency_contact',
		'status',
		'admin_notes',
		'confirmed_at',
		'cancelled_at',
		
		// Required fields from original migration
		'appointment_date',
		'appointment_time',
		'appointment_type',
		'chief_complaint',
		'emergency_contact_name',
		'emergency_contact_phone',
		
		// Client status
		'is_returning_client',
		
		// Extended personal information
		'middle_name',
		'alternate_phone',
		'gender',
		'address',
		'city',
		'state',
		'zip_code',
		
		// Emergency contact details
		'emergency_contact_relationship',
		
		// Insurance information
		'has_insurance',
		'insurance_policy_number',
		'insurance_group_number',
		'subscriber_name',
		'subscriber_dob',
		'subscriber_relationship',
		
		// Service details
		'alternate_date',
		'alternate_time',
		
		// Medical history
		'reason_for_visit',
		'current_symptoms',
		'previous_psychiatric_treatment',
		'previous_psychiatric_details',
		'current_medications',
		'allergies',
		'medical_history',
		'family_mental_health_history',
		'substance_use',
		
		// Intake questions
		'suicidal_thoughts',
		'suicidal_thoughts_details',
		'homicidal_thoughts',
		'current_therapist',
		'current_therapist_details',
		'hospitalization_history',
		'hospitalization_details',
		
		// Preferences and additional info
		'language_preference',
		'accommodation_needs',
		'referral_source',
		'primary_care_physician',
		'medical_conditions',
		'current_stressors',
		'suicidal_ideation',
		'preferred_communication',
		'special_accommodations',
		
		// Legal and consent
		'terms',
		'hipaa_consent',
		'telehealth_consent',
		'consent_to_treatment',
		'privacy_policy',
		'telehealth',
		'financial_responsibility',
	];

	protected $casts = [
		'preferred_date' => 'date',
		'date_of_birth'  => 'date',
		'confirmed_at'   => 'datetime',
		'cancelled_at'   => 'datetime',
		'deleted_at'     => 'datetime',
		
		// Required original migration date fields
		'appointment_date' => 'date',
		
		// New date fields
		'subscriber_dob' => 'date',
		'alternate_date' => 'date',
		
		// Boolean fields
		'is_returning_client' => 'boolean',
		'has_insurance' => 'boolean',
		'previous_psychiatric_treatment' => 'boolean',
		'suicidal_thoughts' => 'boolean',
		'homicidal_thoughts' => 'boolean',
		'current_therapist' => 'boolean',
		'hospitalization_history' => 'boolean',
		'suicidal_ideation' => 'boolean',
		'terms' => 'boolean',
		'hipaa_consent' => 'boolean',
		'telehealth_consent' => 'boolean',
		'consent_to_treatment' => 'boolean',
		'privacy_policy' => 'boolean',
		'telehealth' => 'boolean',
		'financial_responsibility' => 'boolean',
	];

	// Relationships
	public function user()
	{
		return $this->belongsTo(User::class);
	}

	// Query Scopes
	public function scopePending(Builder $query): Builder
	{
		return $query->where('status', 'pending');
	}

	public function scopeThisWeek(Builder $query): Builder
	{
		return $query->whereBetween('preferred_date', [now()->startOfWeek(), now()->endOfWeek()]);
	}

	public function scopeToday(Builder $query): Builder
	{
		return $query->whereDate('preferred_date', now()->toDateString());
	}
}
