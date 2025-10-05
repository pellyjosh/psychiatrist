import { FlashMessages } from '@/components/flash-messages';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AdminLayout({ children, breadcrumbs }: Props) {
    const page: any = usePage();
    const user = page.props?.auth?.user;
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            <FlashMessages />
            {/* <div className="mb-4 hidden items-center justify-between md:flex">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Admin Panel</h2>
                    <p className="text-sm text-slate-600">Signed in as {user?.name}</p>
                </div>
            </div> */}
            {children}
        </AppLayoutTemplate>
    );
}
