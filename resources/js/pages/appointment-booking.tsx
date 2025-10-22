import { SharedHeader } from '@/components/shared-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormButton, IconButton } from '@/components/ui/form-button';
import { FormCheckbox, FormInput, FormPhoneUS, FormRadio, FormRadioGroup, FormSelect, FormTextarea } from '@/components/ui/form-inputs';
import { Head, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Calendar,
    CheckCircle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    FileText,
    Heart,
    RotateCcw,
    Shield,
    Timer,
    User,
    UserCheck,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface AppointmentData {
    // Client status
    isReturningClient: boolean;

    // Personal Information
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    phone: string;
    alternatePhone: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;

    // Emergency Contact
    emergencyContactName: string;
    emergencyContactRelationship: string;
    emergencyContactPhone: string;

    // Insurance Information
    hasInsurance: boolean;
    insuranceProvider: string;
    insurancePolicyNumber: string;
    insuranceGroupNumber: string;
    subscriberName: string;
    subscriberDOB: string;
    subscriberRelationship: string;

    // Service Selection
    service: string;
    appointmentType: string;
    preferredDate: string;
    preferredTime: string;
    alternateDate: string;
    alternateTime: string;

    // Medical History
    reasonForVisit: string;
    currentSymptoms: string;
    previousPsychiatricTreatment: boolean;
    previousPsychiatricDetails: string;
    currentMedications: string;
    allergies: string;
    medicalHistory: string;
    familyMentalHealthHistory: string;
    substanceUse: string;

    // Intake Questions
    suicidalThoughts: boolean;
    suicidalThoughtsDetails: string;
    homicidalThoughts: boolean;
    currentTherapist: boolean;
    currentTherapistDetails: string;
    hospitalizationHistory: boolean;
    hospitalizationDetails: string;

    // Preferences
    languagePreference: string;
    accommodationNeeds: string;
    referralSource: string;

    // Additional fields for comprehensive intake
    primaryCarePhysician: string;
    medicalConditions: string;
    currentStressors: string;
    suicidalIdeation: boolean;
    preferredCommunication: string;
    specialAccommodations: string;

    // Legal & Consent
    terms: boolean;
    hipaaConsent: boolean;
    telehealthConsent: boolean;
    consentToTreatment: boolean;
    privacyPolicy: boolean;
    telehealth: boolean;
    financialResponsibility: boolean;
}

interface Service {
    id: number;
    code: string;
    name: string;
    duration: number;
    description?: string;
}

interface AppointmentType {
    id: number;
    code: string;
    name: string;
}

interface AppointmentBookingProps {
    services: Service[];
    appointmentTypes: AppointmentType[];
}

export default function AppointmentBooking({ services = [], appointmentTypes = [] }: AppointmentBookingProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [availableTimes, setAvailableTimes] = useState<{ value: string; label: string }[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isReturningClient, setIsReturningClient] = useState(false);
    const [returningClientEmail, setReturningClientEmail] = useState('');
    const [clientFound, setClientFound] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
    const [autoSaveStatus, setAutoSaveStatus] = useState<'saving' | 'saved' | 'error' | null>(null);
    const [showDraftModal, setShowDraftModal] = useState(false);
    const [savedDraftData, setSavedDraftData] = useState<AppointmentData | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    // Auto-save key for localStorage
    const AUTO_SAVE_KEY = 'appointment-booking-draft';

    // Load saved data from localStorage (just check, don't set state)
    const loadSavedData = (): AppointmentData => {
        return getDefaultFormData();
    };

    // Default form data
    const getDefaultFormData = (): AppointmentData => ({
        // Client status
        isReturningClient: false,

        // Personal Information
        firstName: '',
        lastName: '',
        middleName: '',
        email: '',
        phone: '',
        alternatePhone: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',

        // Emergency Contact
        emergencyContactName: '',
        emergencyContactRelationship: '',
        emergencyContactPhone: '',

        // Insurance Information
        hasInsurance: true,
        insuranceProvider: '',
        insurancePolicyNumber: '',
        insuranceGroupNumber: '',
        subscriberName: '',
        subscriberDOB: '',
        subscriberRelationship: '',

        // Service Selection
        service: 'initial-evaluation',
        appointmentType: 'telehealth',
        preferredDate: '',
        preferredTime: '',
        alternateDate: '',
        alternateTime: '',

        // Medical History
        reasonForVisit: '',
        currentSymptoms: '',
        previousPsychiatricTreatment: false,
        previousPsychiatricDetails: '',
        currentMedications: '',
        allergies: '',
        medicalHistory: '',
        familyMentalHealthHistory: '',
        substanceUse: '',

        // Intake Questions
        suicidalThoughts: false,
        suicidalThoughtsDetails: '',
        homicidalThoughts: false,
        currentTherapist: false,
        currentTherapistDetails: '',
        hospitalizationHistory: false,
        hospitalizationDetails: '',

        // Preferences
        languagePreference: 'English',
        accommodationNeeds: '',
        referralSource: '',

        // Additional fields for comprehensive intake
        primaryCarePhysician: '',
        medicalConditions: '',
        currentStressors: '',
        suicidalIdeation: false,
        preferredCommunication: 'phone',
        specialAccommodations: '',

        // Legal & Consent
        terms: false,
        hipaaConsent: false,
        telehealthConsent: false,
        consentToTreatment: false,
        privacyPolicy: false,
        telehealth: false,
        financialResponsibility: false,
    });

    const { data, setData, post, processing, errors } = useForm<AppointmentData>(loadSavedData());

    // Convert database services to the format expected by the UI
    const formattedServices = services.map((service) => ({
        id: service.code,
        name: service.name,
        duration: `${service.duration} minutes`,
        description: service.description || '',
        category: service.code.includes('evaluation') ? 'evaluation' : 'follow-up',
    }));

    // All services for admin use (can be expanded when needed)
    const allServices = formattedServices;
    const insuranceProviders = ['Aetna', 'Anthem', 'Blue Cross Blue Shield', 'Cigna', 'Kaiser Permanente', 'Medicare', 'UnitedHealth', 'Other'];

    const states = [
        'AL',
        'AK',
        'AZ',
        'AR',
        'CA',
        'CO',
        'CT',
        'DE',
        'FL',
        'GA',
        'HI',
        'ID',
        'IL',
        'IN',
        'IA',
        'KS',
        'KY',
        'LA',
        'ME',
        'MD',
        'MA',
        'MI',
        'MN',
        'MS',
        'MO',
        'MT',
        'NE',
        'NV',
        'NH',
        'NJ',
        'NM',
        'NY',
        'NC',
        'ND',
        'OH',
        'OK',
        'OR',
        'PA',
        'RI',
        'SC',
        'SD',
        'TN',
        'TX',
        'UT',
        'VT',
        'VA',
        'WA',
        'WV',
        'WI',
        'WY',
    ];

    const totalSteps = 6;

    const stepTitles = {
        1: 'Service Selection',
        2: 'Date & Time',
        3: 'Personal Information',
        4: 'Insurance Details',
        5: 'Medical History',
        6: 'Review & Confirm',
    };

    // Validation functions
    const validateEmail = (email: string): string | null => {
        if (!email) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return 'Please enter a valid email address';
        return null;
    };

    const validatePhone = (phone: string): string | null => {
        if (!phone) return 'Phone number is required';
        // Accept common phone formats including international (+), parentheses, dashes and spaces
        const phoneRegex = /^\+?[0-9()\.\-\s]{7,20}$/;
        if (!phoneRegex.test(phone)) return 'Please enter a valid phone number (e.g. +1 (555) 555-5555)';
        return null;
    };

    const validateRequired = (value: string | boolean, fieldName: string): string | null => {
        if (typeof value === 'boolean') {
            return !value ? `${fieldName} is required` : null;
        }
        return !value?.trim() ? `${fieldName} is required` : null;
    };

    const validateDateOfBirth = (dob: string): string | null => {
        if (!dob) return 'Date of birth is required';
        const date = new Date(dob);
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        if (age < 18) return 'Must be 18 years or older';
        if (age > 120) return 'Please enter a valid date of birth';
        return null;
    };

    const validateZipCode = (zip: string): string | null => {
        if (!zip) return 'ZIP code is required';
        const zipRegex = /^\d{5}(-\d{4})?$/;
        if (!zipRegex.test(zip)) return 'Please enter a valid ZIP code';
        return null;
    };

    // Step-specific validation rules
    const stepValidationRules = {
        1: ['service'], // Service Selection
        2: ['preferredDate', 'preferredTime'], // Date & Time
        3:
            isReturningClient && clientFound
                ? ['email'] // Only email for returning clients
                : ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender', 'address', 'city', 'state', 'zipCode'], // Personal Information
        4: data.hasInsurance ? ['insuranceProvider', 'insurancePolicyNumber', 'subscriberName'] : [], // Insurance Details (conditional)
        5: ['reasonForVisit'], // Medical History (at least reason required)
        6: ['terms', 'hipaaConsent', 'consentToTreatment', 'privacyPolicy'], // Legal & Consent
    };

    // Real-time validation
    const validateField = (fieldName: string, value: any): string | null => {
        switch (fieldName) {
            case 'email':
                return validateEmail(value);
            case 'phone':
            case 'alternatePhone':
            case 'emergencyContactPhone':
                return value ? validatePhone(value) : null; // Only validate if provided
            case 'dateOfBirth':
                return validateDateOfBirth(value);
            case 'zipCode':
                return validateZipCode(value);
            case 'firstName':
                return validateRequired(value, 'First name');
            case 'lastName':
                return validateRequired(value, 'Last name');
            case 'gender':
                return validateRequired(value, 'Gender');
            case 'address':
                return validateRequired(value, 'Address');
            case 'city':
                return validateRequired(value, 'City');
            case 'state':
                return validateRequired(value, 'State');
            case 'service':
                return validateRequired(value, 'Service');
            case 'preferredDate':
                return validateRequired(value, 'Preferred date');
            case 'preferredTime':
                return validateRequired(value, 'Preferred time');
            case 'reasonForVisit':
                return validateRequired(value, 'Reason for visit');
            case 'insuranceProvider':
                return data.hasInsurance ? validateRequired(value, 'Insurance provider') : null;
            case 'insurancePolicyNumber':
                return data.hasInsurance ? validateRequired(value, 'Policy number') : null;
            case 'subscriberName':
                return data.hasInsurance ? validateRequired(value, 'Subscriber name') : null;
            case 'terms':
                return value === true ? null : 'You must accept the terms and conditions';
            case 'hipaaConsent':
                return value === true ? null : 'HIPAA consent is required';
            case 'consentToTreatment':
                return value === true ? null : 'Consent to treatment is required';
            default:
                return null;
        }
    };

    // Validate current step
    const validateCurrentStep = (): boolean => {
        const currentStepFields = stepValidationRules[currentStep as keyof typeof stepValidationRules] || [];
        const stepErrors: Record<string, string> = {};
        let isValid = true;

        currentStepFields.forEach((fieldName) => {
            const value = data[fieldName as keyof AppointmentData];
            const error = validateField(fieldName, value);
            if (error) {
                stepErrors[fieldName] = error;
                isValid = false;
            }
        });

        setValidationErrors((prev) => ({ ...prev, ...stepErrors }));
        return isValid;
    };

    // Handle field changes with validation
    const handleFieldChange = (fieldName: string, value: any) => {
        setData(fieldName as keyof AppointmentData, value);
        setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));

        // Clear previous error and validate
        setValidationErrors((prev) => {
            const updated = { ...prev };
            delete updated[fieldName];

            const error = validateField(fieldName, value);
            if (error && touchedFields[fieldName]) {
                updated[fieldName] = error;
            }

            return updated;
        });
    };

    // Check if step is valid (for UI indicators)
    const isStepValid = useMemo(() => {
        const currentStepFields = stepValidationRules[currentStep as keyof typeof stepValidationRules] || [];
        return currentStepFields.every((fieldName) => {
            const value = data[fieldName as keyof AppointmentData];
            return !validateField(fieldName, value);
        });
    }, [currentStep, data, isReturningClient, clientFound]);

    // Get field error
    const getFieldError = (fieldName: string): string | undefined => {
        return validationErrors[fieldName] || errors[fieldName as keyof AppointmentData];
    };

    // Calendar logic
    useEffect(() => {
        generateAvailableDates();
    }, [currentMonth]);

    // Check for saved data on component mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(AUTO_SAVE_KEY);
            if (saved) {
                const parsedData = JSON.parse(saved);
                console.log('Loaded saved appointment data');

                // Store saved data and show modal after a short delay
                const savedData = { ...getDefaultFormData(), ...parsedData };
                setSavedDraftData(savedData);
                setTimeout(() => {
                    setShowDraftModal(true);
                }, 1000);
            }
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }, []);

    const generateAvailableDates = () => {
        const dates = [];
        const today = new Date();
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            // Skip weekends and past dates
            if (date.getDay() !== 0 && date.getDay() !== 6 && date >= today) {
                dates.push(date.toISOString().split('T')[0]);
            }
        }
        setAvailableDates(dates);
    };

    const generateTimeSlots = () => {
        const times: { value: string; label: string }[] = [];
        const tz = (import.meta.env.VITE_APP_TIMEZONE as string) || Intl.DateTimeFormat().resolvedOptions().timeZone;

        for (let hour = 9; hour < 17; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const value = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                // build a Date object in local timezone using selectedDate (fallback to today)
                const base = selectedDate ? new Date(`${selectedDate}T${value}:00`) : new Date();
                base.setHours(hour, minute, 0, 0);

                // Format label in 12-hour format using the configured timezone if available
                let label = value;
                try {
                    const fmt = new Intl.DateTimeFormat('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                        timeZone: tz,
                    });
                    label = fmt.format(base);
                } catch (e) {
                    // fallback
                    const hh = ((hour + 11) % 12) + 1;
                    const ampm = hour >= 12 ? 'PM' : 'AM';
                    label = `${hh}:${minute.toString().padStart(2, '0')} ${ampm}`;
                }

                times.push({ value, label });
            }
        }
        setAvailableTimes(times);
    };

    const isDateAvailable = (dateString: string) => {
        return availableDates.includes(dateString);
    };

    const isDateInPast = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1));
        setCurrentMonth(newMonth);
    };

    // Auto-save functionality
    const saveToLocalStorage = useMemo(() => {
        let timeoutId: NodeJS.Timeout;
        return (formData: AppointmentData) => {
            clearTimeout(timeoutId);
            setAutoSaveStatus('saving');

            timeoutId = setTimeout(() => {
                try {
                    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(formData));
                    setAutoSaveStatus('saved');

                    // Clear status after 2 seconds
                    setTimeout(() => setAutoSaveStatus(null), 2000);
                } catch (error) {
                    console.error('Error saving to localStorage:', error);
                    setAutoSaveStatus('error');
                    setTimeout(() => setAutoSaveStatus(null), 3000);
                }
            }, 1000); // Debounce for 1 second
        };
    }, []);

    // Clear saved data after successful submission
    const clearSavedData = () => {
        try {
            localStorage.removeItem(AUTO_SAVE_KEY);
            console.log('Cleared saved appointment data');
        } catch (error) {
            console.error('Error clearing saved data:', error);
        }
    };

    // Handle continuing with saved draft
    const handleContinueWithDraft = () => {
        if (savedDraftData) {
            // Update form with saved data
            Object.keys(savedDraftData).forEach((key) => {
                const value = savedDraftData[key as keyof AppointmentData];
                setData(key as keyof AppointmentData, value);
            });
        }
        setShowDraftModal(false);
        setSavedDraftData(null);
    };

    // Handle starting fresh
    const handleStartFresh = () => {
        clearSavedData();
        setShowDraftModal(false);
        setSavedDraftData(null);
        // Form already has default data
    };

    // Auto-save when form data changes
    useEffect(() => {
        // Don't auto-save empty forms or if processing
        if (data.firstName || data.lastName || data.email || data.service) {
            saveToLocalStorage(data);
        }
    }, [data, saveToLocalStorage]);

    const checkReturningClient = async (email: string) => {
        if (!email) return;

        try {
            const response = await fetch('/appointments/check-returning-client', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();

            if (result.found && result.user) {
                setClientFound(true);
                // Pre-fill form with found user data
                handleFieldChange('firstName', result.user.firstName || '');
                handleFieldChange('lastName', result.user.lastName || '');
                handleFieldChange('email', result.user.email || '');
                handleFieldChange('phone', result.user.phone || '');
                handleFieldChange('dateOfBirth', result.user.dateOfBirth || '');
            } else {
                setClientFound(false);
                alert(result.message || 'No previous appointments found for this email address.');
            }
        } catch (error) {
            console.error('Error checking returning client:', error);
            setClientFound(false);
            alert('Error checking client information. Please try again.');
        }
    };

    const handleSubmit = () => {
        // Final validation before submission - collect all required fields from all steps
        const allFields: string[] = [];

        // Manually iterate through each step to ensure proper validation
        for (let step = 1; step <= 6; step++) {
            const stepFields = stepValidationRules[step as keyof typeof stepValidationRules] || [];
            allFields.push(...stepFields);
        }

        const newTouchedFields = { ...touchedFields };
        allFields.forEach((fieldName) => {
            newTouchedFields[fieldName] = true;
        });
        setTouchedFields(newTouchedFields);

        // Check for validation errors with detailed logging
        const validationErrors: string[] = [];
        allFields.forEach((fieldName) => {
            const error = getFieldError(fieldName);
            if (error) {
                validationErrors.push(`${fieldName}: ${error}`);
            }
        });

        if (validationErrors.length > 0) {
            console.error('Validation errors:', validationErrors);
            alert(`Please fix all validation errors before submitting:\n\n${validationErrors.join('\n')}`);
            return;
        }

        // Submit the form
        post('/appointments', {
            onSuccess: () => {
                // Clear saved draft and reset UI state
                clearSavedData();
                // Reset the form fields to defaults
                const defaults = getDefaultFormData();
                Object.keys(defaults).forEach((key) => {
                    // @ts-ignore
                    setData(key as keyof AppointmentData, defaults[key as keyof AppointmentData]);
                });
                setTouchedFields({});
                setValidationErrors({});
                setSelectedDate('');
                setSelectedTime('');
                setCurrentStep(1);

                setShowSuccessModal(true);
                // Auto-dismiss after 10 seconds
                setTimeout(() => {
                    setShowSuccessModal(false);
                }, 10000);
            },
            onError: (errors) => {
                console.error('Form submission errors:', errors);
                alert('There was an error submitting your appointment. Please try again.');
            },
        });
    };

    const handleNext = () => {
        // Mark all current step fields as touched
        const currentStepFields = stepValidationRules[currentStep as keyof typeof stepValidationRules] || [];
        const newTouchedFields = { ...touchedFields };
        currentStepFields.forEach((fieldName) => {
            newTouchedFields[fieldName] = true;
        });
        setTouchedFields(newTouchedFields);

        // Validate current step
        if (!validateCurrentStep()) {
            // Show validation errors
            return;
        }

        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const calendarDays = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="p-2"></div>);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const isAvailable = isDateAvailable(dateString);
            const isPast = isDateInPast(dateString);
            const isSelected = selectedDate === dateString;

            calendarDays.push(
                <button
                    key={day}
                    type="button"
                    onClick={() => {
                        if (isAvailable && !isPast) {
                            setSelectedDate(dateString);
                            setData('preferredDate', dateString);
                            generateTimeSlots();
                        }
                    }}
                    className={`rounded-lg p-2 text-sm font-medium transition-all duration-200 ease-in-out ${
                        isSelected
                            ? 'bg-teal-600 text-white shadow-lg'
                            : isAvailable && !isPast
                              ? 'border-2 border-gray-200 bg-white text-gray-900 hover:border-teal-300 hover:bg-teal-50'
                              : 'cursor-not-allowed bg-gray-100 text-gray-400'
                    } ${!isPast && isAvailable && !isSelected ? 'hover:scale-105' : ''} `}
                    disabled={!isAvailable || isPast}
                >
                    {day}
                </button>,
            );
        }

        return (
            <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <div className="flex gap-2">
                        <IconButton
                            icon={<ChevronLeft size={16} />}
                            onClick={() => navigateMonth('prev')}
                            aria-label="Previous month"
                            variant="outline"
                            size="sm"
                        />
                        <IconButton
                            icon={<ChevronRight size={16} />}
                            onClick={() => navigateMonth('next')}
                            aria-label="Next month"
                            variant="outline"
                            size="sm"
                        />
                    </div>
                </div>
                <div className="mb-2 grid grid-cols-7 gap-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="p-2 text-center text-xs font-semibold text-gray-600">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">{calendarDays}</div>
            </div>
        );
    };

    const renderStepIndicator = () => (
        <div className="mb-8">
            {/* Mobile Step Indicator */}
            <div className="block sm:hidden">
                <div className="mb-4 flex items-center justify-between rounded-xl border border-teal-100 bg-white/90 p-4 shadow-lg backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                        <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
                                stepValidationRules[currentStep as keyof typeof stepValidationRules]?.some((fieldName) => getFieldError(fieldName))
                                    ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-200'
                                    : isStepValid
                                      ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-200'
                                      : 'bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg shadow-teal-200'
                            }`}
                        >
                            {stepValidationRules[currentStep as keyof typeof stepValidationRules]?.some((fieldName) => getFieldError(fieldName)) ? (
                                <AlertCircle size={24} className="text-white" />
                            ) : isStepValid ? (
                                <CheckCircle size={24} className="text-white" />
                            ) : (
                                <span className="text-xl font-bold text-white">{currentStep}</span>
                            )}
                        </div>
                        <div>
                            <div className="text-lg font-bold text-gray-900">{stepTitles[currentStep as keyof typeof stepTitles]}</div>
                            <div className="text-sm text-gray-600">
                                Step {currentStep} of {totalSteps}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="mb-1 text-sm font-medium text-gray-500">Progress</div>
                        <div className="flex items-center space-x-2">
                            <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-200">
                                <div
                                    className="h-full bg-gradient-to-r from-teal-500 to-teal-600 transition-all duration-300 ease-out"
                                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                                />
                            </div>
                            <span className="text-xs font-semibold text-teal-600">{Math.round((currentStep / totalSteps) * 100)}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Step Indicator */}
            <div className="hidden sm:block">
                <div className="relative">
                    {/* Progress Line Background */}
                    <div className="absolute top-6 right-0 left-0 h-0.5 rounded-full bg-gray-200" />

                    {/* Progress Line Fill */}
                    <div
                        className="absolute top-6 left-0 h-0.5 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 transition-all duration-500 ease-out"
                        style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                    />

                    {/* Step Items */}
                    <div className="relative flex justify-between">
                        {Array.from({ length: totalSteps }, (_, index) => {
                            const stepNumber = index + 1;
                            const isCompleted = stepNumber < currentStep;
                            const isCurrent = stepNumber === currentStep;

                            // Check if step has validation errors
                            const stepFields = stepValidationRules[stepNumber as keyof typeof stepValidationRules] || [];
                            const hasErrors = stepFields.some((fieldName) => getFieldError(fieldName));
                            const stepIsValid = stepFields.length === 0 || stepFields.every((fieldName) => !getFieldError(fieldName));

                            return (
                                <div key={stepNumber} className="group flex flex-col items-center">
                                    {/* Step Circle */}
                                    <div
                                        className={`relative flex h-12 w-12 items-center justify-center rounded-full border-3 transition-all duration-300 group-hover:scale-110 ${
                                            isCompleted
                                                ? 'border-teal-600 bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg shadow-teal-200'
                                                : isCurrent
                                                  ? hasErrors
                                                      ? 'border-red-500 bg-gradient-to-br from-red-50 to-red-100 shadow-lg shadow-red-200'
                                                      : stepIsValid
                                                        ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-lg shadow-green-200'
                                                        : 'border-teal-600 bg-gradient-to-br from-teal-50 to-teal-100 shadow-lg shadow-teal-200'
                                                  : 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm'
                                        }`}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle size={24} className="text-white" />
                                        ) : isCurrent && hasErrors ? (
                                            <AlertCircle size={20} className="text-red-600" />
                                        ) : isCurrent && stepIsValid ? (
                                            <CheckCircle size={20} className="text-green-600" />
                                        ) : (
                                            <span
                                                className={`text-lg font-bold ${
                                                    isCompleted
                                                        ? 'text-white'
                                                        : isCurrent
                                                          ? hasErrors
                                                              ? 'text-red-600'
                                                              : stepIsValid
                                                                ? 'text-green-600'
                                                                : 'text-teal-600'
                                                          : 'text-gray-500'
                                                }`}
                                            >
                                                {stepNumber}
                                            </span>
                                        )}

                                        {/* Pulse animation for current step */}
                                        {isCurrent && (
                                            <div
                                                className={`absolute inset-0 animate-ping rounded-full ${
                                                    hasErrors ? 'bg-red-400' : stepIsValid ? 'bg-green-400' : 'bg-teal-400'
                                                } opacity-30`}
                                            />
                                        )}
                                    </div>

                                    {/* Step Title */}
                                    <div className="mt-3 max-w-24 text-center">
                                        <div
                                            className={`text-sm leading-tight font-semibold ${
                                                isCurrent
                                                    ? hasErrors
                                                        ? 'text-red-800'
                                                        : stepIsValid
                                                          ? 'text-green-800'
                                                          : 'text-teal-800'
                                                    : isCompleted
                                                      ? 'text-teal-700'
                                                      : 'text-gray-500'
                                            }`}
                                        >
                                            {stepTitles[stepNumber as keyof typeof stepTitles]}
                                        </div>

                                        {/* Validation Status Indicator */}
                                        {isCurrent && (
                                            <div
                                                className={`mt-1 text-xs font-medium ${
                                                    hasErrors ? 'text-red-600' : stepIsValid ? 'text-green-600' : 'text-teal-600'
                                                }`}
                                            >
                                                {hasErrors ? 'Needs attention' : stepIsValid ? 'Complete' : 'In progress'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Overall Progress Bar */}
                <div className="mt-6 rounded-xl border border-teal-100 bg-white/90 p-4 shadow-lg backdrop-blur-sm">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                        <span className="text-sm font-bold text-teal-600">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                        <div
                            className="relative h-full bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 transition-all duration-500 ease-out"
                            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        >
                            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Head title="Book Appointment - Omolola Akinola Psychiatry PLLC" />

            {/* Saved Draft Modal */}
            {showDraftModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center duration-300 animate-in fade-in">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm duration-300 animate-in fade-in"
                        onClick={() => setShowDraftModal(false)}
                    />

                    {/* Modal */}
                    <div className="relative mx-4 w-full max-w-md transform rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl duration-300 animate-in zoom-in-95">
                        {/* Header */}
                        <div className="mb-6 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-teal-200 shadow-lg">
                                <FileText className="h-8 w-8 text-teal-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Saved Draft Found</h3>
                            <p className="mt-2 text-sm leading-relaxed text-gray-600">
                                We found a previously saved draft of your appointment form. Would you like to continue where you left off?
                            </p>
                        </div>

                        {/* Draft Info */}
                        {savedDraftData && (
                            <div className="mb-6 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                                <h4 className="mb-3 flex items-center text-sm font-semibold text-gray-800">
                                    <div className="mr-2 h-2 w-2 rounded-full bg-teal-500"></div>
                                    Draft Preview
                                </h4>
                                <div className="space-y-2 text-xs text-gray-600">
                                    {savedDraftData.firstName && (
                                        <div className="flex items-center">
                                            <span className="w-12 text-gray-500">Name:</span>
                                            <span className="font-medium text-gray-700">
                                                {savedDraftData.firstName} {savedDraftData.lastName}
                                            </span>
                                        </div>
                                    )}
                                    {savedDraftData.email && (
                                        <div className="flex items-center">
                                            <span className="w-12 text-gray-500">Email:</span>
                                            <span className="font-medium text-gray-700">{savedDraftData.email}</span>
                                        </div>
                                    )}
                                    {savedDraftData.service && (
                                        <div className="flex items-center">
                                            <span className="w-12 text-gray-500">Service:</span>
                                            <span className="font-medium text-gray-700 capitalize">{savedDraftData.service.replace('-', ' ')}</span>
                                        </div>
                                    )}
                                    {savedDraftData.preferredDate && (
                                        <div className="flex items-center">
                                            <span className="w-12 text-gray-500">Date:</span>
                                            <span className="font-medium text-gray-700">{savedDraftData.preferredDate}</span>
                                        </div>
                                    )}
                                    {!savedDraftData.firstName && !savedDraftData.email && !savedDraftData.service && (
                                        <div className="text-gray-500 italic">Partial form data available...</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex space-x-3">
                            <FormButton
                                type="button"
                                variant="outline"
                                onClick={handleStartFresh}
                                leftIcon={<RotateCcw size={18} />}
                                className="flex-1 border-2 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50"
                            >
                                Start Fresh
                            </FormButton>
                            <FormButton
                                type="button"
                                variant="primary"
                                onClick={handleContinueWithDraft}
                                leftIcon={<CheckCircle size={18} />}
                                className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 shadow-lg transition-all duration-200 hover:from-teal-600 hover:to-teal-700 hover:shadow-xl"
                            >
                                Continue Draft
                            </FormButton>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={() => setShowDraftModal(false)}
                            className="absolute top-4 right-4 rounded-full p-2 text-gray-400 transition-colors duration-200 hover:scale-105 hover:bg-gray-100 hover:text-gray-600"
                            aria-label="Close modal"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            )}

            <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
                <SharedHeader variant="booking" showNavigation={false} />

                {/* Auto-save Status Indicator */}
                {autoSaveStatus && (
                    <div className="mx-auto max-w-4xl px-4 py-2">
                        <div
                            className={`flex items-center justify-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${
                                autoSaveStatus === 'saving'
                                    ? 'bg-blue-100 text-blue-800'
                                    : autoSaveStatus === 'saved'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                            }`}
                        >
                            {autoSaveStatus === 'saving' && (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                                    <span>Saving draft...</span>
                                </>
                            )}
                            {autoSaveStatus === 'saved' && (
                                <>
                                    <CheckCircle size={16} />
                                    <span>Draft saved automatically</span>
                                </>
                            )}
                            {autoSaveStatus === 'error' && (
                                <>
                                    <AlertCircle size={16} />
                                    <span>Error saving draft</span>
                                </>
                            )}
                        </div>
                    </div>
                )}

                <div className="mx-auto max-w-4xl px-4 py-8">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex-1">{renderStepIndicator()}</div>

                        {/* Clear Draft Button */}
                        {(data.firstName || data.lastName || data.email || data.service) && (
                            <button
                                onClick={() => {
                                    if (confirm('Are you sure you want to clear all form data and start over?')) {
                                        clearSavedData();
                                        window.location.reload();
                                    }
                                }}
                                className="ml-4 text-xs text-gray-500 underline transition-colors duration-200 hover:text-red-600"
                            >
                                Clear Draft
                            </button>
                        )}
                    </div>

                    {/* Returning Client Section */}
                    {currentStep === 1 && (
                        <Card className="mb-6 border-teal-200 bg-white/90 shadow-lg backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="mb-4 flex items-center space-x-3">
                                    <UserCheck className="h-6 w-6 text-teal-600" />
                                    <h3 className="text-lg font-semibold text-teal-800">Are you a returning client?</h3>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <FormCheckbox
                                        checked={data.isReturningClient}
                                        onChange={(checked) => handleFieldChange('isReturningClient', checked)}
                                        error={getFieldError('isReturningClient')}
                                    >
                                        Yes, I've booked with you before
                                    </FormCheckbox>
                                </div>
                                {data.isReturningClient && (
                                    <div className="mt-4">
                                        <div className="flex space-x-2">
                                            <FormInput
                                                type="email"
                                                placeholder="your@email.com"
                                                value={returningClientEmail}
                                                onChange={(e) => setReturningClientEmail(e.target.value)}
                                                label="Enter your email to retrieve your information"
                                                containerClassName="flex-1"
                                            />
                                            <FormButton
                                                type="button"
                                                onClick={() => checkReturningClient(returningClientEmail)}
                                                variant="primary"
                                                className="mt-8"
                                            >
                                                Find My Info
                                            </FormButton>
                                        </div>
                                        {clientFound && (
                                            <div className="mt-3 rounded-lg border-2 border-teal-200 bg-teal-50 p-4">
                                                <p className="text-sm font-medium text-teal-800">
                                                    ✓ Great! We found your information. Your details will be pre-filled in the form.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    <Card className="border-teal-200 bg-white/90 shadow-lg backdrop-blur-sm">
                        {/* Step 1: Service Selection */}
                        {currentStep === 1 && (
                            <>
                                <CardHeader className="border-b border-teal-100 bg-teal-50/50">
                                    <div className="flex items-center space-x-3">
                                        <Timer className="h-6 w-6 text-teal-600" />
                                        <div>
                                            <CardTitle className="text-xl font-bold text-teal-800">Choose Your Service</CardTitle>
                                            <CardDescription className="text-teal-700">Select the type of appointment you need</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {formattedServices.map((service) => (
                                        <div
                                            key={service.id}
                                            className={`cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-lg ${
                                                data.service === service.id
                                                    ? 'border-green-600 bg-green-50 shadow-md ring-2 ring-green-300'
                                                    : 'hover:bg-green-25 border-green-200 bg-white hover:border-green-400'
                                            }`}
                                            onClick={() => setData('service', service.id)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h3
                                                        className={`font-semibold ${data.service === service.id ? 'text-green-800' : 'text-gray-900'}`}
                                                    >
                                                        {service.name}
                                                    </h3>
                                                    <p className={`mt-1 text-sm ${data.service === service.id ? 'text-green-700' : 'text-gray-600'}`}>
                                                        {service.description}
                                                    </p>
                                                </div>
                                                <div
                                                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                                        data.service === service.id ? 'border-green-600 bg-green-600' : 'border-green-400'
                                                    }`}
                                                >
                                                    {data.service === service.id && <CheckCircle className="h-3 w-3 text-white" />}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </>
                        )}

                        {/* Step 2: Date & Time */}
                        {currentStep === 2 && (
                            <>
                                <CardHeader className="border-b border-teal-100 bg-teal-50/50">
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="h-6 w-6 text-teal-600" />
                                        <div>
                                            <CardTitle className="text-xl font-bold text-teal-800">Select Date & Time</CardTitle>
                                            <CardDescription className="text-teal-700">Choose your preferred appointment slot</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6 p-6">
                                    <div>
                                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Select a Date</h3>
                                        {renderCalendar()}
                                    </div>

                                    {selectedDate && (
                                        <div>
                                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Available Times</h3>
                                            <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
                                                {availableTimes.map((time) => (
                                                    <FormButton
                                                        key={time.value}
                                                        type="button"
                                                        variant={selectedTime === time.value ? 'primary' : 'outline'}
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedTime(time.value);
                                                            setData('preferredTime', time.value);
                                                        }}
                                                    >
                                                        {time.label}
                                                    </FormButton>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </>
                        )}

                        {/* Step 3: Personal Information */}
                        {currentStep === 3 && (
                            <>
                                <CardHeader className="border-b border-teal-100 bg-teal-50/50">
                                    <div className="flex items-center space-x-3">
                                        <User className="h-6 w-6 text-teal-600" />
                                        <div>
                                            <CardTitle className="text-xl font-bold text-teal-800">Personal Information</CardTitle>
                                            <CardDescription className="text-teal-700">Please provide your personal details</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6 p-6">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormInput
                                            label="First Name"
                                            value={data.firstName}
                                            onChange={(e) => handleFieldChange('firstName', e.target.value)}
                                            required
                                            error={getFieldError('firstName')}
                                        />
                                        <FormInput
                                            label="Last Name"
                                            value={data.lastName}
                                            onChange={(e) => handleFieldChange('lastName', e.target.value)}
                                            required
                                            error={getFieldError('lastName')}
                                        />
                                    </div>

                                    <FormInput
                                        label="Middle Name (Optional)"
                                        value={data.middleName}
                                        onChange={(e) => setData('middleName', e.target.value)}
                                    />

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormInput
                                            label="Email Address"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => handleFieldChange('email', e.target.value)}
                                            required
                                            error={getFieldError('email')}
                                        />
                                        <FormPhoneUS
                                            label="Phone Number"
                                            required
                                            value={data.phone}
                                            onChange={(val) => handleFieldChange('phone', val)}
                                            error={getFieldError('phone')}
                                        />
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormInput
                                            label="Date of Birth"
                                            type="date"
                                            value={data.dateOfBirth}
                                            onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
                                            required
                                            error={getFieldError('dateOfBirth')}
                                        />
                                        <FormSelect
                                            label="Gender"
                                            value={data.gender}
                                            onChange={(e) => handleFieldChange('gender', e.target.value)}
                                            required
                                            error={getFieldError('gender')}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="non-binary">Non-binary</option>
                                            <option value="prefer-not-to-say">Prefer not to say</option>
                                            <option value="other">Other</option>
                                        </FormSelect>
                                    </div>

                                    <FormInput
                                        label="Street Address"
                                        value={data.address}
                                        onChange={(e) => handleFieldChange('address', e.target.value)}
                                        required
                                        error={getFieldError('address')}
                                    />

                                    <div className="grid gap-4 md:grid-cols-3">
                                        <FormInput
                                            label="City"
                                            value={data.city}
                                            onChange={(e) => handleFieldChange('city', e.target.value)}
                                            required
                                            error={getFieldError('city')}
                                        />
                                        <FormSelect
                                            label="State"
                                            value={data.state}
                                            onChange={(e) => handleFieldChange('state', e.target.value)}
                                            required
                                            error={getFieldError('state')}
                                        >
                                            <option value="">Select State</option>
                                            {states.map((state) => (
                                                <option key={state} value={state}>
                                                    {state}
                                                </option>
                                            ))}
                                        </FormSelect>
                                        <FormInput
                                            label="ZIP Code"
                                            value={data.zipCode}
                                            onChange={(e) => handleFieldChange('zipCode', e.target.value)}
                                            required
                                            error={getFieldError('zipCode')}
                                        />
                                    </div>

                                    <div className="border-t border-gray-200 pt-6">
                                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Emergency Contact</h3>
                                        <div className="space-y-4">
                                            <FormInput
                                                label="Emergency Contact Name"
                                                value={data.emergencyContactName}
                                                onChange={(e) => handleFieldChange('emergencyContactName', e.target.value)}
                                                required
                                                error={getFieldError('emergencyContactName')}
                                            />
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <FormPhoneUS
                                                    label="Emergency Contact Phone"
                                                    value={data.emergencyContactPhone}
                                                    onChange={(val) => handleFieldChange('emergencyContactPhone', val)}
                                                    required
                                                    placeholder="(555) 555-5555"
                                                    error={getFieldError('emergencyContactPhone')}
                                                />
                                                <FormInput
                                                    label="Relationship to You"
                                                    value={data.emergencyContactRelationship}
                                                    onChange={(e) => handleFieldChange('emergencyContactRelationship', e.target.value)}
                                                    required
                                                    error={getFieldError('emergencyContactRelationship')}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </>
                        )}

                        {/* Step 4: Insurance Information */}
                        {currentStep === 4 && (
                            <>
                                <CardHeader className="border-b border-teal-100 bg-teal-50/50">
                                    <div className="flex items-center space-x-3">
                                        <Shield className="h-6 w-6 text-teal-600" />
                                        <div>
                                            <CardTitle className="text-xl font-bold text-teal-800">Insurance Information</CardTitle>
                                            <CardDescription className="text-teal-700">Please provide your insurance details</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6 p-6">
                                    <FormRadioGroup
                                        label="Do you have insurance?"
                                        name="hasInsurance"
                                        value={data.hasInsurance ? 'yes' : 'no'}
                                        onChange={(value) => handleFieldChange('hasInsurance', value === 'yes')}
                                        direction="horizontal"
                                        required
                                        error={getFieldError('hasInsurance')}
                                    >
                                        <FormRadio
                                            name="hasInsurance"
                                            value="yes"
                                            checked={data.hasInsurance}
                                            onChange={() => handleFieldChange('hasInsurance', true)}
                                        >
                                            Yes
                                        </FormRadio>
                                        <FormRadio
                                            name="hasInsurance"
                                            value="no"
                                            checked={!data.hasInsurance}
                                            onChange={() => handleFieldChange('hasInsurance', false)}
                                        >
                                            No (Self-Pay)
                                        </FormRadio>
                                    </FormRadioGroup>

                                    {data.hasInsurance && (
                                        <div className="space-y-4">
                                            <FormSelect
                                                label="Insurance Provider"
                                                value={data.insuranceProvider}
                                                onChange={(e) => handleFieldChange('insuranceProvider', e.target.value)}
                                                required
                                                error={getFieldError('insuranceProvider')}
                                            >
                                                <option value="">Select your insurance provider</option>
                                                {insuranceProviders.map((provider) => (
                                                    <option key={provider} value={provider}>
                                                        {provider}
                                                    </option>
                                                ))}
                                            </FormSelect>

                                            <div className="grid gap-4 md:grid-cols-2">
                                                <FormInput
                                                    label="Policy Number"
                                                    value={data.insurancePolicyNumber}
                                                    onChange={(e) => handleFieldChange('insurancePolicyNumber', e.target.value)}
                                                    placeholder="Your policy number"
                                                    required
                                                    error={getFieldError('insurancePolicyNumber')}
                                                />
                                                <FormInput
                                                    label="Group Number (if applicable)"
                                                    value={data.insuranceGroupNumber}
                                                    onChange={(e) => handleFieldChange('insuranceGroupNumber', e.target.value)}
                                                    placeholder="Group number (optional)"
                                                    error={getFieldError('insuranceGroupNumber')}
                                                />
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-2">
                                                <FormInput
                                                    label="Primary Subscriber Name"
                                                    value={data.subscriberName}
                                                    onChange={(e) => handleFieldChange('subscriberName', e.target.value)}
                                                    placeholder="Name of the primary insurance holder"
                                                    required
                                                    error={getFieldError('subscriberName')}
                                                />
                                                <FormInput
                                                    label="Primary Subscriber Date of Birth"
                                                    type="date"
                                                    value={data.subscriberDOB}
                                                    onChange={(e) => handleFieldChange('subscriberDOB', e.target.value)}
                                                    required
                                                    error={getFieldError('subscriberDOB')}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <FormSelect
                                        label="How did you hear about us?"
                                        value={data.referralSource}
                                        onChange={(e) => handleFieldChange('referralSource', e.target.value)}
                                        required
                                        error={getFieldError('referralSource')}
                                    >
                                        <option value="">Select source</option>
                                        <option value="google">Google Search</option>
                                        <option value="referral-doctor">Referred by Doctor</option>
                                        <option value="referral-friend">Referred by Friend/Family</option>
                                        <option value="insurance">Insurance Directory</option>
                                        <option value="social-media">Social Media</option>
                                        <option value="website">Our Website</option>
                                        <option value="other">Other</option>
                                    </FormSelect>
                                </CardContent>
                            </>
                        )}

                        {/* Step 5: Medical History */}
                        {currentStep === 5 && (
                            <>
                                <CardHeader className="border-b border-teal-100 bg-teal-50/50">
                                    <div className="flex items-center space-x-3">
                                        <Heart className="h-6 w-6 text-teal-600" />
                                        <div>
                                            <CardTitle className="text-xl font-bold text-teal-800">Medical History & Intake</CardTitle>
                                            <CardDescription className="text-teal-700">Help us provide the best care for you</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6 p-6">
                                    <FormTextarea
                                        label="Reason for Visit"
                                        value={data.reasonForVisit}
                                        onChange={(e) => handleFieldChange('reasonForVisit', e.target.value)}
                                        placeholder="Please describe the main reason for your visit today..."
                                        required
                                        rows={4}
                                        error={getFieldError('reasonForVisit')}
                                    />

                                    <FormTextarea
                                        label="Current Symptoms"
                                        value={data.currentSymptoms}
                                        onChange={(e) => handleFieldChange('currentSymptoms', e.target.value)}
                                        placeholder="Please describe any current symptoms you're experiencing..."
                                        rows={4}
                                        error={getFieldError('currentSymptoms')}
                                    />

                                    <FormTextarea
                                        label="Current Medications"
                                        value={data.currentMedications}
                                        onChange={(e) => handleFieldChange('currentMedications', e.target.value)}
                                        placeholder="List all current medications, dosages, and frequency..."
                                        rows={4}
                                        error={getFieldError('currentMedications')}
                                    />

                                    <FormTextarea
                                        label="Current Life Stressors"
                                        value={data.currentStressors}
                                        onChange={(e) => handleFieldChange('currentStressors', e.target.value)}
                                        placeholder="Work, relationships, health, financial concerns, etc."
                                        rows={3}
                                        error={getFieldError('currentStressors')}
                                    />

                                    {/* Suicidal/homicidal question removed per request */}
                                    <FormRadioGroup
                                        label="Preferred Communication Method"
                                        name="preferredCommunication"
                                        value={data.preferredCommunication}
                                        onChange={(value) => handleFieldChange('preferredCommunication', value)}
                                        direction="horizontal"
                                        required
                                        error={getFieldError('preferredCommunication')}
                                    >
                                        <FormRadio
                                            name="preferredCommunication"
                                            value="phone"
                                            checked={data.preferredCommunication === 'phone'}
                                            onChange={() => handleFieldChange('preferredCommunication', 'phone')}
                                        >
                                            Phone
                                        </FormRadio>
                                        <FormRadio
                                            name="preferredCommunication"
                                            value="email"
                                            checked={data.preferredCommunication === 'email'}
                                            onChange={() => handleFieldChange('preferredCommunication', 'email')}
                                        >
                                            Email
                                        </FormRadio>
                                        <FormRadio
                                            name="preferredCommunication"
                                            value="text"
                                            checked={data.preferredCommunication === 'text'}
                                            onChange={() => handleFieldChange('preferredCommunication', 'text')}
                                        >
                                            Text Message
                                        </FormRadio>
                                    </FormRadioGroup>

                                    <FormTextarea
                                        label="Special Accommodations Needed"
                                        value={data.specialAccommodations}
                                        onChange={(e) => handleFieldChange('specialAccommodations', e.target.value)}
                                        placeholder="Wheelchair access, interpreter services, etc."
                                        rows={2}
                                        error={getFieldError('specialAccommodations')}
                                    />

                                    <div className="rounded-lg border-2 border-teal-200 bg-teal-50/30 p-6">
                                        <h3 className="mb-4 text-lg font-semibold text-teal-800">Consent and Agreements</h3>
                                        <p className="mb-4 text-sm text-gray-700">Please review and agree to the following:</p>

                                        <div className="space-y-4">
                                            <FormCheckbox
                                                checked={data.consentToTreatment}
                                                onChange={(checked) => handleFieldChange('consentToTreatment', checked)}
                                                required
                                                error={getFieldError('consentToTreatment')}
                                            >
                                                I consent to psychiatric evaluation and treatment by Dr. Lola Akinola, PMHNP-BC. I understand that I
                                                may refuse any treatment recommended and that I may discontinue treatment at any time.
                                            </FormCheckbox>

                                            <FormCheckbox
                                                checked={data.hipaaConsent}
                                                onChange={(checked) => handleFieldChange('hipaaConsent', checked)}
                                                required
                                                error={getFieldError('hipaaConsent')}
                                            >
                                                I have read and agree to the Privacy Policy and HIPAA Notice of Privacy Practices. I understand my
                                                rights regarding protected health information.{' '}
                                                <button type="button" onClick={() => setShowPrivacyModal(true)} className="text-teal-600 underline">
                                                    Read Privacy Policy
                                                </button>
                                            </FormCheckbox>

                                            <FormCheckbox
                                                checked={data.telehealthConsent}
                                                onChange={(checked) => handleFieldChange('telehealthConsent', checked)}
                                                error={getFieldError('telehealthConsent')}
                                            >
                                                I understand the risks and benefits of telehealth services and consent to receive care via secure
                                                video platforms when appropriate.
                                            </FormCheckbox>

                                            <FormCheckbox
                                                checked={data.financialResponsibility}
                                                onChange={(checked) => handleFieldChange('financialResponsibility', checked)}
                                                required
                                                error={getFieldError('financialResponsibility')}
                                            >
                                                I understand my financial responsibility for services, including copays, deductibles, and any charges
                                                not covered by insurance.
                                            </FormCheckbox>
                                        </div>
                                    </div>
                                </CardContent>
                            </>
                        )}

                        {/* Step 6: Review & Confirm */}
                        {currentStep === 6 && (
                            <>
                                <CardHeader className="border-b border-teal-100 bg-teal-50/50">
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="h-6 w-6 text-teal-600" />
                                        <div>
                                            <CardTitle className="text-xl font-bold text-teal-800">Review & Confirm</CardTitle>
                                            <CardDescription className="text-teal-700">Please review your appointment details</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6 p-6">
                                    <div className="rounded-lg border-2 border-teal-200 bg-white p-6 shadow-sm">
                                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Appointment Summary</h3>
                                        <div className="grid gap-3 text-sm text-gray-800">
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-800">Service:</span>
                                                <span className="text-gray-900">
                                                    {formattedServices.find((s) => s.id === data.service)?.name || 'Not selected'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-800">Date:</span>
                                                <span className="text-gray-900">{data.preferredDate || 'Not selected'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-800">Time:</span>
                                                <span className="text-gray-900">{data.preferredTime || 'Not selected'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-lg border-2 border-gray-200 bg-white p-6">
                                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Contact Information</h3>
                                        <div className="grid gap-2 text-sm text-gray-800">
                                            <div>
                                                <span className="font-medium text-gray-800">Name:</span>{' '}
                                                <span className="text-gray-900">
                                                    {data.firstName} {data.lastName}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-800">Email:</span>{' '}
                                                <span className="text-gray-900">{data.email}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-800">Phone:</span>{' '}
                                                <span className="text-gray-900">{data.phone}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Billing Disclaimer */}
                                    <div className="rounded-lg border-2 border-blue-200 bg-blue-50/50 p-6">
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                                                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-blue-900">Important Billing Information</h4>
                                                <p className="mt-2 text-sm leading-relaxed text-blue-800">
                                                    <strong>Billing is processed through Headway.</strong> All payment processing, insurance claims,
                                                    and billing inquiries will be handled by Headway on behalf of Dr. Lola Akinola's practice. You
                                                    will receive billing statements and communications directly from Headway for your mental health
                                                    services.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <FormCheckbox
                                        checked={data.terms}
                                        onChange={(checked) => handleFieldChange('terms', checked)}
                                        required
                                        labelClassName="text-gray-900"
                                        containerClassName="pt-2"
                                        error={getFieldError('terms')}
                                    >
                                        I agree to the terms and conditions, privacy policy, and understand that this is a request for appointment and
                                        confirmation will be provided within 24 hours.
                                    </FormCheckbox>

                                    <FormCheckbox
                                        checked={data.privacyPolicy}
                                        onChange={(checked) => handleFieldChange('privacyPolicy', checked)}
                                        required
                                        error={getFieldError('privacyPolicy')}
                                    >
                                        I have read and agree to the Privacy Policy and HIPAA Notice of Privacy Practices. I understand my rights
                                        regarding protected health information.{' '}
                                        <button type="button" onClick={() => setShowPrivacyModal(true)} className="text-teal-600 underline">
                                            Read Privacy Policy
                                        </button>
                                    </FormCheckbox>

                                    {/* Privacy Policy Modal */}
                                    {showPrivacyModal && (
                                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                                            <div className="absolute inset-0 bg-black/50" onClick={() => setShowPrivacyModal(false)} />
                                            <div className="relative mx-4 max-w-3xl transform rounded-lg bg-white p-6 shadow-lg">
                                                <h3 className="mb-4 text-lg font-bold">Privacy Policy & HIPAA Notice of Privacy Practices</h3>
                                                <div className="max-h-[60vh] overflow-auto text-sm leading-relaxed text-gray-700">
                                                    <p>
                                                        <strong>Privacy Policy</strong>
                                                    </p>
                                                    <p>
                                                        Your privacy is important to us. This practice is committed to protecting the privacy of your
                                                        health information. We collect, use, and disclose your health information only as permitted by
                                                        law and as necessary to provide you care.
                                                    </p>

                                                    <p>
                                                        <strong>HIPAA Notice</strong>
                                                    </p>
                                                    <p>
                                                        We are required by law to maintain the privacy of your protected health information and to
                                                        provide you with notice of our legal duties and privacy practices with respect to your health
                                                        information.
                                                    </p>

                                                    <p>
                                                        Please contact our office for the full Privacy Policy and HIPAA Notice. By checking the box
                                                        you acknowledge that you have read and agree to these policies.
                                                    </p>
                                                </div>
                                                <div className="mt-4 text-right">
                                                    <button
                                                        onClick={() => setShowPrivacyModal(false)}
                                                        className="rounded bg-teal-600 px-4 py-2 text-white"
                                                    >
                                                        Close
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </>
                        )}

                        {/* Navigation */}
                        <div className="flex flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
                            {/* Previous Button */}
                            {currentStep > 1 ? (
                                <FormButton
                                    type="button"
                                    onClick={handlePrevious}
                                    variant="outline"
                                    leftIcon={<ArrowLeft size={20} />}
                                    className="order-2 w-full sm:order-1 sm:w-auto"
                                >
                                    Previous Step
                                </FormButton>
                            ) : (
                                <div className="hidden sm:block"></div>
                            )}

                            {/* Progress Info (Mobile) */}
                            <div className="order-1 flex items-center space-x-3 text-sm text-gray-600 sm:hidden">
                                <span className="font-medium">
                                    Step {currentStep} of {totalSteps}
                                </span>
                                <div className="h-1 w-16 overflow-hidden rounded-full bg-gray-200">
                                    <div
                                        className="h-full bg-gradient-to-r from-teal-500 to-teal-600 transition-all duration-300"
                                        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Next/Submit Button */}
                            <FormButton
                                type="button"
                                onClick={handleNext}
                                variant="primary"
                                rightIcon={currentStep === totalSteps ? <CheckCircle size={20} /> : <ArrowRight size={20} />}
                                loading={processing}
                                disabled={processing}
                                className="order-3 w-full sm:order-2 sm:w-auto"
                            >
                                {currentStep === totalSteps ? 'Confirm Appointment' : 'Continue'}
                            </FormButton>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Success Toast Notification */}
            {showSuccessModal && (
                <div className="fixed top-4 left-1/2 z-50 mx-4 w-full max-w-md -translate-x-1/2 transform">
                    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl duration-300 animate-in slide-in-from-top">
                        {/* Close button */}
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="absolute top-3 right-3 rounded-full p-1 transition-colors hover:bg-gray-100"
                        >
                            <X className="h-4 w-4 text-gray-400" />
                        </button>

                        {/* Success Content */}
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                {/* Success Icon */}
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className="mb-1 text-lg font-semibold text-gray-900">Appointment Submitted!</h3>
                                    <p className="mb-4 text-sm text-gray-600">
                                        Your appointment request has been submitted successfully! We will contact you within 24 hours to confirm your
                                        appointment.
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-2 sm:flex-row">
                                        <button
                                            onClick={() => {
                                                setShowSuccessModal(false);
                                                // Reset form to initial state
                                                setCurrentStep(1);
                                                setData(getDefaultFormData());
                                                setValidationErrors({});
                                                setTouchedFields({});
                                                setSelectedDate('');
                                                setSelectedTime('');
                                            }}
                                            className="flex-1 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
                                        >
                                            Book Another
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowSuccessModal(false);
                                                window.location.href = '/';
                                            }}
                                            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                        >
                                            Go Home
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
