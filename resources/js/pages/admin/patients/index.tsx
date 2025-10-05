import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, CheckCircle, Clock, Search, User, Users } from 'lucide-react';
import { useState } from 'react';

interface Patient {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    appointments_count: number;
    pending_appointments_count: number;
    confirmed_appointments_count: number;
    completed_appointments_count: number;
}

interface Props {
    patients: {
        data: Patient[];
        links: any[];
        meta: any;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function AdminPatientsIndex({ patients, filters }: Props) {
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/patients',
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
        router.get('/admin/patients', filterData, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearchQuery('');
        router.get('/admin/patients');
    };

    return (
        <AdminLayout>
            <Head title="Manage Patients" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Manage Patients</h1>
                        <p className="mt-1 text-slate-600">View and manage all registered patients</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Total Patients</p>
                                <p className="text-2xl font-bold text-slate-900">{patients.meta?.total || 0}</p>
                            </div>
                            <Users className="h-8 w-8 text-slate-400" />
                        </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-custom-green text-sm font-medium">Active Patients</p>
                                <p className="text-custom-green-dark text-2xl font-bold">
                                    {patients.data.filter((p) => p.appointments_count > 0).length}
                                </p>
                            </div>
                            <Calendar className="text-custom-green h-8 w-8" />
                        </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-amber-600">Pending Appointments</p>
                                <p className="text-2xl font-bold text-amber-900">
                                    {patients.data.reduce((sum, p) => sum + p.pending_appointments_count, 0)}
                                </p>
                            </div>
                            <Clock className="h-8 w-8 text-amber-400" />
                        </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Completed Sessions</p>
                                <p className="text-2xl font-bold text-blue-900">
                                    {patients.data.reduce((sum, p) => sum + p.completed_appointments_count, 0)}
                                </p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-blue-400" />
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
                                        placeholder="Search patients by name or email..."
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
                                Filters
                            </button>
                        </form>
                    </div>

                    {showFilters && (
                        <div className="border-b border-slate-200 bg-slate-50 p-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Filter by Appointment Status</label>
                                    <select
                                        value={filters?.status || ''}
                                        onChange={(e) => handleFilter({ ...filters, search: searchQuery, status: e.target.value || undefined })}
                                        className="focus:ring-custom-green focus:border-custom-green w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2"
                                    >
                                        <option value="">All Patients</option>
                                        <option value="pending">With Pending Appointments</option>
                                        <option value="confirmed">With Confirmed Appointments</option>
                                        <option value="completed">With Completed Appointments</option>
                                        <option value="cancelled">With Cancelled Appointments</option>
                                    </select>
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

                {/* Patients List */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    {patients.data.length === 0 ? (
                        <div className="py-12 text-center">
                            <Users className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                            <h3 className="mb-2 text-lg font-medium text-slate-900">No patients found</h3>
                            <p className="text-slate-600">No patients match your current search and filters.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b border-slate-200 bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-900">Patient</th>
                                        <th className="px-6 py-3 text-center font-semibold text-slate-900">Total Appointments</th>
                                        <th className="px-6 py-3 text-center font-semibold text-slate-900">Pending</th>
                                        <th className="px-6 py-3 text-center font-semibold text-slate-900">Confirmed</th>
                                        <th className="px-6 py-3 text-center font-semibold text-slate-900">Completed</th>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-900">Joined</th>
                                        <th className="px-6 py-3 text-right font-semibold text-slate-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {patients.data.map((patient) => (
                                        <tr key={patient.id} className="transition-colors hover:bg-slate-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-custom-green-light flex h-10 w-10 items-center justify-center rounded-full">
                                                        <User className="text-custom-green h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-900">{patient.name}</div>
                                                        <div className="text-slate-600">{patient.email}</div>
                                                        <div className="mt-1 flex items-center gap-2">
                                                            {patient.email_verified_at ? (
                                                                <span className="text-custom-green inline-flex items-center gap-1 text-xs">
                                                                    <CheckCircle className="h-3 w-3" />
                                                                    Verified
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                                                                    <Clock className="h-3 w-3" />
                                                                    Unverified
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="text-lg font-semibold text-slate-900">{patient.appointments_count}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="text-lg font-semibold text-amber-600">{patient.pending_appointments_count}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="text-custom-green text-lg font-semibold">{patient.confirmed_appointments_count}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="text-lg font-semibold text-blue-600">{patient.completed_appointments_count}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{new Date(patient.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/admin/patients/${patient.id}`}
                                                    className="text-custom-green hover:text-custom-green-dark text-sm font-medium transition-colors"
                                                >
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {patients.links && patients.links.length > 3 && (
                    <div className="flex items-center justify-center space-x-2">
                        {patients.links.map((link: any, index: number) => (
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
