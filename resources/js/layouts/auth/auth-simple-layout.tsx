import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
            {/* Background Pattern */}
            <div
                className="absolute inset-0 opacity-40"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            ></div>

            <div className="relative flex min-h-screen items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-md">
                    <div className="rounded-3xl border border-green-100 bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col items-center gap-6">
                                <Link href={home()} className="group flex flex-col items-center gap-3 font-medium">
                                    <AppLogoIcon style={{ width: 80, height: 80 }} className="object-contain" aria-hidden="true" />

                                    <div className="text-center">
                                        <div className="mb-1 text-xl font-bold text-green-800">Omolola Akinola</div>
                                        <div className="text-sm font-medium text-green-600">DNP, NP in Psychiatry, PLLC</div>
                                    </div>
                                </Link>

                                <div className="space-y-2 text-center">
                                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                                    <p className="max-w-sm text-center text-sm text-gray-600">{description}</p>
                                </div>
                            </div>
                            {children}
                        </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-10 left-10 h-20 w-20 animate-pulse rounded-full bg-green-200 opacity-70 mix-blend-multiply blur-xl filter"></div>
                    <div className="absolute right-10 bottom-10 h-32 w-32 animate-pulse rounded-full bg-green-300 opacity-50 mix-blend-multiply blur-xl filter"></div>
                </div>
            </div>
        </div>
    );
}
