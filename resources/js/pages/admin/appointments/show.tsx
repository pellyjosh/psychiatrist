import { SharedHeader } from '@/components/shared-header';
import { Head, useForm } from '@inertiajs/react';

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
    const { data, setData, processing, post, put, patch, errors } = useForm({
        status: appointment.status || 'pending',
        admin_notes: appointment.admin_notes || '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        patch(`/admin/appointments/${appointment.id}`, {
            preserveScroll: true,
        });
    }

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
                                <p className="text-gray-900">{appointment.service}</p>
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
                            Update Status & Notes
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
        </>
    );
}
