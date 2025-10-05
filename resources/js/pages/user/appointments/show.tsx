import { SharedHeader } from '@/components/shared-header';
import { Head } from '@inertiajs/react';

interface Appointment {
    id: number;
    service: string;
    preferred_date: string;
    preferred_time: string;
    status: string;
    reason?: string;
    provider?: string;
}

export default function UserAppointmentShow({ appointment }: { appointment: Appointment }) {
    return (
        <>
            <Head title={`Appointment #${appointment.id}`} />
            <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
                <SharedHeader />
                <div className="mx-auto max-w-3xl space-y-8 px-6 py-10">
                    <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm">
                        <h1 className="mb-4 text-xl font-bold text-gray-900">Appointment Details</h1>
                        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                            <div>
                                <p className="font-medium text-gray-700">Service</p>
                                <p className="text-gray-900">{appointment.service}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Date</p>
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
                            {appointment.reason && (
                                <div className="md:col-span-2">
                                    <p className="font-medium text-gray-700">Reason</p>
                                    <p className="whitespace-pre-line text-gray-900">{appointment.reason}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
