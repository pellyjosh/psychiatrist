import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, ArrowRight, BookOpen, Calendar, CheckCircle, MessageSquare, Users } from 'lucide-react';

interface Appointment {
    id: number;
    name: string;
    service: string;
    preferred_time: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    preferred_date: string;
}

interface Props {
    auth: { user: { id: number; name: string; email: string; role?: string } };
    stats?: { totalAppointments: number; pendingAppointments: number; completedToday: number; newInquiries: number };
    recentAppointments?: Appointment[];
    appointments?: Appointment[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Dashboard', href: '/admin/dashboard' },
];

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'confirmed':
            return <CheckCircle className="h-5 w-5 text-green-600" />;
        case 'pending':
            return <AlertCircle className="h-5 w-5 text-amber-600" />;
        case 'cancelled':
            return <AlertCircle className="h-5 w-5 text-red-600" />;
        default:
            return <Calendar className="text-custom-green h-5 w-5" />;
    }
};

export default function AdminDashboard({ auth, stats, recentAppointments = [], appointments = [] }: Props) {
    const safeStats = stats || {
        totalAppointments: appointments.length,
        pendingAppointments: appointments.filter((a) => a.status === 'pending').length,
        completedToday: appointments.filter((a) => a.status === 'completed').length,
        newInquiries: appointments.filter((a) => a.status === 'pending').length,
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard - Psychiatry PLLC" />
            <div className="space-y-8">
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold text-slate-800">Good day, {auth.user.name}</h1>
                    <p className="text-slate-600">Here is an overview of current clinic activity and appointments.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="group hover:border-custom-green rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium tracking-wide text-slate-600 uppercase">Total Appointments</p>
                                <p className="mt-2 text-3xl font-bold text-slate-800">{safeStats.totalAppointments}</p>
                            </div>
                            <div className="bg-custom-green-light group-hover:bg-custom-green flex h-12 w-12 items-center justify-center rounded-xl transition-colors">
                                <Calendar className="text-custom-green h-6 w-6" />
                            </div>
                        </div>
                    </div>
                    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-amber-200 hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium tracking-wide text-slate-600 uppercase">Pending</p>
                                <p className="mt-2 text-3xl font-bold text-slate-800">{safeStats.pendingAppointments}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 transition-colors group-hover:bg-amber-200">
                                <AlertCircle className="h-6 w-6 text-amber-600" />
                            </div>
                        </div>
                    </div>
                    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-green-200 hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium tracking-wide text-slate-600 uppercase">Completed Today</p>
                                <p className="mt-2 text-3xl font-bold text-slate-800">{safeStats.completedToday}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 transition-colors group-hover:bg-green-200">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-purple-200 hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium tracking-wide text-slate-600 uppercase">New Inquiries</p>
                                <p className="mt-2 text-3xl font-bold text-slate-800">{safeStats.newInquiries}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 transition-colors group-hover:bg-purple-200">
                                <MessageSquare className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Appointments */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 p-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Today's Appointments</h2>
                            <p className="mt-1 text-sm text-slate-600">Recent appointment activity</p>
                        </div>
                    </div>
                    <div className="p-6">
                        {recentAppointments.length > 0 ? (
                            <div className="space-y-3">
                                {recentAppointments.map((a) => (
                                    <div
                                        key={a.id}
                                        className="hover:bg-custom-green-light hover:border-custom-green flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all duration-200"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="bg-custom-green-light flex h-10 w-10 items-center justify-center rounded-lg">
                                                {getStatusIcon(a.status)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800">{a.name}</p>
                                                <p className="text-sm text-slate-600">{a.service}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-slate-800">{a.preferred_time}</p>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                                                    a.status === 'confirmed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : a.status === 'pending'
                                                          ? 'bg-amber-100 text-amber-800'
                                                          : 'bg-slate-100 text-slate-800'
                                                }`}
                                            >
                                                {a.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center">
                                <Calendar className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                                <p className="text-slate-600">No appointments for today.</p>
                                <p className="mt-1 text-sm text-slate-500">Check back later for updates.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 p-6">
                        <h2 className="text-xl font-bold text-slate-800">Quick Actions</h2>
                        <p className="mt-1 text-sm text-slate-600">Access key areas of your admin panel</p>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {/* Appointments Quick Action */}
                            <Link
                                href="/admin/appointments"
                                className="group from-custom-green-light to-custom-green/10 hover:border-custom-green relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br p-6 transition-all duration-300 hover:shadow-lg"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="bg-custom-green flex h-12 w-12 items-center justify-center rounded-lg text-white">
                                            <Calendar className="h-6 w-6" />
                                        </div>
                                        <h3 className="mt-4 text-lg font-semibold text-slate-800">Appointments</h3>
                                        <p className="mt-1 text-sm text-slate-600">Manage patient appointments</p>
                                        <div className="text-custom-green mt-4 flex items-center text-sm font-medium">
                                            <span>View all</span>
                                            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-custom-green/5 absolute -top-6 -right-6 h-24 w-24 rounded-full"></div>
                            </Link>

                            {/* Patients Quick Action */}
                            <Link
                                href="/admin/patients"
                                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 transition-all duration-300 hover:border-blue-300 hover:shadow-lg"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
                                            <Users className="h-6 w-6" />
                                        </div>
                                        <h3 className="mt-4 text-lg font-semibold text-slate-800">Patients</h3>
                                        <p className="mt-1 text-sm text-slate-600">View and manage patients</p>
                                        <div className="mt-4 flex items-center text-sm font-medium text-blue-600">
                                            <span>View all</span>
                                            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-blue-600/5"></div>
                            </Link>

                            {/* Resources Quick Action */}
                            <Link
                                href="/admin/resources"
                                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-purple-50 to-purple-100/50 p-6 transition-all duration-300 hover:border-purple-300 hover:shadow-lg"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600 text-white">
                                            <BookOpen className="h-6 w-6" />
                                        </div>
                                        <h3 className="mt-4 text-lg font-semibold text-slate-800">Resources</h3>
                                        <p className="mt-1 text-sm text-slate-600">Manage patient resources</p>
                                        <div className="mt-4 flex items-center text-sm font-medium text-purple-600">
                                            <span>Manage</span>
                                            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-purple-600/5"></div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
