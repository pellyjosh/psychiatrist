import AdminLayout from '@/layouts/admin-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, CalendarDays, CheckCircle, Clock, Mail, User, XCircle } from 'lucide-react';

interface Patient {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

interface Appointment {
    id: number;
    appointment_date: string;
    appointment_time: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    reason: string;
    notes?: string;
    created_at: string;
}

interface Props {
    patient: Patient;
    appointments: Appointment[];
    appointmentCounts: {
        total: number;
        pending: number;
        confirmed: number;
        completed: number;
        cancelled: number;
    };
}

export default function AdminPatientShow({ patient, appointments, appointmentCounts }: Props) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'confirmed':
                return 'bg-custom-green-light text-custom-green-dark border-custom-green';
            case 'completed':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-4 w-4" />;
            case 'confirmed':
                return <CheckCircle className="h-4 w-4" />;
            case 'completed':
                return <CheckCircle className="h-4 w-4" />;
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
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Patient Details</h1>
                        <p className="mt-1 text-slate-600">View comprehensive patient information and appointment history</p>
                    </div>
                </div>

                {/* Patient Information Card */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 bg-slate-50 p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-custom-green-light flex h-16 w-16 items-center justify-center rounded-full">
                                <User className="text-custom-green h-8 w-8" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-slate-900">{patient.name}</h2>
                                <div className="mt-2 flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Mail className="h-4 w-4" />
                                        <span>{patient.email}</span>
                                    </div>
                                    {patient.email_verified_at ? (
                                        <span className="text-custom-green inline-flex items-center gap-1 text-sm">
                                            <CheckCircle className="h-4 w-4" />
                                            Email Verified
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-sm text-amber-600">
                                            <Clock className="h-4 w-4" />
                                            Email Unverified
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <h3 className="mb-3 text-sm font-medium text-slate-700">Account Information</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-slate-400" />
                                        <div>
                                            <p className="text-sm text-slate-600">Joined</p>
                                            <p className="text-sm font-medium text-slate-900">
                                                {new Date(patient.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-4 w-4 text-slate-400" />
                                        <div>
                                            <p className="text-sm text-slate-600">Last Updated</p>
                                            <p className="text-sm font-medium text-slate-900">
                                                {new Date(patient.updated_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-3 text-sm font-medium text-slate-700">Appointment Summary</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-lg bg-slate-50 p-3 text-center">
                                        <p className="text-xl font-bold text-slate-900">{appointmentCounts.total}</p>
                                        <p className="text-xs text-slate-600">Total</p>
                                    </div>
                                    <div className="bg-custom-green-light rounded-lg p-3 text-center">
                                        <p className="text-custom-green-dark text-xl font-bold">{appointmentCounts.confirmed}</p>
                                        <p className="text-custom-green text-xs">Confirmed</p>
                                    </div>
                                    <div className="rounded-lg bg-amber-50 p-3 text-center">
                                        <p className="text-xl font-bold text-amber-800">{appointmentCounts.pending}</p>
                                        <p className="text-xs text-amber-600">Pending</p>
                                    </div>
                                    <div className="rounded-lg bg-blue-50 p-3 text-center">
                                        <p className="text-xl font-bold text-blue-800">{appointmentCounts.completed}</p>
                                        <p className="text-xs text-blue-600">Completed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Appointments History */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">Appointment History</h2>
                                <p className="text-sm text-slate-600">Complete history of all appointments</p>
                            </div>
                            <CalendarDays className="h-6 w-6 text-slate-400" />
                        </div>
                    </div>

                    {appointments.length === 0 ? (
                        <div className="py-12 text-center">
                            <Calendar className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                            <h3 className="mb-2 text-lg font-medium text-slate-900">No appointments found</h3>
                            <p className="text-slate-600">This patient hasn't scheduled any appointments yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b border-slate-200 bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-900">Date & Time</th>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-900">Reason</th>
                                        <th className="px-6 py-3 text-center font-semibold text-slate-900">Status</th>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-900">Notes</th>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-900">Scheduled</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {appointments.map((appointment) => (
                                        <tr key={appointment.id} className="transition-colors hover:bg-slate-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-slate-900">
                                                        {new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}
                                                    </div>
                                                    <div className="text-sm text-slate-600">
                                                        {new Date(
                                                            `${appointment.appointment_date} ${appointment.appointment_time}`,
                                                        ).toLocaleTimeString('en-US', {
                                                            hour: 'numeric',
                                                            minute: '2-digit',
                                                            hour12: true,
                                                        })}
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
            </div>
        </AdminLayout>
    );
}
