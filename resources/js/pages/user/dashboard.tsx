import UserLayout from '@/layouts/user-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AlertCircle, Calendar, CheckCircle, Clock, FileText } from 'lucide-react';

interface Appointment {
    id: number;
    service: string;
    preferred_date: string;
    preferred_time: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

interface Props {
    auth: { user: { id: number; name: string; email: string; role?: string } };
    appointments?: Appointment[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'confirmed':
            return <Clock className="text-custom-green h-5 w-5" />;
        case 'completed':
            return <AlertCircle className="h-5 w-5 text-amber-600" />;
        case 'cancelled':
            return <AlertCircle className="h-5 w-5 text-red-600" />;
        default:
            return <Clock className="h-5 w-5 text-blue-600" />;
    }
};

export default function UserDashboard({ auth, appointments = [] }: Props) {
    const upcoming = appointments.filter((a) => ['confirmed', 'pending'].includes(a.status)).slice(0, 5);

    return (
        <UserLayout breadcrumbs={breadcrumbs}>
            <Head title="Your Dashboard - Psychiatry PLLC" />
            <div className="space-y-8">
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold text-slate-800">Welcome back, {auth.user.name}</h1>
                    <p className="text-slate-600">Here's a quick overview of your appointments and recent activity.</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="group hover:border-custom-green rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium tracking-wide text-slate-600 uppercase">Upcoming</p>
                                <p className="mt-2 text-3xl font-bold text-slate-800">
                                    {appointments.filter((a) => a.status === 'confirmed').length}
                                </p>
                            </div>
                            <div className="bg-custom-green-light group-hover:bg-custom-green flex h-12 w-12 items-center justify-center rounded-xl transition-colors">
                                <CheckCircle className="text-custom-green h-6 w-6" />
                            </div>
                        </div>
                    </div>
                    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-amber-200 hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium tracking-wide text-slate-600 uppercase">Pending</p>
                                <p className="mt-2 text-3xl font-bold text-slate-800">{appointments.filter((a) => a.status === 'pending').length}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 transition-colors group-hover:bg-amber-200">
                                <Clock className="h-6 w-6 text-amber-600" />
                            </div>
                        </div>
                    </div>
                    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium tracking-wide text-slate-600 uppercase">Total</p>
                                <p className="mt-2 text-3xl font-bold text-slate-800">{appointments.length}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 transition-colors group-hover:bg-slate-200">
                                <FileText className="h-6 w-6 text-slate-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upcoming Appointments */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 p-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Your Appointments</h2>
                            <p className="mt-1 text-sm text-slate-600">Manage your scheduled sessions</p>
                        </div>
                        <a
                            href="/appointments/book"
                            className="bg-custom-green hover:bg-custom-green-dark inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors"
                        >
                            <Calendar className="mr-2 h-4 w-4" />
                            Book New
                        </a>
                    </div>
                    <div className="p-6">
                        {upcoming.length > 0 ? (
                            <div className="space-y-3">
                                {upcoming.map((a) => (
                                    <div
                                        key={a.id}
                                        className="hover:bg-custom-green-light hover:border-custom-green flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all duration-200"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="bg-custom-green-light flex h-10 w-10 items-center justify-center rounded-lg">
                                                {getStatusIcon(a.status)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800">{a.service}</p>
                                                <p className="text-sm text-slate-600">{a.preferred_date}</p>
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
                                <p className="text-slate-600">No upcoming appointments.</p>
                                <p className="mt-1 text-sm text-slate-500">Schedule your next session to get started.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 p-6">
                        <h2 className="text-xl font-bold text-slate-800">Quick Actions</h2>
                        <p className="mt-1 text-sm text-slate-600">Common tasks and helpful resources</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 p-6 md:grid-cols-4">
                        <a
                            href="/appointments/book"
                            className="group hover:bg-custom-green-light hover:border-custom-green flex flex-col items-center rounded-xl border border-slate-200 p-6 transition-all hover:shadow-sm"
                        >
                            <div className="bg-custom-green-light group-hover:bg-custom-green mb-3 flex h-12 w-12 items-center justify-center rounded-lg transition-colors">
                                <Calendar className="text-custom-green h-6 w-6" />
                            </div>
                            <span className="group-hover:text-custom-green text-sm font-medium text-slate-700">Book Appointment</span>
                        </a>
                        <a
                            href="/resources"
                            className="group flex flex-col items-center rounded-xl border border-slate-200 p-6 transition-all hover:border-green-200 hover:bg-green-50 hover:shadow-sm"
                        >
                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 transition-colors group-hover:bg-green-200">
                                <FileText className="h-6 w-6 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-slate-700 group-hover:text-green-700">Resources</span>
                        </a>
                        <a
                            href="/profile"
                            className="group flex flex-col items-center rounded-xl border border-slate-200 p-6 transition-all hover:border-purple-200 hover:bg-purple-50 hover:shadow-sm"
                        >
                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 transition-colors group-hover:bg-purple-200">
                                <CheckCircle className="h-6 w-6 text-purple-600" />
                            </div>
                            <span className="text-sm font-medium text-slate-700 group-hover:text-purple-700">Profile Settings</span>
                        </a>
                        <a
                            href="/support"
                            className="group flex flex-col items-center rounded-xl border border-slate-200 p-6 transition-all hover:border-amber-200 hover:bg-amber-50 hover:shadow-sm"
                        >
                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 transition-colors group-hover:bg-amber-200">
                                <AlertCircle className="h-6 w-6 text-amber-600" />
                            </div>
                            <span className="text-sm font-medium text-slate-700 group-hover:text-amber-700">Get Support</span>
                        </a>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
