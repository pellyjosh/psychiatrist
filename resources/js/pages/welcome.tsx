import { SharedHeader } from '@/components/shared-header';
import { type SharedData } from '@/types';
import { CONTACT_PHONE_FORMATTED, getYearsOfExperienceFormatted } from '@/utils/license-utils';
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
                    content={`Dr. Lola Akinola, DNP, PMHNP-BC - ${getYearsOfExperienceFormatted()} experience in psychiatric mental health care. Specializing in ADHD, anxiety, depression, PTSD, and medication management. Telehealth available nationwide.`}
                />
                <meta
                    name="keywords"
                    content="Dr. Lola Akinola, psychiatrist, psychiatric nurse practitioner, PMHNP-BC, mental health, ADHD treatment, anxiety therapy, depression treatment, PTSD care, telehealth psychiatry, medication management, psychiatric evaluation"
                />
                <meta name="author" content="Dr. Omolola Akinola" />
                <meta property="og:title" content="Dr. Lola Akinola - Psychiatric Mental Health Nurse Practitioner" />
                <meta
                    property="og:description"
                    content={`${getYearsOfExperienceFormatted()} experience in psychiatric mental health care. Specializing in ADHD, anxiety, depression, PTSD, and medication management. Telehealth available.`}
                />
                <meta property="og:image" content="/logo.png" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Dr. Lola Akinola - Psychiatric Mental Health Nurse Practitioner" />
                <meta
                    name="twitter:description"
                    content={`${getYearsOfExperienceFormatted()} experience in psychiatric mental health care. Specializing in ADHD, anxiety, depression, PTSD, and medication management.`}
                />
                <meta name="twitter:image" content="/logo.png" />
                <style>
                    {`
                        html {
                            scroll-behavior: smooth;
                        }
                        
                        @keyframes slide {
                            0% {
                                transform: translateX(0);
                            }
                            100% {
                                transform: translateX(-100%);
                            }
                        }
                        
                        .animate-slide {
                            animation: slide 20s linear infinite;
                        }
                        
                        .animate-slide:hover {
                            animation-play-state: paused;
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
                                    Your mental health journey begins with understanding, compassion, and personalized care. Let's work together
                                    toward your wellness goals.
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
                                        href={`tel:${CONTACT_PHONE_FORMATTED.replace(/[^0-9]/g, '')}`}
                                        className="group inline-flex items-center justify-center rounded-lg border border-white px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-emerald-700"
                                    >
                                        <Phone className="mr-2 h-5 w-5" />
                                        Call {CONTACT_PHONE_FORMATTED}
                                    </a>
                                </div>
                            </div>
                            <div className="animate-slide-in-right relative">
                                <div className="rounded-2xl bg-white/10 p-8 ring-1 ring-white/15 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:bg-white/15">
                                    <div className="text-center">
                                        <Heart className="animate-pulse-gentle mx-auto mb-4 h-16 w-16 text-emerald-100 drop-shadow" />
                                        <h3 className="mb-2 text-xl font-semibold">
                                            {getYearsOfExperienceFormatted().charAt(0).toUpperCase() + getYearsOfExperienceFormatted().slice(1)}{' '}
                                            Experience
                                        </h3>
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
                                },
                                {
                                    title: 'Medication Management',
                                    description:
                                        'Expert psychiatric medication evaluation, monitoring, and adjustment to optimize your treatment outcomes.',
                                    icon: Heart,
                                    duration: '30-45 minutes',
                                },
                                {
                                    title: 'ADHD Treatment',
                                    description:
                                        'Specialized care for Attention Deficit Hyperactivity Disorder with evidence-based treatment approaches.',
                                    icon: Brain,
                                    duration: '45 minutes',
                                },
                                {
                                    title: 'Anxiety & Depression Care',
                                    description: 'Compassionate treatment for mood disorders using culturally sensitive, person-centered approaches.',
                                    icon: Heart,
                                    duration: '45 minutes',
                                },
                                {
                                    title: 'Trauma & PTSD Support',
                                    description: 'Specialized trauma-informed care for Post-Traumatic Stress Disorder and related conditions.',
                                    icon: Shield,
                                    duration: '45 minutes',
                                },
                                {
                                    title: 'Perinatal Mental Health',
                                    description: 'Specialized care for pregnancy, prenatal, and postpartum mental health concerns.',
                                    icon: Heart,
                                    duration: '45 minutes',
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
                                    {/* duration removed per request (Clock icon + timestamp) */}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="providers" className="bg-slate-50 py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-slate-800 md:text-4xl">About Dr. Lola</h2>
                            <p className="mx-auto max-w-3xl text-xl text-slate-600">
                                Get to know your dedicated mental health provider - experience, education, and commitment to your wellness
                            </p>
                        </div>

                        {/* Single Card Layout - Image on Left, Content on Right */}
                        <div className="mx-auto max-w-6xl">
                            <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
                                <div className="grid grid-cols-1 lg:grid-cols-5">
                                    {/* Left Side - Professional Photo with Text Overlay */}
                                    <div className="relative lg:col-span-2">
                                        <div className="h-full min-h-[400px]">
                                            <img
                                                src="/img/about/lola.jpg"
                                                alt="Dr. Lola Akinola, DNP, PMHNP-BC"
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    const target = e.currentTarget;
                                                    target.style.display = 'none';
                                                    const fallback = target.nextElementSibling;
                                                    if (fallback) fallback.classList.remove('hidden');
                                                }}
                                            />
                                            <div className="flex hidden h-full w-full items-center justify-center bg-gradient-to-br from-emerald-400 to-emerald-600 text-6xl font-bold text-white">
                                                LA
                                            </div>
                                        </div>

                                        {/* Text Overlay at Bottom Left */}
                                        <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                                            <h3 className="mb-1 text-xl font-bold text-white">Dr. Lola Akinola</h3>
                                            <p className="mb-1 text-sm font-medium text-gray-200">Psychiatric Mental Health Nurse Practitioner</p>
                                            <p className="mb-2 text-xs text-gray-300">DNP, PMHNP-BC, APNP</p>
                                            <div className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                                                {getYearsOfExperienceFormatted()} experience • Licensed in New York
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side - Content */}
                                    <div className="p-6 lg:col-span-3 lg:p-8">
                                        <div className="h-full">
                                            <p className="mb-3 text-sm leading-relaxed text-slate-600">
                                                With over {getYearsOfExperienceFormatted()} of experience in mental health, I provide personalized
                                                psychiatric care through evidence-based treatments. I understand seeking help can feel daunting, and
                                                I'm here to support you every step of the way.
                                            </p>

                                            <p className="mb-4 text-sm leading-relaxed text-slate-600">
                                                I'm a Psychiatric Nurse Practitioner who has had the privilege of working with individuals from
                                                diverse backgrounds, helping them navigate some of the most challenging times in their lives.
                                            </p>

                                            {/* Areas of Expertise */}
                                            <div className="mb-4">
                                                <h4 className="mb-3 text-base font-semibold text-slate-800">Areas of Expertise</h4>
                                                <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
                                                    {[
                                                        'Solution Focused Therapy (SFT)',
                                                        'Mindfulness Based Therapies',
                                                        'Supportive Therapy',
                                                        'Generalized Anxiety',
                                                        'Panic',
                                                        'Phobias',
                                                        'Depression',
                                                        'Perinatal Mood and Anxiety Disorders',
                                                        'PTSD',
                                                        'ADHD',
                                                        'OCD',
                                                        'Substance & Alcohol Abuse',
                                                        'Abuse (sexual, emotional, physical)',
                                                        'Relationship Issues',
                                                        'Eating Disorders',
                                                        'Autism Spectrum Disorders',
                                                        'Bipolar Spectrum Disorders',
                                                        'Personality Disorders',
                                                        'Grief',
                                                        'Trauma',
                                                    ].map((specialty, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="rounded-md border border-emerald-100 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700"
                                                        >
                                                            {specialty}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Education & Quote Row */}
                                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                                {/* Education & Credentials */}
                                                <div>
                                                    <h4 className="mb-2 text-base font-semibold text-slate-800">Education & Credentials</h4>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center">
                                                            <div className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                                            <div className="text-xs">
                                                                <span className="font-medium text-slate-800">DNP (Doctor of Nursing Practice)</span>
                                                                <span className="text-slate-600"> - Chamberlain University</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <div className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                                            <div className="text-xs">
                                                                <span className="font-medium text-slate-800">
                                                                    PMHNP (Psychiatric Mental Health Nurse Practitioner)
                                                                </span>
                                                                <span className="text-slate-600"> - Stony Brook University</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <div className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                                            <div className="text-xs">
                                                                <span className="font-medium text-slate-800">
                                                                    BSN (Bachelor of Science in Nursing)
                                                                </span>
                                                                <span className="text-slate-600"> - Adelphi University</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Quote */}
                                                <div className="rounded-lg border-l-4 border-emerald-500 bg-emerald-50 p-3">
                                                    <p className="text-xs font-medium text-emerald-800 italic">
                                                        "You can expect a warm, welcoming, and confidential atmosphere where you will feel comfortable
                                                        sharing at your own pace."
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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

                {/* Insurance Section */}
                <section id="insurance" className="bg-white py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-slate-800 md:text-4xl">Insurance We Accept</h2>
                            <p className="mx-auto max-w-3xl text-xl text-slate-600">
                                We accept most major insurance providers. If you have specific questions regarding your coverage, please contact us
                                for additional information.
                            </p>
                        </div>

                        {/* Insurance Logos Carousel */}
                        <div className="relative overflow-hidden">
                            <div className="animate-slide flex space-x-8 lg:space-x-12">
                                {/* First set of logos */}
                                <div className="flex flex-shrink-0 items-center justify-center space-x-8 lg:space-x-12">
                                    <img
                                        src="/img/insurance/aetna.webp"
                                        alt="Aetna"
                                        className="h-16 w-auto object-contain transition-transform hover:scale-105"
                                    />
                                    <img
                                        src="/img/insurance/bluecross_blueshield.webp"
                                        alt="BlueCross BlueShield"
                                        className="h-16 w-auto object-contain transition-transform hover:scale-105"
                                    />
                                    {/* <img
                                        src="/img/insurance/tricare.webp"
                                        alt="TRICARE"
                                        className="h-16 w-auto object-contain transition-transform hover:scale-105"
                                    /> */}
                                    {/* <img
                                        src="/img/insurance/medicare.webp"
                                        alt="Medicare"
                                        className="h-16 w-auto object-contain transition-transform hover:scale-105"
                                    /> */}
                                    <img
                                        src="/img/insurance/oxford_health_plan.webp"
                                        alt="Oxford Health Plans"
                                        className="h-16 w-auto object-contain transition-transform hover:scale-105"
                                    />
                                </div>

                                {/* Second set of logos */}
                                <div className="flex flex-shrink-0 items-center justify-center space-x-8 lg:space-x-12">
                                    <img
                                        src="/img/insurance/optum.webp"
                                        alt="Optum"
                                        className="h-16 w-auto object-contain transition-transform hover:scale-105"
                                    />
                                    <img
                                        src="/img/insurance/carefirst.webp"
                                        alt="CareFirst"
                                        className="h-16 w-auto object-contain transition-transform hover:scale-105"
                                    />
                                    <img
                                        src="/img/insurance/anthem.webp"
                                        alt="Anthem"
                                        className="h-16 w-auto object-contain transition-transform hover:scale-105"
                                    />
                                    <img
                                        src="/img/insurance/unitedhealthcare.webp"
                                        alt="UnitedHealthcare"
                                        className="h-16 w-auto object-contain transition-transform hover:scale-105"
                                    />
                                    <img
                                        src="/img/insurance/humana.webp"
                                        alt="Humana"
                                        className="h-16 w-auto object-contain transition-transform hover:scale-105"
                                    />
                                </div>

                                {/* Third set of logos */}
                                <div className="flex flex-shrink-0 items-center justify-center space-x-8 lg:space-x-12">
                                    <img
                                        src="/img/insurance/cigna.webp"
                                        alt="Cigna"
                                        className="h-16 w-auto object-contain transition-transform hover:scale-105"
                                    />
                                    <img
                                        src="/img/insurance/medicare_gov.webp"
                                        alt="Medicare.gov"
                                        className="h-16 w-auto object-contain transition-transform hover:scale-105"
                                    />
                                    <img
                                        src="/img/insurance/oscar.webp"
                                        alt="Oscar"
                                        className="h-16 w-auto object-contain transition-transform hover:scale-105"
                                    />
                                    <img
                                        src="/img/insurance/aetna.webp"
                                        alt="Aetna"
                                        className="h-16 w-auto object-contain transition-transform hover:scale-105"
                                    />
                                    <img
                                        src="/img/insurance/bluecross_blueshield.webp"
                                        alt="BlueCross BlueShield"
                                        className="h-16 w-auto object-contain transition-transform hover:scale-105"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 text-center">
                            <p className="text-lg text-slate-600">
                                Don't see your insurance provider? Contact us to verify coverage and discuss payment options.
                            </p>
                            <div className="mt-6">
                                <a
                                    href={`tel:${CONTACT_PHONE_FORMATTED.replace(/[^0-9]/g, '')}`}
                                    className="inline-flex items-center rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-700"
                                >
                                    <Phone className="mr-2 h-5 w-5" />
                                    Call to Verify Coverage
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="bg-slate-50 py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-slate-800 md:text-4xl">Contact Dr. Lola</h2>
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
                                            <a
                                                href={`tel:${CONTACT_PHONE_FORMATTED.replace(/[^0-9]/g, '')}`}
                                                className="text-slate-600 transition-colors hover:text-emerald-600"
                                            >
                                                {CONTACT_PHONE_FORMATTED}
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
                                            href={`tel:${CONTACT_PHONE_FORMATTED.replace(/[^0-9]/g, '')}`}
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
                                            Comprehensive evaluation to understand your unique situation and develop a personalized treatment plan
                                            tailored to your needs.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="mb-2 font-medium text-slate-800">Follow-up Sessions - $175</h4>
                                        <p className="text-sm text-slate-600">
                                            Regular sessions for medication management, progress monitoring, and treatment plan adjustments.
                                        </p>
                                    </div>

                                    <p className="mt-2 text-xs text-slate-500 italic">
                                        Note: Listed prices are for self-pay clients and may differ for insurance-covered services.
                                    </p>

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
                                    Providing compassionate, culturally sensitive psychiatric mental health care with over{' '}
                                    {getYearsOfExperienceFormatted()} of experience. Licensed Psychiatric Mental Health Nurse Practitioner in New
                                    York.
                                </p>
                                <p className="text-sm text-emerald-200">Licensed in New York. Telehealth services available.</p>
                            </div>

                            {/* Services column intentionally removed from footer per request */}

                            <div>
                                <h4 className="mb-4 font-semibold">Emergency Resources</h4>
                                <p className="mb-2 text-sm text-emerald-100">If you are experiencing a mental health emergency:</p>
                                <p className="font-medium text-emerald-400">911</p>
                                <p className="font-medium text-emerald-400">
                                    Additional crisis support within the US: call National Suicide Prevention Lifeline (1-800-273-8255); text Home to
                                    741741; go to the closest emergency room; or call 911.
                                </p>
                                <p className="mt-2 text-sm text-emerald-100">
                                    For non-emergency support:
                                    <br />
                                    <a
                                        href={`tel:${CONTACT_PHONE_FORMATTED.replace(/[^0-9]/g, '')}`}
                                        className="font-medium text-emerald-400 hover:text-emerald-300"
                                    >
                                        {CONTACT_PHONE_FORMATTED}
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
