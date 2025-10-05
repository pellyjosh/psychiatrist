import { Head, router } from '@inertiajs/react';
import { useEffect } from 'react';

export default function LegacyDashboardRedirect() {
    useEffect(() => {
        // Decide where to send based on role from initial page props
        // We rely on server still passing auth until this file is removed.
        // If no auth, fallback to user dashboard.
        const props: any = (window as any).Laravel?.page?.props || {};
        const role = props?.auth?.user?.role;
        if (role === 'admin') {
            router.visit('/admin/dashboard', { replace: true });
        } else {
            router.visit('/dashboard', { replace: true });
        }
    }, []);
    return (
        <div className="p-6">
            <Head title="Redirecting..." />
            <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
        </div>
    );
}
