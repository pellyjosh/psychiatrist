import { FormInput, FormSelect, FormTextarea } from '@/components/ui/form-inputs';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, CalendarDays, CheckCircle, Clock, Edit, Eye, Filter, Plus, Search, User, X, XCircle } from 'lucide-react';
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
    service?: string;
    appointment_type?: string;
    alternate_date?: string;
    alternate_time?: string;
    current_symptoms?: string;
    current_medications?: string;
    allergies?: string;
}

interface Service {
    id: number;
    code: string;
    name: string;
    duration: number;
}

interface AppointmentType {
    id: number;
    code: string;
    name: string;
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
    services: Service[];
    appointmentTypes: AppointmentType[];
}

export default function AdminAppointmentsIndex({ appointments, filters, stats, services, appointmentTypes }: Props) {
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [appointmentToDecline, setAppointmentToDecline] = useState<number | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | null>(null);
    const [editFormData, setEditFormData] = useState({
        // Date & Time
        preferred_date: '',
        preferred_time: '',

        // Service Details
        service: '',
        appointment_type: 'telehealth' as 'telehealth' | 'in-person',

        // Medical Information
        reason: '',
        currentSymptoms: '',
        currentMedications: '',
        allergies: '',

        // Admin fields
        admin_notes: '',
    });

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
        setAppointmentToDecline(appointmentId);
        setShowDeclineModal(true);
    };

    const confirmDecline = () => {
        if (appointmentToDecline) {
            router.post(
                `/admin/appointments/${appointmentToDecline}/decline`,
                {},
                {
                    preserveState: true,
                },
            );
        }
        setShowDeclineModal(false);
        setAppointmentToDecline(null);
    };

    const cancelDecline = () => {
        setShowDeclineModal(false);
        setAppointmentToDecline(null);
    };

    const handleEdit = (appointment: Appointment) => {
        console.log('Editing appointment:', appointment);
        setAppointmentToEdit(appointment);

        // Format date properly for date input (YYYY-MM-DD)
        const formatDateForInput = (dateString: string) => {
            if (!dateString) return '';
            try {
                // Handle ISO date strings (e.g., "2025-10-16T00:00:00.000000Z")
                let dateStr = dateString;
                if (dateStr.includes('T')) {
                    dateStr = dateStr.split('T')[0];
                }
                // Validate the date
                const date = new Date(dateStr + 'T00:00:00');
                if (isNaN(date.getTime())) return '';
                return dateStr; // Return YYYY-MM-DD format
            } catch {
                return '';
            }
        };

        const formData = {
            preferred_date: formatDateForInput(appointment.appointment_date),
            preferred_time: appointment.appointment_time || '',
            service: appointment.service || '',
            appointment_type: (appointment.appointment_type as 'telehealth' | 'in-person') || 'telehealth',
            reason: appointment.reason || '',
            currentSymptoms: appointment.current_symptoms || '',
            currentMedications: appointment.current_medications || '',
            allergies: appointment.allergies || '',
            admin_notes: appointment.notes || '',
        };

        console.log('Setting form data:', formData);
        setEditFormData(formData);
        setShowEditModal(true);
    };

    const handleSaveEdit = () => {
        if (appointmentToEdit) {
            console.log('Saving appointment with data:', editFormData);
            router.put(`/admin/appointments/${appointmentToEdit.id}`, editFormData, {
                preserveState: true,
                onSuccess: () => {
                    console.log('Appointment updated successfully');
                    setShowEditModal(false);
                    setAppointmentToEdit(null);
                },
                onError: (errors) => {
                    console.error('Edit appointment errors:', errors);
                },
            });
        }
    };

    const cancelEdit = () => {
        setAppointmentToEdit(null);
        setEditFormData({
            preferred_date: '',
            preferred_time: '',
            service: '',
            appointment_type: 'telehealth',
            reason: '',
            currentSymptoms: '',
            currentMedications: '',
            allergies: '',
            admin_notes: '',
        });
        setShowEditModal(false);
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
                    <Link
                        href="/admin/appointments/create"
                        className="inline-flex items-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Appointment
                    </Link>
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
                                    <FormSelect
                                        label="Status"
                                        value={filters?.status || ''}
                                        onChange={(e) => handleFilter({ ...filters, search: searchQuery, status: e.target.value || undefined })}
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </FormSelect>
                                </div>
                                <div>
                                    <FormInput
                                        type="date"
                                        label="Date"
                                        value={filters?.date || ''}
                                        onChange={(e) => handleFilter({ ...filters, search: searchQuery, date: e.target.value || undefined })}
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
                                        <th className="px-6 py-3 text-center font-semibold text-slate-900">Actions</th>
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
                                                        {(() => {
                                                            try {
                                                                // Handle date string that might be in ISO format
                                                                let dateStr = appointment.appointment_date;
                                                                if (dateStr && dateStr.includes('T')) {
                                                                    dateStr = dateStr.split('T')[0];
                                                                }
                                                                const date = new Date(dateStr + 'T00:00:00');
                                                                if (isNaN(date.getTime())) {
                                                                    return 'Invalid Date';
                                                                }
                                                                return date.toLocaleDateString('en-US', {
                                                                    weekday: 'short',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric',
                                                                });
                                                            } catch (error) {
                                                                return 'Invalid Date';
                                                            }
                                                        })()}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm text-slate-600">
                                                        <Clock className="h-3 w-3" />
                                                        {appointment.appointment_time || 'Time not set'}
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
                                                <div className="text-sm text-slate-600">
                                                    {(() => {
                                                        try {
                                                            const date = new Date(appointment.created_at);
                                                            if (isNaN(date.getTime())) {
                                                                return 'Invalid Date';
                                                            }
                                                            return date.toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric',
                                                            });
                                                        } catch (error) {
                                                            return 'Invalid Date';
                                                        }
                                                    })()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    {appointment.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(appointment.id)}
                                                                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-green-600 transition-colors hover:bg-green-100 hover:text-green-700"
                                                                title="Accept appointment"
                                                            >
                                                                <CheckCircle size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDecline(appointment.id)}
                                                                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600 transition-colors hover:bg-red-100 hover:text-red-700"
                                                                title="Decline appointment"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => handleEdit(appointment)}
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-yellow-50 text-yellow-600 transition-colors hover:bg-yellow-100 hover:text-yellow-700"
                                                        title="Edit appointment"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <Link
                                                        href={`/admin/patients/${appointment.user.id}`}
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100 hover:text-blue-700"
                                                        title="View patient details"
                                                    >
                                                        <Eye size={16} />
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

            {/* Decline Confirmation Modal */}
            {showDeclineModal && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                    <div className="relative mx-4 w-full max-w-md rounded-lg bg-white shadow-xl">
                        <div className="p-6">
                            <div className="mb-4 flex items-center justify-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                    <XCircle className="h-6 w-6 text-red-600" />
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="mb-2 text-lg font-medium text-gray-900">Decline Appointment</h3>
                                <p className="text-sm text-gray-600">
                                    Are you sure you want to decline this appointment? This action cannot be undone.
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 bg-gray-50 px-6 py-4">
                            <button
                                type="button"
                                onClick={cancelDecline}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDecline}
                                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
                            >
                                Decline Appointment
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit/Reschedule Appointment Modal */}
            {showEditModal && appointmentToEdit && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
                    <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col rounded-xl bg-white shadow-2xl">
                        {/* Modal Header - Fixed */}
                        <div className="flex items-center justify-between border-b border-gray-200 p-6">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">Edit Appointment</h3>
                                <p className="mt-1 text-sm text-gray-600">Patient: {appointmentToEdit.user.name}</p>
                            </div>
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="space-y-8">
                                {/* Patient Information Section */}
                                <div className="rounded-lg bg-gray-50 p-4">
                                    <h4 className="mb-3 flex items-center text-sm font-semibold text-gray-700">
                                        <User className="mr-2 h-4 w-4" />
                                        Patient Information
                                    </h4>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">Patient Name</label>
                                            <div className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 font-medium text-gray-600">
                                                {appointmentToEdit.user.name}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
                                            <div className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-600">
                                                {appointmentToEdit.user.email}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Appointment Details Section */}
                                <div>
                                    <h4 className="mb-4 flex items-center text-sm font-semibold text-gray-700">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Appointment Details
                                    </h4>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div>
                                            <FormInput
                                                type="date"
                                                label="Appointment Date *"
                                                value={editFormData.preferred_date}
                                                onChange={(e) => setEditFormData({ ...editFormData, preferred_date: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <FormInput
                                                type="time"
                                                label="Appointment Time *"
                                                value={editFormData.preferred_time}
                                                onChange={(e) => setEditFormData({ ...editFormData, preferred_time: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <FormSelect
                                                label="Service Type *"
                                                value={editFormData.service}
                                                onChange={(e) => setEditFormData({ ...editFormData, service: e.target.value })}
                                                required
                                            >
                                                <option value="">Select a service</option>
                                                {services.map((service) => (
                                                    <option key={service.id} value={service.code}>
                                                        {service.name}
                                                    </option>
                                                ))}
                                            </FormSelect>
                                        </div>

                                        <div>
                                            <FormSelect
                                                label="Appointment Type *"
                                                value={editFormData.appointment_type}
                                                onChange={(e) =>
                                                    setEditFormData({
                                                        ...editFormData,
                                                        appointment_type: e.target.value as 'telehealth' | 'in-person',
                                                    })
                                                }
                                                required
                                            >
                                                {appointmentTypes.map((type) => (
                                                    <option key={type.id} value={type.code}>
                                                        {type.name}
                                                    </option>
                                                ))}
                                            </FormSelect>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Created At</label>
                                            <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-600">
                                                {appointmentToEdit &&
                                                    (() => {
                                                        try {
                                                            const date = new Date(appointmentToEdit.created_at);
                                                            if (isNaN(date.getTime())) {
                                                                return 'Invalid Date';
                                                            }
                                                            return date.toLocaleString('en-US', {
                                                                weekday: 'short',
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                timeZoneName: 'short',
                                                            });
                                                        } catch (error) {
                                                            return 'Invalid Date';
                                                        }
                                                    })()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Medical Information Section */}
                                <div>
                                    <h4 className="mb-4 flex items-center text-sm font-semibold text-gray-700">
                                        <User className="mr-2 h-4 w-4" />
                                        Medical Information
                                    </h4>
                                    <div className="space-y-6">
                                        <div>
                                            <FormTextarea
                                                label="Reason for Visit *"
                                                value={editFormData.reason}
                                                onChange={(e) => setEditFormData({ ...editFormData, reason: e.target.value })}
                                                rows={3}
                                                placeholder="Brief description of the appointment purpose..."
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div>
                                                <FormTextarea
                                                    label="Current Symptoms"
                                                    value={editFormData.currentSymptoms}
                                                    onChange={(e) => setEditFormData({ ...editFormData, currentSymptoms: e.target.value })}
                                                    rows={4}
                                                    placeholder="Describe current symptoms..."
                                                />
                                            </div>

                                            <div>
                                                <FormTextarea
                                                    label="Current Medications"
                                                    value={editFormData.currentMedications}
                                                    onChange={(e) => setEditFormData({ ...editFormData, currentMedications: e.target.value })}
                                                    rows={4}
                                                    placeholder="List current medications, dosages, and frequency..."
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div>
                                                <FormTextarea
                                                    label="Allergies"
                                                    value={editFormData.allergies}
                                                    onChange={(e) => setEditFormData({ ...editFormData, allergies: e.target.value })}
                                                    rows={3}
                                                    placeholder="List any known allergies..."
                                                />
                                            </div>

                                            <div>
                                                <FormTextarea
                                                    label="Additional Notes"
                                                    value={editFormData.admin_notes}
                                                    onChange={(e) => setEditFormData({ ...editFormData, admin_notes: e.target.value })}
                                                    rows={3}
                                                    placeholder="Additional notes or special instructions..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer - Fixed */}
                        <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveEdit}
                                className="rounded-lg bg-teal-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
