import { SharedHeader } from '@/components/shared-header';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Brain, Calendar, Clock, Heart, Mail, MapPin, Phone, Shield, Users } from 'lucide-react';
import { useEffect } from 'react';

interface Resource {
    id: number;
    title: string;
    description: string;
    category: string;
    type: string;
}

interface Props extends SharedData {
    resources: Resource[];
}

export default function PsychiatryWelcome() {
    const { auth, resources } = usePage<Props>().props;

    useEffect(() => {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                    entry.target.classList.remove('opacity-0', 'translate-y-8');
                }
            });
        }, observerOptions);

        // Observe all elements with scroll-reveal class
        const elements = document.querySelectorAll('.scroll-reveal');
        elements.forEach((el) => observer.observe(el));

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <>
            <Head title="Dr. Lola Akinola - Psychiatric Mental Health Nurse Practitioner | Omolola Akinola Psychiatry PLLC">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
                <meta
                    name="description"
                    content="Dr. Lola Akinola, DNP, PMHNP-BC - 16+ years experience in psychiatric mental health care. Specializing in ADHD, anxiety, depression, PTSD, and medication management. Telehealth available nationwide."
                />
                <meta
                    name="keywords"
                    content="Dr. Lola Akinola, psychiatrist, psychiatric nurse practitioner, PMHNP-BC, mental health, ADHD treatment, anxiety therapy, depression treatment, PTSD care, telehealth psychiatry, medication management, psychiatric evaluation"
                />
                <meta name="author" content="Dr. Omolola Akinola" />
                <meta property="og:title" content="Dr. Lola Akinola - Psychiatric Mental Health Nurse Practitioner" />
                <meta
                    property="og:description"
                    content="16+ years experience in psychiatric mental health care. Specializing in ADHD, anxiety, depression, PTSD, and medication management. Telehealth available."
                />
                <meta property="og:image" content="/logo.png" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Dr. Lola Akinola - Psychiatric Mental Health Nurse Practitioner" />
                <meta
                    name="twitter:description"
                    content="16+ years experience in psychiatric mental health care. Specializing in ADHD, anxiety, depression, PTSD, and medication management."
                />
                <meta name="twitter:image" content="/logo.png" />
                <style>
                    {`
                        html {
                            scroll-behavior: smooth;
                        }
                    `}
                </style>
            </Head>

            <div className="min-h-screen bg-slate-50">
                {/* Shared Header */}
                <SharedHeader variant="welcome" />

                {/* Hero Section with Background Image + Gradient Overlay */}
                <section id="home" className="relative overflow-hidden text-white">
                    {/* Background Image Layer */}
                    <div className="absolute inset-0">
                        <img
                            src="img/hero/hero.png"
                            alt="Abstract calming background"
                            className="h-full w-full object-cover object-center"
                            loading="eager"
                            fetchPriority="high"
                        />
                        {/* Gradient Overlay for readability */}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/85 via-emerald-800/80 to-green-900/70 backdrop-blur-[1px]"></div>
                        {/* Subtle texture overlay (optional) */}
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent_60%)]"></div>
                    </div>

                    {/* Animated Decorative Elements (kept, toned down opacity) */}
                    <div className="pointer-events-none absolute inset-0 opacity-15">
                        <div className="absolute top-10 left-10 h-20 w-20 animate-pulse rounded-full bg-white/60"></div>
                        <div
                            className="absolute top-40 right-20 h-16 w-16 animate-bounce rounded-full bg-white/50"
                            style={{ animationDelay: '1s' }}
                        ></div>
                        <div
                            className="absolute bottom-20 left-1/4 h-12 w-12 animate-pulse rounded-full bg-white/50"
                            style={{ animationDelay: '2s' }}
                        ></div>
                        <div
                            className="absolute right-1/3 bottom-40 h-8 w-8 animate-bounce rounded-full bg-white/40"
                            style={{ animationDelay: '3s' }}
                        ></div>
                    </div>

                    <div className="relative z-10 mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                            <div className="animate-slide-in-left">
                                <h1 className="animate-fade-in-up mb-6 text-4xl leading-tight font-bold md:text-5xl">
                                    Compassionate Mental Health Care
                                </h1>
                                <h2 className="animate-fade-in-up mb-4 text-2xl font-semibold text-emerald-100" style={{ animationDelay: '0.1s' }}>
                                    Dr. Lola Akinola, DNP, PMHNP-BC
                                </h2>
                                <p className="animate-fade-in-up mb-8 text-xl text-emerald-100" style={{ animationDelay: '0.2s' }}>
                                    With over 16 years of experience in mental health, I provide personalized psychiatric care through evidence-based
                                    treatments. I understand seeking help can feel daunting, and I'm here to support you every step of the way.
                                </p>
                                <div className="animate-fade-in-up flex flex-col gap-4 sm:flex-row" style={{ animationDelay: '0.4s' }}>
                                    <Link
                                        href="/appointments/book"
                                        className="group inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-medium text-emerald-700 transition-all duration-300 hover:scale-105 hover:bg-emerald-50 hover:shadow-lg"
                                    >
                                        <Calendar className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                                        Book Consultation
                                    </Link>
                                    <a
                                        href="tel:347-472-1758"
                                        className="group inline-flex items-center justify-center rounded-lg border border-white px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-emerald-700"
                                    >
                                        <Phone className="mr-2 h-5 w-5" />
                                        Call (347) 472-1758
                                    </a>
                                </div>
                            </div>
                            <div className="animate-slide-in-right relative">
                                <div className="rounded-2xl bg-white/10 p-8 ring-1 ring-white/15 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:bg-white/15">
                                    <div className="text-center">
                                        <Heart className="animate-pulse-gentle mx-auto mb-4 h-16 w-16 text-emerald-100 drop-shadow" />
                                        <h3 className="mb-2 text-xl font-semibold">16+ Years Experience</h3>
                                        <p className="text-emerald-100">
                                            Helping individuals navigate life's challenges with empathy, respect, and collaboration
                                        </p>
                                        <div className="mt-4 text-sm text-emerald-200">
                                            <p>✓ Licensed in New York</p>
                                            <p>✓ HIPAA Compliant</p>
                                            <p>✓ Telehealth Available</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Enhanced Services Section with Scroll Animations */}
                <section id="services" className="bg-white py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="scroll-reveal mb-16 translate-y-8 text-center opacity-0 transition-all duration-700">
                            <h2 className="mb-4 text-3xl font-bold text-slate-800 md:text-4xl">Our Services</h2>
                            <p className="mx-auto max-w-3xl text-xl text-slate-600">
                                Comprehensive psychiatric care tailored to your individual needs
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {[
                                {
                                    title: 'Initial Psychiatric Evaluation',
                                    description:
                                        'Comprehensive 90-minute assessment to understand your unique situation and develop a personalized treatment plan.',
                                    icon: Users,
                                    duration: '90 minutes',
                                    price: '$275',
                                },
                                {
                                    title: 'Medication Management',
                                    description:
                                        'Expert psychiatric medication evaluation, monitoring, and adjustment to optimize your treatment outcomes.',
                                    icon: Heart,
                                    duration: '30-45 minutes',
                                    price: '$175',
                                },
                                {
                                    title: 'ADHD Treatment',
                                    description:
                                        'Specialized care for Attention Deficit Hyperactivity Disorder with evidence-based treatment approaches.',
                                    icon: Brain,
                                    duration: '45 minutes',
                                    price: '$175',
                                },
                                {
                                    title: 'Anxiety & Depression Care',
                                    description: 'Compassionate treatment for mood disorders using culturally sensitive, person-centered approaches.',
                                    icon: Heart,
                                    duration: '45 minutes',
                                    price: '$175',
                                },
                                {
                                    title: 'Trauma & PTSD Support',
                                    description: 'Specialized trauma-informed care for Post-Traumatic Stress Disorder and related conditions.',
                                    icon: Shield,
                                    duration: '45 minutes',
                                    price: '$175',
                                },
                                {
                                    title: 'Perinatal Mental Health',
                                    description: 'Specialized care for pregnancy, prenatal, and postpartum mental health concerns.',
                                    icon: Heart,
                                    duration: '45 minutes',
                                    price: '$175',
                                },
                            ].map((service, index) => (
                                <div
                                    key={index}
                                    className="scroll-reveal group translate-y-8 rounded-xl bg-slate-50 p-6 opacity-0 transition-all duration-500 hover:scale-105 hover:bg-white hover:shadow-xl"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <service.icon className="mb-4 h-12 w-12 text-emerald-600 transition-all duration-300 group-hover:scale-110 group-hover:text-emerald-700" />
                                    <h3 className="mb-3 text-xl font-semibold text-slate-800 transition-colors group-hover:text-emerald-800">
                                        {service.title}
                                    </h3>
                                    <p className="mb-4 text-slate-600">{service.description}</p>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center text-slate-500 transition-colors group-hover:text-emerald-600">
                                            <Clock className="mr-1 h-4 w-4" />
                                            {service.duration}
                                        </div>
                                        <div className="font-semibold text-emerald-600">{service.price}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="providers" className="bg-slate-50 py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-slate-800 md:text-4xl">About Dr. Akinola</h2>
                            <p className="mx-auto max-w-3xl text-xl text-slate-600">
                                Experienced Psychiatric Mental Health Nurse Practitioner committed to your wellness journey
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                            <div className="rounded-xl bg-white p-8 shadow-sm">
                                <div className="flex items-start space-x-4">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-2xl font-bold text-white">
                                        LA
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="mb-1 text-xl font-semibold text-slate-800">Dr. Lola Akinola</h3>
                                        <p className="mb-2 font-medium text-emerald-600">Psychiatric Mental Health Nurse Practitioner</p>
                                        <p className="mb-3 text-sm text-slate-600">DNP, PMHNP-BC, ARNP</p>
                                        <div className="mb-4 flex items-center text-sm text-slate-500">
                                            <span>16+ years experience • Licensed in New York</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="mb-4 text-slate-600">
                                    I'm a Psychiatric Nurse Practitioner with over 16 years of experience in the mental health field. Throughout my
                                    career, I've had the privilege of working with individuals from diverse backgrounds, helping them navigate some of
                                    the most challenging times in their lives.
                                </p>

                                <div>
                                    <h4 className="mb-2 font-medium text-slate-800">Areas of Expertise:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            'ADHD',
                                            'Anxiety',
                                            'Depression',
                                            'Bipolar Disorder',
                                            'PTSD',
                                            'Trauma',
                                            'Medication Management',
                                            'Mood Disorders',
                                        ].map((specialty, idx) => (
                                            <span key={idx} className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-800">
                                                {specialty}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl bg-white p-8 shadow-sm">
                                <h3 className="mb-4 text-xl font-semibold text-slate-800">Education & Credentials</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="font-medium text-slate-800">Doctor of Nursing Practice (DNP)</p>
                                        <p className="text-sm text-slate-600">Chamberlain University</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800">Psychiatric Mental Health Nurse Practitioner</p>
                                        <p className="text-sm text-slate-600">Stony Brook University</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800">Bachelor of Nursing</p>
                                        <p className="text-sm text-slate-600">Adelphi University</p>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h4 className="mb-2 font-medium text-slate-800">Treatment Approach:</h4>
                                    <ul className="space-y-1 text-sm text-slate-600">
                                        <li>• Culturally Sensitive Care</li>
                                        <li>• Person-Centered Treatment</li>
                                        <li>• Evidence-Based Practice</li>
                                        <li>• Interpersonal Therapy</li>
                                        <li>• Motivational Interviewing</li>
                                    </ul>
                                </div>

                                <div className="mt-6 rounded-lg bg-emerald-50 p-4">
                                    <p className="text-sm text-emerald-800">
                                        <strong>
                                            "You can expect a warm, welcoming, and confidential atmosphere where you will feel comfortable sharing at
                                            your own pace."
                                        </strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Resources Section */}
                <section id="resources" className="bg-white py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-slate-800 md:text-4xl">Patient Resources</h2>
                            <p className="mx-auto max-w-3xl text-xl text-slate-600">
                                Educational materials and resources to support your mental health journey
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {resources.length > 0 ? (
                                resources.map((resource) => (
                                    <Link
                                        key={resource.id}
                                        href={`/resources/${resource.id}`}
                                        className="group cursor-pointer rounded-xl bg-slate-50 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
                                                {resource.category}
                                            </span>
                                            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                                                {resource.type}
                                            </span>
                                        </div>
                                        <h3 className="mb-3 text-xl font-semibold text-slate-800 group-hover:text-emerald-700">{resource.title}</h3>
                                        <p className="text-slate-600">{resource.description}</p>
                                        <div className="mt-4 flex items-center text-sm font-medium text-emerald-600 group-hover:text-emerald-700">
                                            Read more →
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-full py-12 text-center">
                                    <div className="mx-auto mb-4 h-12 w-12 text-slate-400">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="mb-2 text-lg font-medium text-slate-900">No resources available</h3>
                                    <p className="text-slate-600">Check back later for helpful mental health resources.</p>
                                </div>
                            )}
                        </div>

                        {resources.length > 0 && (
                            <div className="mt-12 text-center">
                                <Link
                                    href="/resources"
                                    className="inline-flex items-center rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-700"
                                >
                                    View All Resources
                                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="bg-slate-50 py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-slate-800 md:text-4xl">Contact Dr. Akinola</h2>
                            <p className="mx-auto max-w-3xl text-xl text-slate-600">
                                Ready to take the first step? I'm here to help and answer any questions you may have.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                            <div>
                                <h3 className="mb-6 text-2xl font-semibold text-slate-800">Get In Touch</h3>

                                <div className="space-y-6">
                                    <div className="flex items-center space-x-4">
                                        <Phone className="h-6 w-6 text-emerald-600" />
                                        <div>
                                            <p className="font-medium text-slate-800">Phone</p>
                                            <a href="tel:347-472-1758" className="text-slate-600 transition-colors hover:text-emerald-600">
                                                (347) 472-1758
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <Mail className="h-6 w-6 text-emerald-600" />
                                        <div>
                                            <p className="font-medium text-slate-800">Email</p>
                                            <p className="text-slate-600">Available through patient portal</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <MapPin className="h-6 w-6 text-emerald-600" />
                                        <div>
                                            <p className="font-medium text-slate-800">Location</p>
                                            <p className="text-slate-600">
                                                New York, NY 10013
                                                <br />
                                                <span className="font-medium text-emerald-600">Telehealth Available</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <Clock className="h-6 w-6 text-emerald-600" />
                                        <div>
                                            <p className="font-medium text-slate-800">Insurance & Payment</p>
                                            <p className="text-slate-600">
                                                Most major insurance plans accepted
                                                <br />
                                                Self-pay options available
                                                <br />
                                                Superbills provided for out-of-network
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 space-y-4">
                                    <Link
                                        href="/appointments/book"
                                        className="inline-flex items-center rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-700"
                                    >
                                        <Calendar className="mr-2 h-5 w-5" />
                                        Schedule Appointment
                                    </Link>
                                    <div className="flex items-center space-x-4">
                                        <a
                                            href="tel:347-472-1758"
                                            className="inline-flex items-center rounded-lg border border-emerald-600 px-6 py-3 font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
                                        >
                                            <Phone className="mr-2 h-5 w-5" />
                                            Call Now
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl bg-white p-8 shadow-sm">
                                <h3 className="mb-6 text-xl font-semibold text-slate-800">What to Expect</h3>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="mb-2 font-medium text-slate-800">Initial Consultation - $275</h4>
                                        <p className="text-sm text-slate-600">
                                            Comprehensive 90-minute evaluation to understand your unique situation and develop a personalized
                                            treatment plan tailored to your needs.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="mb-2 font-medium text-slate-800">Follow-up Sessions - $175</h4>
                                        <p className="text-sm text-slate-600">
                                            Regular 30-45 minute sessions for medication management, progress monitoring, and treatment plan
                                            adjustments.
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-emerald-50 p-4">
                                        <h4 className="mb-2 font-medium text-emerald-800">Accepted Insurance Plans:</h4>
                                        <div className="grid grid-cols-2 gap-2 text-xs text-emerald-700">
                                            <p>• Aetna</p>
                                            <p>• Anthem</p>
                                            <p>• Blue Cross</p>
                                            <p>• Cigna</p>
                                            <p>• Empire BCBS</p>
                                            <p>• Oscar Health</p>
                                            <p>• Oxford</p>
                                            <p>• Many others</p>
                                        </div>
                                    </div>

                                    <div className="rounded-lg bg-slate-50 p-4">
                                        <h4 className="mb-2 font-medium text-slate-800">Payment Methods:</h4>
                                        <p className="text-sm text-slate-600">Cash, Check, Credit Cards, PayPal, Zelle, Apple Cash</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-emerald-900 text-white">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                            <div className="md:col-span-2">
                                <div className="mb-4 flex items-center space-x-2">
                                    <Heart className="h-8 w-8 text-emerald-400" />
                                    <span className="text-xl font-semibold">Dr. Lola Akinola</span>
                                </div>
                                <p className="mb-4 text-emerald-100">
                                    Providing compassionate, culturally sensitive psychiatric mental health care with over 16 years of experience.
                                    Licensed Psychiatric Mental Health Nurse Practitioner in New York.
                                </p>
                                <p className="text-sm text-emerald-200">Licensed in New York (#403160). Telehealth services available.</p>
                            </div>

                            <div>
                                <h4 className="mb-4 font-semibold">Services</h4>
                                <ul className="space-y-2 text-emerald-100">
                                    <li>
                                        <a href="#services" className="transition-colors hover:text-emerald-400">
                                            Initial Evaluation
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#services" className="transition-colors hover:text-emerald-400">
                                            Medication Management
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#services" className="transition-colors hover:text-emerald-400">
                                            ADHD Treatment
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#contact" className="transition-colors hover:text-emerald-400">
                                            Telehealth
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="mb-4 font-semibold">Emergency Resources</h4>
                                <p className="mb-2 text-sm text-emerald-100">If you are experiencing a mental health emergency:</p>
                                <p className="font-medium text-emerald-400">911</p>
                                <p className="font-medium text-emerald-400">988 (Suicide & Crisis Lifeline)</p>
                                <p className="mt-2 text-sm text-emerald-100">
                                    For non-emergency support:
                                    <br />
                                    <a href="tel:347-472-1758" className="font-medium text-emerald-400 hover:text-emerald-300">
                                        (347) 472-1758
                                    </a>
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-emerald-800 pt-8 text-center text-emerald-200">
                            <p>&copy; 2025 Dr. Lola Akinola, DNP, PMHNP-BC. All rights reserved. | Privacy Policy | Terms of Service</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
