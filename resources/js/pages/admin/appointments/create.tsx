import { FormButton } from '@/components/ui/form-button';
import { FormInput, FormSelect, FormTextarea } from '@/components/ui/form-inputs';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar, Save, User } from 'lucide-react';
import { useEffect, useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Props {
    users?: User[];
}

export default function AdminAppointmentCreate({ users = [] }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
    const { url } = usePage();

    // Get patient_id from URL parameters if available
    const urlParams = new URLSearchParams(url.split('?')[1] || '');
    const preselectedPatientId = urlParams.get('patient_id');

    const { data, setData, post, processing, errors } = useForm({
        user_id: preselectedPatientId || '',
        service: 'follow-up',
        preferred_date: '',
        preferred_time: '',
        alternateDate: '',
        alternateTime: '',
        appointment_type: 'telehealth',
        reason: '',
        currentSymptoms: '',
        currentMedications: '',
        allergies: '',
        admin_notes: '',
    });

    // All services available for admin to assign
    const allServices = [
        {
            id: 'initial-evaluation',
            name: 'Initial Psychiatric Evaluation',
            duration: '40-60 minutes',
        },
        {
            id: 'follow-up',
            name: 'Follow-up Appointment',
            duration: '30-45 minutes',
        },
        {
            id: 'medication-management',
            name: 'Medication Management',
            duration: '30-45 minutes',
        },
        {
            id: 'adhd-treatment',
            name: 'ADHD Treatment',
            duration: '45 minutes',
        },
        {
            id: 'anxiety-depression',
            name: 'Anxiety & Depression Care',
            duration: '45 minutes',
        },
        {
            id: 'trauma-ptsd',
            name: 'Trauma & PTSD Support',
            duration: '45 minutes',
        },
        {
            id: 'perinatal-mental-health',
            name: 'Perinatal Mental Health',
            duration: '45 minutes',
        },
    ];

    // Generate time slots
    const generateTimeSlots = () => {
        const times = [];
        for (let hour = 9; hour < 17; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                times.push(time);
            }
        }
        return times;
    };

    const timeSlots = generateTimeSlots();

    // Filter users based on search query
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(
                (user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase()),
            );
            setFilteredUsers(filtered);
        }
    }, [searchQuery, users]);

    // Pre-fill search and select patient if patient_id is provided
    useEffect(() => {
        if (preselectedPatientId && users.length > 0) {
            const preselectedUser = users.find((user) => user.id.toString() === preselectedPatientId);
            if (preselectedUser) {
                setSearchQuery(preselectedUser.name);
            }
        }
    }, [preselectedPatientId, users]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/appointments');
    };

    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    return (
        <AdminLayout>
            <Head title="Create Appointment - Admin | Omolola Akinola Psychiatry PLLC" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/appointments"
                        className="rounded-lg border border-slate-300 p-2 text-slate-600 transition-colors hover:border-teal-500 hover:text-teal-600"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Create New Appointment</h1>
                        <p className="mt-1 text-slate-600">Schedule an appointment for a patient</p>
                    </div>
                </div>

                {/* Preselected Patient Notification */}
                {preselectedPatientId && users.find((user) => user.id.toString() === preselectedPatientId) && (
                    <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
                        <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-teal-600" />
                            <div>
                                <p className="text-sm font-medium text-teal-800">
                                    Creating appointment for: {users.find((user) => user.id.toString() === preselectedPatientId)?.name}
                                </p>
                                <p className="text-xs text-teal-600">Patient has been pre-selected from the patient details page</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form */}
                <div className="flex max-h-[80vh] flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-6">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-6 w-6 text-teal-600" />
                            <h2 className="text-lg font-semibold text-slate-800">Appointment Details</h2>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <form onSubmit={handleSubmit} className="space-y-8 p-6">
                            {/* Patient Selection Section */}
                            <div className="rounded-lg bg-gray-50 p-4">
                                <h3 className="mb-4 flex items-center text-sm font-semibold text-gray-700">
                                    <User className="mr-2 h-4 w-4" />
                                    Patient Selection
                                </h3>
                                <div className="space-y-4">
                                    {/* User Search */}
                                    <FormInput
                                        label="Search for patient by name or email"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Type to search patients..."
                                    />

                                    {/* User Selection */}
                                    <FormSelect
                                        label="Patient *"
                                        value={data.user_id}
                                        onChange={(e) => setData('user_id', e.target.value)}
                                        required
                                        error={errors.user_id}
                                    >
                                        <option value="">Select a patient</option>
                                        {filteredUsers.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name} ({user.email})
                                            </option>
                                        ))}
                                    </FormSelect>

                                    {filteredUsers.length === 0 && searchQuery && (
                                        <p className="text-sm text-amber-600">
                                            No patients found matching "{searchQuery}". Try a different search term.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Appointment Details Section */}
                            <div>
                                <h4 className="mb-4 flex items-center text-sm font-semibold text-gray-700">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Appointment Details
                                </h4>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    <FormInput
                                        label="Appointment Date *"
                                        type="date"
                                        value={data.preferred_date}
                                        onChange={(e) => setData('preferred_date', e.target.value)}
                                        min={getTomorrowDate()}
                                        required
                                        error={errors.preferred_date}
                                    />

                                    <FormSelect
                                        label="Appointment Time *"
                                        value={data.preferred_time}
                                        onChange={(e) => setData('preferred_time', e.target.value)}
                                        required
                                        error={errors.preferred_time}
                                    >
                                        <option value="">Select time</option>
                                        {timeSlots.map((time) => (
                                            <option key={time} value={time}>
                                                {time}
                                            </option>
                                        ))}
                                    </FormSelect>

                                    <FormSelect
                                        label="Service Type *"
                                        value={data.service}
                                        onChange={(e) => setData('service', e.target.value)}
                                        required
                                        error={errors.service}
                                    >
                                        {allServices.map((service) => (
                                            <option key={service.id} value={service.id}>
                                                {service.name} ({service.duration})
                                            </option>
                                        ))}
                                    </FormSelect>

                                    <FormSelect
                                        label="Appointment Type"
                                        value={data.appointment_type}
                                        onChange={(e) => setData('appointment_type', e.target.value)}
                                        required
                                        error={errors.appointment_type}
                                    >
                                        <option value="telehealth">Telehealth</option>
                                        <option value="in-person">In-Person</option>
                                    </FormSelect>
                                </div>
                            </div>

                            {/* Alternate Preferences Section */}
                            <div>
                                <h4 className="mb-4 flex items-center text-sm font-semibold text-gray-700">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Alternate Preferences (Optional)
                                </h4>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <FormInput
                                        label="Alternate Date"
                                        type="date"
                                        value={data.alternateDate}
                                        onChange={(e) => setData('alternateDate', e.target.value)}
                                        min={getTomorrowDate()}
                                        error={errors.alternateDate}
                                    />

                                    <FormSelect
                                        label="Alternate Time"
                                        value={data.alternateTime}
                                        onChange={(e) => setData('alternateTime', e.target.value)}
                                        error={errors.alternateTime}
                                    >
                                        <option value="">Select alternate time</option>
                                        {timeSlots.map((time) => (
                                            <option key={time} value={time}>
                                                {time}
                                            </option>
                                        ))}
                                    </FormSelect>
                                </div>
                            </div>

                            {/* Medical Information Section */}
                            <div>
                                <h4 className="mb-4 flex items-center text-sm font-semibold text-gray-700">
                                    <User className="mr-2 h-4 w-4" />
                                    Medical Information
                                </h4>
                                <div className="space-y-6">
                                    <FormTextarea
                                        label="Reason for Visit *"
                                        value={data.reason}
                                        onChange={(e) => setData('reason', e.target.value)}
                                        placeholder="Brief description of the appointment purpose..."
                                        rows={3}
                                        required
                                        error={errors.reason}
                                    />

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <FormTextarea
                                            label="Current Symptoms"
                                            value={data.currentSymptoms}
                                            onChange={(e) => setData('currentSymptoms', e.target.value)}
                                            placeholder="Describe current symptoms..."
                                            rows={4}
                                            error={errors.currentSymptoms}
                                        />

                                        <FormTextarea
                                            label="Current Medications"
                                            value={data.currentMedications}
                                            onChange={(e) => setData('currentMedications', e.target.value)}
                                            placeholder="List current medications, dosages, and frequency..."
                                            rows={4}
                                            error={errors.currentMedications}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <FormTextarea
                                            label="Allergies"
                                            value={data.allergies}
                                            onChange={(e) => setData('allergies', e.target.value)}
                                            placeholder="List any known allergies..."
                                            rows={3}
                                            error={errors.allergies}
                                        />

                                        <FormTextarea
                                            label="Admin Notes"
                                            value={data.admin_notes}
                                            onChange={(e) => setData('admin_notes', e.target.value)}
                                            placeholder="Internal notes about this appointment..."
                                            rows={3}
                                            error={errors.admin_notes}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex items-center justify-end gap-4 border-t border-slate-200 pt-6">
                                <Link
                                    href="/admin/appointments"
                                    className="rounded-lg border border-slate-300 px-6 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                                >
                                    Cancel
                                </Link>
                                <FormButton
                                    type="submit"
                                    disabled={processing}
                                    variant="primary"
                                    leftIcon={<Save size={18} />}
                                    className="bg-teal-600 hover:bg-teal-700"
                                >
                                    {processing ? 'Creating...' : 'Create Appointment'}
                                </FormButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
