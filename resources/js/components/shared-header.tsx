import AppLogo from '@/components/app-logo';
import { dashboard, login } from '@/routes';
import { dashboard as adminDashboard } from '@/routes/admin';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface SharedHeaderProps {
    variant?: 'welcome' | 'dashboard' | 'booking' | 'auth';
    showNavigation?: boolean;
}

export function SharedHeader({ variant = 'welcome', showNavigation = true }: SharedHeaderProps) {
    const { auth } = usePage<SharedData>().props;
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState<string>('home');

    const getDashboardUrl = () => {
        return auth?.user?.role === 'admin' ? adminDashboard().url : dashboard().url;
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Intersection Observer for active navigation
    useEffect(() => {
        if (variant !== 'welcome' && variant !== 'booking') return;

        const observerOptions = {
            threshold: [0.1, 0.3, 0.5, 0.7],
            rootMargin: '-20% 0px -20% 0px',
        };

        const observer = new IntersectionObserver((entries) => {
            // Filter entries that are intersecting and sort by intersection ratio
            const visibleEntries = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);

            if (visibleEntries.length > 0) {
                const sectionId = visibleEntries[0].target.id;
                if (sectionId === 'home') {
                    setActiveSection('home');
                } else if (sectionId === 'services') {
                    setActiveSection('services');
                } else if (sectionId === 'providers') {
                    setActiveSection('about');
                } else if (sectionId === 'resources') {
                    setActiveSection('resources');
                } else if (sectionId === 'contact') {
                    setActiveSection('contact');
                }
            }
        }, observerOptions);

        // Observe sections
        const sections = ['home', 'services', 'providers', 'resources', 'contact'];
        sections.forEach((sectionId) => {
            const element = document.getElementById(sectionId);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, [variant]);

    const getHeaderStyles = () => {
        switch (variant) {
            case 'dashboard':
                return 'bg-white border-b border-slate-200';
            case 'booking':
                return `sticky top-0 z-50 transition-all duration-300 ${
                    isScrolled
                        ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-emerald-100'
                        : 'bg-white/90 backdrop-blur-md shadow-sm border-b'
                }`;
            case 'auth':
                return 'bg-white border-b border-slate-200';
            default:
                return `sticky top-0 z-50 transition-all duration-300 ${
                    isScrolled
                        ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-emerald-100'
                        : 'bg-white/90 backdrop-blur-md shadow-sm border-b'
                }`;
        }
    };

    const getLogoSize = () => {
        switch (variant) {
            case 'auth':
                return 80; // Bigger for auth pages
            case 'dashboard':
                return 80; // Bigger for dashboard pages
            default:
                return 60; // Default size for welcome/booking
        }
    };

    const logoScaleClass = isScrolled && (variant === 'welcome' || variant === 'booking') ? 'scale-90' : 'scale-100';
    const getHeaderPadding = () => {
        if (variant === 'auth' || variant === 'dashboard') {
            return 'py-5'; // More padding for larger logo
        }
        return isScrolled && (variant === 'welcome' || variant === 'booking') ? 'py-3' : 'py-4';
    };

    const navItems = [
        { label: 'Home', id: 'home', href: '/' },
        { label: 'Services', id: 'services', href: '/#services' },
        { label: 'About', id: 'about', href: '/#providers' },
        { label: 'Resources', id: 'resources', href: '/#resources' },
        { label: 'Contact', id: 'contact', href: '/#contact' },
    ];

    const getNavItemClass = (itemId: string) => {
        const isActive = activeSection === itemId;
        return `group relative transition-all duration-300 ${isActive ? 'text-emerald-600 font-medium' : 'text-slate-600 hover:text-emerald-600'}`;
    };

    const getNavUnderlineClass = (itemId: string) => {
        const isActive = activeSection === itemId;
        return `absolute -bottom-1 left-0 h-0.5 bg-emerald-600 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`;
    };

    return (
        <header className={getHeaderStyles()}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className={`flex items-center justify-between transition-all duration-300 ${getHeaderPadding()}`}>
                    {/* Logo */}
                    <Link href="/" className="group flex items-center space-x-2">
                        <div className={`origin-left transition-transform duration-300 ${logoScaleClass}`}>
                            <AppLogo size={getLogoSize()} text="Omolola Akinola Psychiatry PLLC" textColor="text-emerald-700" />
                        </div>
                    </Link>

                    {/* Navigation - only show on welcome and booking pages */}
                    {showNavigation && (variant === 'welcome' || variant === 'booking') && (
                        <nav className="hidden space-x-8 md:flex">
                            {navItems.map((item) => (
                                <a
                                    key={item.id}
                                    href={item.href}
                                    className={getNavItemClass(item.id)}
                                    onClick={(e) => {
                                        if (item.id !== 'home') {
                                            e.preventDefault();
                                            // Immediately update active state
                                            setActiveSection(item.id);
                                            const element = document.getElementById(item.id === 'about' ? 'providers' : item.id);
                                            if (element) {
                                                element.scrollIntoView({ behavior: 'smooth' });
                                            }
                                        } else {
                                            // Handle home click
                                            e.preventDefault();
                                            setActiveSection('home');
                                            const element = document.getElementById('home');
                                            if (element) {
                                                element.scrollIntoView({ behavior: 'smooth' });
                                            }
                                        }
                                    }}
                                >
                                    {item.label}
                                    <span className={getNavUnderlineClass(item.id)}></span>
                                </a>
                            ))}
                        </nav>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-4">
                        {auth.user ? (
                            <>
                                {variant !== 'dashboard' && (
                                    <Link href={getDashboardUrl()} className="font-medium text-slate-600 transition-colors hover:text-emerald-600">
                                        Dashboard
                                    </Link>
                                )}
                                <div className="flex items-center space-x-2 rounded-lg bg-emerald-50 px-3 py-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600">
                                        <span className="text-sm font-medium text-white">{auth.user.name?.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <span className="text-sm font-medium text-emerald-800">{auth.user.name}</span>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* <Link href={login()} className="font-medium text-slate-600 transition-colors hover:text-emerald-600">
                                    Patient Login
                                </Link> */}
                                {variant !== 'booking' && (
                                    <Link
                                        href="/appointments/book"
                                        className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-emerald-700"
                                    >
                                        Book Appointment
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
