<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AppointmentController extends Controller
{

    public function book()
    {
        // Get services available for user booking (only follow-up and initial-evaluation)
        $services = \App\Models\Service::availableForBooking()->active()->ordered()->get(['id', 'code', 'name', 'duration', 'description']);
        
        // Get all appointment types for user selection
        $appointmentTypes = \App\Models\AppointmentType::active()->ordered()->get(['id', 'code', 'name']);

        return Inertia::render('appointment-booking', [
            'services' => $services,
            'appointmentTypes' => $appointmentTypes,
        ]);
    }

    public function store(Request $request)
    {
        // Log the incoming request for debugging
        Log::info('Appointment form submission:', $request->all());
        
        $validated = $request->validate([
            // Client status
            'isReturningClient' => 'nullable|boolean',
            
            // Personal Information
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'middleName' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'alternatePhone' => 'nullable|string|max:20',
            'dateOfBirth' => 'required|date|before:today',
            'gender' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:50',
            'zipCode' => 'nullable|string|max:20',
            
            // Emergency Contact
            'emergencyContactName' => 'nullable|string|max:255',
            'emergencyContactRelationship' => 'nullable|string|max:100',
            'emergencyContactPhone' => 'nullable|string|max:20',
            
            // Insurance Information
            'hasInsurance' => 'nullable|boolean',
            'insuranceProvider' => 'nullable|string|max:255',
            'insurancePolicyNumber' => 'nullable|string|max:100',
            'insuranceGroupNumber' => 'nullable|string|max:100',
            'subscriberName' => 'nullable|string|max:255',
            'subscriberDOB' => 'nullable|date',
            'subscriberRelationship' => 'nullable|string|max:100',
            
            // Service Selection
            'service' => 'required|in:initial-evaluation,follow-up',
            'appointmentType' => 'nullable|string|max:50',
            'preferredDate' => 'required|date|after_or_equal:today',
            'preferredTime' => 'required|string',
            'alternateDate' => 'nullable|date|after_or_equal:today',
            'alternateTime' => 'nullable|string',
            
            // Medical History
            'reasonForVisit' => 'required|string',
            'currentSymptoms' => 'nullable|string',
            'previousPsychiatricTreatment' => 'nullable|boolean',
            'previousPsychiatricDetails' => 'nullable|string',
            'currentMedications' => 'nullable|string',
            'allergies' => 'nullable|string',
            'medicalHistory' => 'nullable|string',
            'familyMentalHealthHistory' => 'nullable|string',
            'substanceUse' => 'nullable|string',
            
            // Intake Questions
            'suicidalThoughts' => 'nullable|boolean',
            'suicidalThoughtsDetails' => 'nullable|string',
            'homicidalThoughts' => 'nullable|boolean',
            'currentTherapist' => 'nullable|boolean',
            'currentTherapistDetails' => 'nullable|string',
            'hospitalizationHistory' => 'nullable|boolean',
            'hospitalizationDetails' => 'nullable|string',
            
            // Preferences
            'languagePreference' => 'nullable|string|max:50',
            'accommodationNeeds' => 'nullable|string',
            'referralSource' => 'nullable|string|max:100',
            'primaryCarePhysician' => 'nullable|string|max:255',
            'medicalConditions' => 'nullable|string',
            'currentStressors' => 'nullable|string',
            'suicidalIdeation' => 'nullable|boolean',
            'preferredCommunication' => 'nullable|string|max:50',
            'specialAccommodations' => 'nullable|string',
            
            // Legal & Consent
            'terms' => 'required|accepted',
            'hipaaConsent' => 'required|accepted',
            'telehealthConsent' => 'nullable|boolean',
            'consentToTreatment' => 'required|accepted',
            'privacyPolicy' => 'nullable|boolean',
            'telehealth' => 'nullable|boolean',
            'financialResponsibility' => 'required|accepted',
            
            // Legacy fields (for backward compatibility)
            'provider' => 'nullable|string',
            'reason' => 'nullable|string',
            'previousTreatment' => 'nullable|string',
            'medications' => 'nullable|string',
            'emergencyContact' => 'nullable|string|max:255',
            'isReturning' => 'nullable|boolean'
        ]);

        try {
            $normalizedPhone = preg_replace('/[^0-9]/', '', $validated['phone']);

            $user = User::where('email', $validated['email'])->first();

            if (!$user) {
                $user = User::create([
                    'name' => $validated['firstName'] . ' ' . $validated['lastName'],
                    'email' => $validated['email'],
                    'password' => Hash::make(Str::random(12)),
                    'email_verified_at' => now(),
                    'role' => 'user',
                ]);
                Log::info('Created new user:', ['id' => $user->id, 'email' => $user->email]);
            }

        $appointmentData = [
            'user_id' => $user->id,
            'status' => 'pending',
            
            // Required fields from original migration
            'appointment_date' => $validated['preferredDate'],
            'appointment_time' => $validated['preferredTime'],
            'appointment_type' => $validated['appointmentType'] ?? 'telehealth',
            'chief_complaint' => $validated['reasonForVisit'],
            'emergency_contact_name' => $validated['emergencyContactName'] ?? 'Not provided',
            'emergency_contact_phone' => $validated['emergencyContactPhone'] ?? 'Not provided',
            
            // Client status
            'is_returning_client' => $validated['isReturningClient'] ?? false,
            
            // Personal Information
            'first_name' => $validated['firstName'],
            'last_name' => $validated['lastName'],
            'middle_name' => $validated['middleName'] ?? null,
            'email' => $validated['email'],
            'phone' => $normalizedPhone,
            'alternate_phone' => $validated['alternatePhone'] ?? null,
            'date_of_birth' => $validated['dateOfBirth'],
            'gender' => $validated['gender'] ?? null,
            'address' => $validated['address'] ?? null,
            'city' => $validated['city'] ?? null,
            'state' => $validated['state'] ?? null,
            'zip_code' => $validated['zipCode'] ?? null,
            
            // Emergency Contact
            'emergency_contact_relationship' => $validated['emergencyContactRelationship'] ?? null,
            
            // Insurance Information
            'has_insurance' => $validated['hasInsurance'] ?? true,
            'insurance_provider' => $validated['insuranceProvider'] ?? null,
            'insurance_policy_number' => $validated['insurancePolicyNumber'] ?? null,
            'insurance_group_number' => $validated['insuranceGroupNumber'] ?? null,
            'subscriber_name' => $validated['subscriberName'] ?? null,
            'subscriber_dob' => $validated['subscriberDOB'] ?? null,
            'subscriber_relationship' => $validated['subscriberRelationship'] ?? null,
            
            // Service Selection
            'service' => $validated['service'],
            'preferred_date' => $validated['preferredDate'],
            'preferred_time' => $validated['preferredTime'],
            'alternate_date' => $validated['alternateDate'] ?? null,
            'alternate_time' => $validated['alternateTime'] ?? null,
            
            // Medical History
            'reason_for_visit' => $validated['reasonForVisit'] ?? $validated['reason'] ?? null,
            'current_symptoms' => $validated['currentSymptoms'] ?? null,
            'previous_psychiatric_treatment' => $validated['previousPsychiatricTreatment'] ?? false,
            'previous_psychiatric_details' => $validated['previousPsychiatricDetails'] ?? null,
            'current_medications' => $validated['currentMedications'] ?? $validated['medications'] ?? null,
            'allergies' => $validated['allergies'] ?? null,
            'medical_history' => $validated['medicalHistory'] ?? null,
            'family_mental_health_history' => $validated['familyMentalHealthHistory'] ?? null,
            'substance_use' => $validated['substanceUse'] ?? null,
            
            // Intake Questions
            'suicidal_thoughts' => $validated['suicidalThoughts'] ?? false,
            'suicidal_thoughts_details' => $validated['suicidalThoughtsDetails'] ?? null,
            'homicidal_thoughts' => $validated['homicidalThoughts'] ?? false,
            'current_therapist' => $validated['currentTherapist'] ?? false,
            'current_therapist_details' => $validated['currentTherapistDetails'] ?? null,
            'hospitalization_history' => $validated['hospitalizationHistory'] ?? false,
            'hospitalization_details' => $validated['hospitalizationDetails'] ?? null,
            
            // Preferences
            'language_preference' => $validated['languagePreference'] ?? 'English',
            'accommodation_needs' => $validated['accommodationNeeds'] ?? null,
            'referral_source' => $validated['referralSource'] ?? null,
            'primary_care_physician' => $validated['primaryCarePhysician'] ?? null,
            'medical_conditions' => $validated['medicalConditions'] ?? null,
            'current_stressors' => $validated['currentStressors'] ?? null,
            'suicidal_ideation' => $validated['suicidalIdeation'] ?? false,
            'preferred_communication' => $validated['preferredCommunication'] ?? 'phone',
            'special_accommodations' => $validated['specialAccommodations'] ?? null,
            
            // Legal & Consent
            'terms' => $validated['terms'] ?? false,
            'hipaa_consent' => $validated['hipaaConsent'] ?? false,
            'telehealth_consent' => $validated['telehealthConsent'] ?? false,
            'consent_to_treatment' => $validated['consentToTreatment'] ?? false,
            'privacy_policy' => $validated['privacyPolicy'] ?? false,
            'telehealth' => $validated['telehealth'] ?? false,
            'financial_responsibility' => $validated['financialResponsibility'] ?? false,
            
            // Legacy fields (for backward compatibility)
            'provider' => $validated['provider'] ?? 'Dr. Lola Akinola, PMHNP-BC',
            'reason' => $validated['reason'] ?? $validated['reasonForVisit'] ?? null,
            'previous_treatment' => $validated['previousTreatment'] ?? $validated['previousPsychiatricDetails'] ?? null,
            'medications' => $validated['medications'] ?? $validated['currentMedications'] ?? null,
            'emergency_contact' => $validated['emergencyContact'] ?? $validated['emergencyContactName'] ?? null,
        ];

        $appointment = Appointment::create($appointmentData);

        Log::info('Created appointment:', ['id' => $appointment->id, 'user_id' => $user->id]);

        // Notify admins and the user
        try {
            $admins = User::where('role', 'admin')->get();
            foreach ($admins as $admin) {
                $admin->notify(new \App\Notifications\AppointmentCreated($appointment));
            }

            // Notify the user who requested
            $user->notify(new \App\Notifications\AppointmentCreated($appointment));
        } catch (\Exception $e) {
            Log::error('Notification error on appointment created: ' . $e->getMessage());
        }

        // Don't auto-login the user, just return success response
        return back()->with('success', 'Your appointment request has been submitted successfully! We will contact you within 24 hours to confirm your appointment.');
            
        } catch (\Exception $e) {
            Log::error('Error creating appointment:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $validated ?? $request->all()
            ]);
            
            return back()
                ->withErrors(['general' => 'There was an error processing your appointment request. Please try again.'])
                ->withInput();
        }
    }

    public function checkReturningClient(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
        ]);

        $user = User::where('email', $validated['email'])->first();
        
        if ($user) {
            // Get the most recent appointment for this user
            $lastAppointment = Appointment::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->first();
                
            if ($lastAppointment) {
                return response()->json([
                    'found' => true,
                    'user' => [
                        'firstName' => $lastAppointment->first_name,
                        'lastName' => $lastAppointment->last_name,
                        'email' => $lastAppointment->email,
                        'phone' => $lastAppointment->phone,
                        'dateOfBirth' => $lastAppointment->date_of_birth?->format('Y-m-d'),
                    ]
                ]);
            }
        }

        return response()->json([
            'found' => false,
            'message' => 'No previous appointments found for this email address.'
        ]);
    }
}
