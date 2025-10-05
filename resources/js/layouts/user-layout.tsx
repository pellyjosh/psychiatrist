import { FlashMessages } from '@/components/flash-messages';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function UserLayout({ children, breadcrumbs }: Props) {
    const page: any = usePage();
    const user = page.props?.auth?.user;
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            <FlashMessages />
            {children}
        </AppLayoutTemplate>
    );
}
