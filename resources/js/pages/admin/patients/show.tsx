import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, Check, CheckCircle, Plus, User, X, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Patient {
    id: number;
    name: string;
    email: string;
    phone: string;
    date_of_birth: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    insurance_provider?: string;
    insurance_policy_number?: string;
    created_at: string;
}

interface Appointment {
    id: number;
    service: string | null;
    preferred_date: string;
    preferred_time: string;
    appointment_type: string;
    status: string;
    reason: string;
    notes?: string;
    created_at: string;
}

interface Props {
    patient?: Patient;
    appointments?: Appointment[];
    appointmentCounts?: {
        total: number;
        pending: number;
        confirmed: number;
        completed: number;
        cancelled: number;
    };
}

export default function AdminPatientShow({ patient, appointments = [], appointmentCounts }: Props) {
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Debug logging
    console.log('Rendering AdminPatientShow with:', { patient, appointments, appointmentCounts });

    // Early return if no patient data
    if (!patient) {
        console.log('No patient data found, showing not found page');
        return (
            <AdminLayout>
                <Head title="Patient Not Found" />
                <div className="space-y-6">
                    <div className="py-12 text-center">
                        <h1 className="mb-4 text-2xl font-bold text-slate-800">Patient Not Found</h1>
                        <p className="mb-6 text-slate-600">The patient you're looking for doesn't exist or you don't have permission to view them.</p>
                        <Link
                            href="/admin/patients"
                            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Patients
                        </Link>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    // Default appointment counts if not provided
    const counts = appointmentCounts || {
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
    };

    // Form for creating appointment - only initialize if patient exists
    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: patient?.id || '',
        service: 'follow-up',
        preferred_date: '',
        preferred_time: '',
        appointment_type: 'telehealth',
        reason: '',
        admin_notes: '',
    });

    // Track modal state changes
    useEffect(() => {
        console.log('Modal state changed:', showCreateModal);
    }, [showCreateModal]);

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
            duration: '20-30 minutes',
        },
        {
            id: 'medication-management',
            name: 'Medication Management',
            duration: '15-20 minutes',
        },
        {
            id: 'therapy-session',
            name: 'Therapy Session',
            duration: '45-50 minutes',
        },
    ];

    // Time slots for appointments
    const timeSlots = [
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '13:00',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
    ];

    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    const handleCreateAppointment = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting appointment:', data);

        post('/admin/appointments', {
            onSuccess: () => {
                console.log('Appointment created successfully');
                setShowCreateModal(false);
                reset();
            },
            onError: (errors) => {
                console.error('Error creating appointment:', errors);
            },
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'border-green-200 bg-green-50 text-green-800';
            case 'pending':
                return 'border-yellow-200 bg-yellow-50 text-yellow-800';
            case 'completed':
                return 'border-blue-200 bg-blue-50 text-blue-800';
            case 'cancelled':
                return 'border-red-200 bg-red-50 text-red-800';
            default:
                return 'border-slate-200 bg-slate-50 text-slate-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircle className="h-4 w-4" />;
            case 'pending':
                return <Calendar className="h-4 w-4" />;
            case 'completed':
                return <Check className="h-4 w-4" />;
            case 'cancelled':
                return <XCircle className="h-4 w-4" />;
            default:
                return <Calendar className="h-4 w-4" />;
        }
    };

    return (
        <AdminLayout>
            <Head title={`Patient: ${patient.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/patients"
                        className="hover:text-custom-green hover:border-custom-green rounded-lg border border-slate-300 p-2 text-slate-600 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Patient Details</h1>
                </div>

                {/* Patient Information */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        {/* Basic Info */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold text-slate-900">Basic Information</h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                                    <p className="text-slate-900">{patient.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Email</label>
                                    <p className="text-slate-900">{patient.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Phone</label>
                                    <p className="text-slate-900">{patient.phone || 'Not provided'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Date of Birth</label>
                                    <p className="text-slate-900">
                                        {patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : 'Not provided'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold text-slate-900">Emergency Contact</h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Contact Name</label>
                                    <p className="text-slate-900">{patient.emergency_contact_name || 'Not provided'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Contact Phone</label>
                                    <p className="text-slate-900">{patient.emergency_contact_phone || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Insurance Information */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold text-slate-900">Insurance Information</h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Provider</label>
                                    <p className="text-slate-900">{patient.insurance_provider || 'Not provided'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Policy Number</label>
                                    <p className="text-slate-900">{patient.insurance_policy_number || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Sidebar */}
                    <div className="space-y-6">
                        {/* Registration Date */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-2 text-sm font-medium text-slate-700">Patient Since</h3>
                            <p className="text-2xl font-bold text-slate-900">{new Date(patient.created_at).toLocaleDateString()}</p>
                        </div>

                        {/* Appointment Stats */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-semibold text-slate-900">Appointment Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-600">Total Appointments</span>
                                    <span className="font-semibold text-slate-900">{counts.total}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-600">Pending</span>
                                    <span className="font-semibold text-yellow-600">{counts.pending}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-600">Confirmed</span>
                                    <span className="font-semibold text-green-600">{counts.confirmed}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-600">Completed</span>
                                    <span className="font-semibold text-blue-600">{counts.completed}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-600">Cancelled</span>
                                    <span className="font-semibold text-red-600">{counts.cancelled}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Appointments */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-6 text-lg font-semibold text-slate-900">Recent Appointments</h2>
                    {appointments.length === 0 ? (
                        <div className="py-12 text-center">
                            <Calendar className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                            <h3 className="mb-2 text-lg font-medium text-slate-900">No appointments yet</h3>
                            <p className="text-slate-600">This patient hasn't scheduled any appointments.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="pb-3 text-left text-sm font-medium text-slate-700">Service & Date</th>
                                        <th className="pb-3 text-left text-sm font-medium text-slate-700">Reason</th>
                                        <th className="pb-3 text-center text-sm font-medium text-slate-700">Status</th>
                                        <th className="pb-3 text-left text-sm font-medium text-slate-700">Notes</th>
                                        <th className="pb-3 text-left text-sm font-medium text-slate-700">Created</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {appointments.map((appointment) => (
                                        <tr key={appointment.id} className="hover:bg-slate-50">
                                            <td className="py-4 pr-6">
                                                <div>
                                                    <div className="font-medium text-slate-900">
                                                        {appointment.service
                                                            ? appointment.service
                                                                  .split('-')
                                                                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                                                  .join(' ')
                                                            : 'Service not specified'}
                                                    </div>
                                                    <div className="text-sm text-slate-500">
                                                        {new Date(appointment.preferred_date).toLocaleDateString()} at {appointment.preferred_time}
                                                    </div>
                                                    <div className="text-xs text-slate-400 capitalize">
                                                        {appointment.appointment_type.replace('-', ' ')}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-slate-900">{appointment.reason}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(appointment.status)}`}
                                                >
                                                    {getStatusIcon(appointment.status)}
                                                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-slate-600">{appointment.notes || 'No notes'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-slate-600">{new Date(appointment.created_at).toLocaleDateString()}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">Quick Actions</h3>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => {
                                console.log('Create appointment button clicked');
                                console.log('Patient data:', patient);
                                try {
                                    setShowCreateModal(true);
                                    console.log('Modal state set to true');
                                } catch (error) {
                                    console.error('Error setting modal state:', error);
                                }
                            }}
                            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
                        >
                            <Plus className="h-4 w-4" />
                            Create Appointment
                        </button>
                        <Link
                            href="/admin/appointments"
                            className="bg-custom-green hover:bg-custom-green-dark inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
                        >
                            <Calendar className="h-4 w-4" />
                            View All Appointments
                        </Link>
                        <Link
                            href="/admin/patients"
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                        >
                            <User className="h-4 w-4" />
                            Back to Patients
                        </Link>
                    </div>
                </div>

                {/* Create Appointment Modal */}
                {showCreateModal && (
                    <div className="bg-opacity-50 fixed inset-0 z-[9999] flex items-center justify-center bg-black">
                        <div className="relative mx-4 w-full max-w-2xl rounded-lg bg-white shadow-xl">
                            <form onSubmit={handleCreateAppointment}>
                                <div className="p-6">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-lg font-medium text-gray-900">Create Appointment for {patient?.name || 'Patient'}</h3>
                                        <button
                                            type="button"
                                            onClick={() => setShowCreateModal(false)}
                                            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        {/* Service Selection */}
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">Service Type</label>
                                            <select
                                                value={data.service}
                                                onChange={(e) => setData('service', e.target.value)}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                                required
                                            >
                                                {allServices.map((service) => (
                                                    <option key={service.id} value={service.id}>
                                                        {service.name} ({service.duration})
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.service && <p className="mt-1 text-sm text-red-600">{errors.service}</p>}
                                        </div>

                                        {/* Appointment Type */}
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">Appointment Type</label>
                                            <select
                                                value={data.appointment_type}
                                                onChange={(e) => setData('appointment_type', e.target.value)}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                                required
                                            >
                                                <option value="telehealth">Telehealth</option>
                                                <option value="in-person">In-Person</option>
                                            </select>
                                            {errors.appointment_type && <p className="mt-1 text-sm text-red-600">{errors.appointment_type}</p>}
                                        </div>

                                        {/* Date */}
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">Date</label>
                                            <input
                                                type="date"
                                                value={data.preferred_date}
                                                onChange={(e) => setData('preferred_date', e.target.value)}
                                                min={getTomorrowDate()}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                                required
                                            />
                                            {errors.preferred_date && <p className="mt-1 text-sm text-red-600">{errors.preferred_date}</p>}
                                        </div>

                                        {/* Time */}
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">Time</label>
                                            <select
                                                value={data.preferred_time}
                                                onChange={(e) => setData('preferred_time', e.target.value)}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                                required
                                            >
                                                <option value="">Select a time</option>
                                                {timeSlots.map((time) => (
                                                    <option key={time} value={time}>
                                                        {time}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.preferred_time && <p className="mt-1 text-sm text-red-600">{errors.preferred_time}</p>}
                                        </div>
                                    </div>

                                    {/* Reason */}
                                    <div className="mt-4">
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Reason for Visit</label>
                                        <textarea
                                            value={data.reason}
                                            onChange={(e) => setData('reason', e.target.value)}
                                            rows={3}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                            placeholder="Brief description of the appointment purpose..."
                                            required
                                        />
                                        {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason}</p>}
                                    </div>

                                    {/* Admin Notes */}
                                    <div className="mt-4">
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Admin Notes (Optional)</label>
                                        <textarea
                                            value={data.admin_notes}
                                            onChange={(e) => setData('admin_notes', e.target.value)}
                                            rows={2}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                            placeholder="Internal notes for staff..."
                                        />
                                        {errors.admin_notes && <p className="mt-1 text-sm text-red-600">{errors.admin_notes}</p>}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 bg-gray-50 px-6 py-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                                    >
                                        {processing ? 'Creating...' : 'Create Appointment'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
