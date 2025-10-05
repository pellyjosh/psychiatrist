import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { dashboard as adminDashboard } from '@/routes/admin';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Calendar, FileText, Folder, LayoutGrid, Users } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<any>().props;
    const isAdmin = auth?.user?.role === 'admin';

    const getDashboardUrl = () => {
        return isAdmin ? adminDashboard().url : dashboard().url;
    };

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: getDashboardUrl(),
            icon: LayoutGrid,
        },
        {
            title: 'Appointments',
            href: isAdmin ? '/admin/appointments' : '/user/appointments',
            icon: Calendar,
        },
        {
            title: 'Resources',
            href: isAdmin ? '/admin/resources' : '/user/resources',
            icon: BookOpen,
        },
        ...(isAdmin
            ? [
                  {
                      title: 'Patients',
                      href: '/admin/patients',
                      icon: Users,
                  },
              ]
            : []),
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: FileText,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={getDashboardUrl()} prefetch>
                                <AppLogo size={48} textColor="text-slate-800" />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
