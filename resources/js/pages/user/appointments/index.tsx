import UserLayout from '@/layouts/user-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Calendar, CheckCircle, Clock, Filter, Plus, X } from 'lucide-react';
import { useState } from 'react';

interface Appointment {
    id: number;
    service: string;
    preferred_date: string;
    preferred_time: string;
    status: string;
    name: string;
    email: string;
    phone?: string;
    created_at: string;
}

interface Props {
    appointments: {
        data: Appointment[];
        links: any[];
        meta: any;
    };
    filters: {
        status?: string;
        from?: string;
        to?: string;
    };
}

export default function UserAppointmentsIndex({ appointments, filters }: Props) {
    const [showFilters, setShowFilters] = useState(false);
    const [showRescheduleModal, setShowRescheduleModal] = useState<number | null>(null);

    const { data, setData, post, processing } = useForm({
        preferred_date: '',
        preferred_time: '',
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-custom-green text-white';
            case 'pending':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'completed':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircle className="h-4 w-4" />;
            case 'pending':
                return <Clock className="h-4 w-4" />;
            case 'cancelled':
                return <X className="h-4 w-4" />;
            case 'completed':
                return <CheckCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const handleFilter = (filterData: any) => {
        router.get('/user/appointments', filterData, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        router.get('/user/appointments');
    };

    const handleCancel = (appointmentId: number) => {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            router.patch(
                `/user/appointments/${appointmentId}/cancel`,
                {},
                {
                    preserveScroll: true,
                },
            );
        }
    };

    const handleReschedule = (appointmentId: number) => {
        post(`/user/appointments/${appointmentId}/reschedule`, {
            onSuccess: () => {
                setShowRescheduleModal(null);
                setData({ preferred_date: '', preferred_time: '' });
            },
        });
    };

    return (
        <UserLayout>
            <Head title="My Appointments" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">My Appointments</h1>
                        <p className="mt-1 text-slate-600">Manage your scheduled appointments</p>
                    </div>
                    <Link
                        href="/appointments/book"
                        className="bg-custom-green hover:bg-custom-green-dark inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Book New Appointment
                    </Link>
                </div>

                {/* Filters */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-4">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="hover:text-custom-green inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition-colors"
                        >
                            <Filter className="h-4 w-4" />
                            Filters
                        </button>
                    </div>

                    {showFilters && (
                        <div className="border-b border-slate-200 bg-slate-50 p-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
                                    <select
                                        value={filters?.status || ''}
                                        onChange={(e) => handleFilter({ ...filters, status: e.target.value || undefined })}
                                        className="focus:ring-custom-green focus:border-custom-green w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2"
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">From Date</label>
                                    <input
                                        type="date"
                                        value={filters?.from || ''}
                                        onChange={(e) => handleFilter({ ...filters, from: e.target.value || undefined })}
                                        className="focus:ring-custom-green focus:border-custom-green w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">To Date</label>
                                    <input
                                        type="date"
                                        value={filters?.to || ''}
                                        onChange={(e) => handleFilter({ ...filters, to: e.target.value || undefined })}
                                        className="focus:ring-custom-green focus:border-custom-green w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={clearFilters}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Appointments List */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    {appointments.data.length === 0 ? (
                        <div className="py-12 text-center">
                            <Calendar className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                            <h3 className="mb-2 text-lg font-medium text-slate-900">No appointments found</h3>
                            <p className="mb-4 text-slate-600">You don't have any appointments yet.</p>
                            <Link
                                href="/appointments/book"
                                className="bg-custom-green hover:bg-custom-green-dark inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                Book Your First Appointment
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b border-slate-200 bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-900">Service</th>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-900">Date & Time</th>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-900">Status</th>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-900">Booked On</th>
                                        <th className="px-6 py-3 text-right font-semibold text-slate-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {appointments.data.map((appointment) => (
                                        <tr key={appointment.id} className="transition-colors hover:bg-slate-50">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900">{appointment.service}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900">{appointment.preferred_date}</div>
                                                <div className="text-slate-600">{appointment.preferred_time}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(appointment.status)}`}
                                                >
                                                    {getStatusIcon(appointment.status)}
                                                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{new Date(appointment.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/user/appointments/${appointment.id}`}
                                                        className="text-custom-green hover:text-custom-green-dark text-sm font-medium transition-colors"
                                                    >
                                                        View
                                                    </Link>
                                                    {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                                                        <>
                                                            <button
                                                                onClick={() => setShowRescheduleModal(appointment.id)}
                                                                className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
                                                            >
                                                                Reschedule
                                                            </button>
                                                            <button
                                                                onClick={() => handleCancel(appointment.id)}
                                                                className="text-sm font-medium text-red-600 transition-colors hover:text-red-800"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {appointments.links && appointments.links.length > 3 && (
                    <div className="flex items-center justify-center space-x-2">
                        {appointments.links.map((link: any, index: number) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                                    link.active ? 'bg-custom-green text-white' : 'hover:text-custom-green hover:bg-custom-green-light text-slate-600'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Reschedule Modal */}
            {showRescheduleModal && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                    <div className="mx-4 w-full max-w-md rounded-xl bg-white shadow-xl">
                        <div className="p-6">
                            <h3 className="mb-4 text-lg font-semibold text-slate-900">Reschedule Appointment</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">New Date</label>
                                    <input
                                        type="date"
                                        value={data.preferred_date}
                                        onChange={(e) => setData('preferred_date', e.target.value)}
                                        className="focus:ring-custom-green focus:border-custom-green w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2"
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">New Time</label>
                                    <select
                                        value={data.preferred_time}
                                        onChange={(e) => setData('preferred_time', e.target.value)}
                                        className="focus:ring-custom-green focus:border-custom-green w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2"
                                    >
                                        <option value="">Select time</option>
                                        <option value="9:00 AM">9:00 AM</option>
                                        <option value="10:00 AM">10:00 AM</option>
                                        <option value="11:00 AM">11:00 AM</option>
                                        <option value="2:00 PM">2:00 PM</option>
                                        <option value="3:00 PM">3:00 PM</option>
                                        <option value="4:00 PM">4:00 PM</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-6 flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setShowRescheduleModal(null)}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleReschedule(showRescheduleModal)}
                                    disabled={processing}
                                    className="bg-custom-green hover:bg-custom-green-dark rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Rescheduling...' : 'Reschedule'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </UserLayout>
    );
}
