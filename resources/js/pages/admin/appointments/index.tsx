import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, CalendarDays, CheckCircle, Clock, Filter, Search, User, XCircle } from 'lucide-react';
import { useState } from 'react';

interface UserType {
    id: number;
    name: string;
    email: string;
}

interface Appointment {
    id: number;
    appointment_date: string;
    appointment_time: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    reason: string;
    notes?: string;
    created_at: string;
    user: UserType;
}

interface Props {
    appointments: {
        data: Appointment[];
        links: any[];
        meta: any;
    };
    filters: {
        search?: string;
        status?: string;
        date?: string;
    };
    stats: {
        total: number;
        pending: number;
        confirmed: number;
        completed: number;
        cancelled: number;
    };
}

export default function AdminAppointmentsIndex({ appointments, filters, stats }: Props) {
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/appointments',
            {
                ...filters,
                search: searchQuery || undefined,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleFilter = (filterData: any) => {
        router.get('/admin/appointments', filterData, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearchQuery('');
        router.get('/admin/appointments');
    };

    const handleApprove = (appointmentId: number) => {
        router.post(
            `/admin/appointments/${appointmentId}/approve`,
            {},
            {
                preserveState: true,
            },
        );
    };

    const handleDecline = (appointmentId: number) => {
        if (confirm('Are you sure you want to decline this appointment?')) {
            router.post(
                `/admin/appointments/${appointmentId}/decline`,
                {},
                {
                    preserveState: true,
                },
            );
        }
    };

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
            <Head title="Manage Appointments" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Manage Appointments</h1>
                        <p className="mt-1 text-slate-600">Review and manage all patient appointments</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Total</p>
                                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                            </div>
                            <CalendarDays className="h-8 w-8 text-slate-400" />
                        </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-amber-600">Pending</p>
                                <p className="text-2xl font-bold text-amber-800">{stats.pending}</p>
                            </div>
                            <Clock className="h-8 w-8 text-amber-400" />
                        </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-custom-green text-sm font-medium">Confirmed</p>
                                <p className="text-custom-green-dark text-2xl font-bold">{stats.confirmed}</p>
                            </div>
                            <CheckCircle className="text-custom-green h-8 w-8" />
                        </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Completed</p>
                                <p className="text-2xl font-bold text-blue-800">{stats.completed}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-blue-400" />
                        </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-red-600">Cancelled</p>
                                <p className="text-2xl font-bold text-red-800">{stats.cancelled}</p>
                            </div>
                            <XCircle className="h-8 w-8 text-red-400" />
                        </div>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-4">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search appointments by patient name or reason..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="focus:ring-custom-green focus:border-custom-green w-full rounded-lg border border-slate-300 py-2 pr-3 pl-10 text-sm focus:ring-2"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="bg-custom-green hover:bg-custom-green-dark rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
                            >
                                Search
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                            >
                                <Filter className="mr-2 inline h-4 w-4" />
                                Filters
                            </button>
                        </form>
                    </div>

                    {showFilters && (
                        <div className="border-b border-slate-200 bg-slate-50 p-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
                                    <select
                                        value={filters?.status || ''}
                                        onChange={(e) => handleFilter({ ...filters, search: searchQuery, status: e.target.value || undefined })}
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
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Date</label>
                                    <input
                                        type="date"
                                        value={filters?.date || ''}
                                        onChange={(e) => handleFilter({ ...filters, search: searchQuery, date: e.target.value || undefined })}
                                        className="focus:ring-custom-green focus:border-custom-green w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={clearFilters}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                                    >
                                        Clear All Filters
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
                            <p className="text-slate-600">No appointments match your current search and filters.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b border-slate-200 bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-900">Patient</th>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-900">Date & Time</th>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-900">Reason</th>
                                        <th className="px-6 py-3 text-center font-semibold text-slate-900">Status</th>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-900">Scheduled</th>
                                        <th className="px-6 py-3 text-right font-semibold text-slate-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {appointments.data.map((appointment) => (
                                        <tr key={appointment.id} className="transition-colors hover:bg-slate-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-custom-green-light flex h-10 w-10 items-center justify-center rounded-full">
                                                        <User className="text-custom-green h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-900">{appointment.user.name}</div>
                                                        <div className="text-sm text-slate-600">{appointment.user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-slate-900">
                                                        {new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                                                            weekday: 'short',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        })}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm text-slate-600">
                                                        <Clock className="h-3 w-3" />
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
                                                <div className="max-w-xs truncate text-slate-900" title={appointment.reason}>
                                                    {appointment.reason}
                                                </div>
                                                {appointment.notes && (
                                                    <div className="mt-1 max-w-xs truncate text-sm text-slate-600" title={appointment.notes}>
                                                        Notes: {appointment.notes}
                                                    </div>
                                                )}
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
                                                <div className="text-sm text-slate-600">{new Date(appointment.created_at).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {appointment.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(appointment.id)}
                                                                className="text-custom-green hover:text-custom-green-dark text-sm font-medium transition-colors"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleDecline(appointment.id)}
                                                                className="text-sm font-medium text-red-600 transition-colors hover:text-red-800"
                                                            >
                                                                Decline
                                                            </button>
                                                        </>
                                                    )}
                                                    <Link
                                                        href={`/admin/patients/${appointment.user.id}`}
                                                        className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-800"
                                                    >
                                                        View Patient
                                                    </Link>
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
        </AdminLayout>
    );
}
