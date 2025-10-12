import { SharedHeader } from '@/components/shared-header';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Appointment {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    service: string;
    preferred_date: string;
    preferred_time: string;
    status: string;
    admin_notes?: string;
    insurance_provider?: string;
    reason?: string;
}

export default function AdminAppointmentShow({ appointment }: { appointment: Appointment }) {
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);

    const { data, setData, processing, post, put, patch, errors } = useForm({
        status: appointment.status || 'pending',
        service: appointment.service || 'initial-evaluation',
        admin_notes: appointment.admin_notes || '',
    });

    const {
        data: rescheduleData,
        setData: setRescheduleData,
        post: postReschedule,
        processing: rescheduleProcessing,
        errors: rescheduleErrors,
    } = useForm({
        preferred_date: appointment.preferred_date || '',
        preferred_time: appointment.preferred_time || '',
        reschedule_reason: '',
    });

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

    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

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

    function submit(e: React.FormEvent) {
        e.preventDefault();
        patch(`/admin/appointments/${appointment.id}`, {
            preserveScroll: true,
        });
    }

    function handleReschedule(e: React.FormEvent) {
        e.preventDefault();
        postReschedule(`/admin/appointments/${appointment.id}/reschedule`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowRescheduleModal(false);
            },
        });
    }

    const getCurrentServiceName = () => {
        const service = allServices.find((s) => s.id === appointment.service);
        return service ? service.name : appointment.service;
    };

    return (
        <>
            <Head title={`Appointment #${appointment.id}`} />
            <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
                <SharedHeader />
                <div className="mx-auto max-w-4xl space-y-8 px-6 py-10">
                    <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm">
                        <h1 className="mb-4 text-xl font-bold text-gray-900">Appointment Details</h1>
                        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                            <div>
                                <p className="font-medium text-gray-700">Patient</p>
                                <p className="text-gray-900">
                                    {appointment.first_name} {appointment.last_name}
                                </p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Email</p>
                                <p className="text-gray-900">{appointment.email}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Service</p>
                                <p className="text-gray-900">{getCurrentServiceName()}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Preferred Date</p>
                                <p className="text-gray-900">{appointment.preferred_date}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Time</p>
                                <p className="text-gray-900">{appointment.preferred_time}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Status</p>
                                <p className="text-gray-900 capitalize">{appointment.status}</p>
                            </div>
                            {appointment.insurance_provider && (
                                <div>
                                    <p className="font-medium text-gray-700">Insurance</p>
                                    <p className="text-gray-900">{appointment.insurance_provider}</p>
                                </div>
                            )}
                            {appointment.reason && (
                                <div className="md:col-span-2">
                                    <p className="font-medium text-gray-700">Reason</p>
                                    <p className="whitespace-pre-line text-gray-900">{appointment.reason}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <form onSubmit={submit} className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm" aria-labelledby="updateHeading">
                        <h2 id="updateHeading" className="mb-4 text-lg font-semibold text-gray-900">
                            Update Appointment Details
                        </h2>
                        <div className="mb-4 grid gap-6 md:grid-cols-2">
                            <div>
                                <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 transition outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/30"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="completed">Completed</option>
                                </select>
                                {errors.status && <p className="mt-1 text-xs text-red-600">{errors.status}</p>}
                            </div>
                            <div>
                                <label htmlFor="service" className="mb-1 block text-sm font-medium text-gray-700">
                                    Service Type
                                </label>
                                <select
                                    id="service"
                                    name="service"
                                    value={data.service}
                                    onChange={(e) => setData('service', e.target.value)}
                                    className="w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 transition outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/30"
                                >
                                    {allServices.map((service) => (
                                        <option key={service.id} value={service.id}>
                                            {service.name} ({service.duration})
                                        </option>
                                    ))}
                                </select>
                                {errors.service && <p className="mt-1 text-xs text-red-600">{errors.service}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="admin_notes" className="mb-1 block text-sm font-medium text-gray-700">
                                    Admin Notes (private)
                                </label>
                                <textarea
                                    id="admin_notes"
                                    name="admin_notes"
                                    value={data.admin_notes}
                                    onChange={(e) => setData('admin_notes', e.target.value)}
                                    rows={4}
                                    className="w-full resize-y rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 transition outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/30"
                                />
                                {errors.admin_notes && <p className="mt-1 text-xs text-red-600">{errors.admin_notes}</p>}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setShowRescheduleModal(true)}
                                className="inline-flex items-center rounded-md bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 focus:outline-none"
                            >
                                Reschedule
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center rounded-md bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Reschedule Modal */}
            {showRescheduleModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="bg-opacity-75 fixed inset-0 bg-gray-500 transition-opacity"
                            onClick={() => setShowRescheduleModal(false)}
                        ></div>

                        <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
                            <form onSubmit={handleReschedule}>
                                <div className="mb-4">
                                    <h3 className="mb-4 text-lg font-medium text-gray-900">Reschedule Appointment</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">Date</label>
                                            <input
                                                type="date"
                                                value={rescheduleData.preferred_date}
                                                onChange={(e) => setRescheduleData((prev) => ({ ...prev, preferred_date: e.target.value }))}
                                                min={getTomorrowDate()}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">Time</label>
                                            <select
                                                value={rescheduleData.preferred_time}
                                                onChange={(e) => setRescheduleData((prev) => ({ ...prev, preferred_time: e.target.value }))}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                                required
                                            >
                                                <option value="">Select a time</option>
                                                {generateTimeSlots().map((time) => (
                                                    <option key={time} value={time}>
                                                        {time}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        disabled={rescheduleProcessing}
                                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        {rescheduleProcessing ? 'Rescheduling...' : 'Reschedule'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowRescheduleModal(false)}
                                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
