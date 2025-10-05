import { SharedHeader } from '@/components/shared-header';
import { Head, Link } from '@inertiajs/react';
import { Brain, Clock, Download, ExternalLink, Filter, Heart, Mail, Phone, Search, Shield, Users } from 'lucide-react';
import { useState } from 'react';

export default function Resources() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { id: 'all', name: 'All Resources', icon: Brain },
        { id: 'educational', name: 'Educational', icon: Brain },
        { id: 'self-help', name: 'Self-Help', icon: Heart },
        { id: 'treatment', name: 'Treatment Info', icon: Shield },
        { id: 'emergency', name: 'Emergency', icon: Phone },
        { id: 'administrative', name: 'Administrative', icon: Users },
    ];

    const resources = [
        {
            id: 1,
            title: 'Understanding Depression: Signs, Symptoms, and Treatment',
            description: 'Comprehensive guide to recognizing depression and understanding treatment options available.',
            category: 'educational',
            type: 'PDF Guide',
            downloadUrl: '#',
            readTime: '15 min read',
            tags: ['Depression', 'Mental Health', 'Treatment'],
        },
        {
            id: 2,
            title: 'Managing Anxiety in Daily Life',
            description: 'Practical strategies and techniques for managing anxiety symptoms and improving daily functioning.',
            category: 'self-help',
            type: 'Interactive Guide',
            downloadUrl: '#',
            readTime: '20 min read',
            tags: ['Anxiety', 'Coping Skills', 'Self-Help'],
        },
        {
            id: 3,
            title: 'Psychiatric Medications: What to Expect',
            description: 'Important information about psychiatric medications, side effects, and what to expect during treatment.',
            category: 'treatment',
            type: 'PDF Guide',
            downloadUrl: '#',
            readTime: '12 min read',
            tags: ['Medications', 'Side Effects', 'Treatment'],
        },
        {
            id: 4,
            title: 'Crisis Resources and Emergency Contacts',
            description: '24/7 crisis support contacts and emergency mental health resources for immediate help.',
            category: 'emergency',
            type: 'Quick Reference',
            downloadUrl: '#',
            readTime: '5 min read',
            tags: ['Crisis', 'Emergency', 'Support'],
        },
        {
            id: 5,
            title: 'Insurance and Billing Information',
            description: 'Detailed information about accepted insurance plans, billing procedures, and payment options.',
            category: 'administrative',
            type: 'PDF Guide',
            downloadUrl: '#',
            readTime: '8 min read',
            tags: ['Insurance', 'Billing', 'Payment'],
        },
        {
            id: 6,
            title: 'Preparing for Your First Psychiatric Appointment',
            description: 'A comprehensive guide on what to expect during your first visit and how to prepare.',
            category: 'educational',
            type: 'Checklist',
            downloadUrl: '#',
            readTime: '10 min read',
            tags: ['First Visit', 'Preparation', 'Expectations'],
        },
        {
            id: 7,
            title: 'Mindfulness and Meditation Techniques',
            description: 'Evidence-based mindfulness practices and meditation techniques for mental wellness.',
            category: 'self-help',
            type: 'Audio Guide',
            downloadUrl: '#',
            readTime: '25 min practice',
            tags: ['Mindfulness', 'Meditation', 'Wellness'],
        },
        {
            id: 8,
            title: 'Understanding ADHD in Adults',
            description: 'Comprehensive information about adult ADHD symptoms, diagnosis, and treatment options.',
            category: 'educational',
            type: 'PDF Guide',
            downloadUrl: '#',
            readTime: '18 min read',
            tags: ['ADHD', 'Adults', 'Diagnosis'],
        },
        {
            id: 9,
            title: 'Sleep Hygiene for Mental Health',
            description: 'Essential sleep practices that support mental health and overall well-being.',
            category: 'self-help',
            type: 'Interactive Guide',
            downloadUrl: '#',
            readTime: '12 min read',
            tags: ['Sleep', 'Hygiene', 'Mental Health'],
        },
        {
            id: 10,
            title: 'Family Support Guide',
            description: 'Resources and guidance for family members supporting a loved one with mental health challenges.',
            category: 'educational',
            type: 'PDF Guide',
            downloadUrl: '#',
            readTime: '16 min read',
            tags: ['Family', 'Support', 'Caregiving'],
        },
    ];

    const emergencyContacts = [
        {
            name: 'National Suicide Prevention Lifeline',
            number: '988',
            description: '24/7 crisis support and suicide prevention',
        },
        {
            name: 'Crisis Text Line',
            number: 'Text HOME to 741741',
            description: 'Free, 24/7 crisis support via text',
        },
        {
            name: 'SAMHSA National Helpline',
            number: '1-800-662-4357',
            description: 'Treatment referral and information service',
        },
        {
            name: 'Emergency Services',
            number: '911',
            description: 'For immediate medical emergencies',
        },
    ];

    const filteredResources = resources.filter((resource) => {
        const matchesSearch =
            resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <>
            <Head title="Patient Resources - Psychiatry PLLC">
                <meta
                    name="description"
                    content="Educational materials, self-help resources, and support information for mental health and psychiatric care."
                />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
                <SharedHeader />

                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="mb-12 text-center">
                        <h1 className="mb-4 text-3xl font-bold text-green-800 md:text-4xl">Patient Resources & Education</h1>
                        <p className="mx-auto max-w-3xl text-xl text-slate-600">
                            Access educational materials, self-help resources, and important information to support your mental health journey.
                        </p>
                    </div>

                    {/* Emergency Alert */}
                    <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-6">
                        <div className="flex items-start space-x-3">
                            <Phone className="mt-1 h-6 w-6 text-red-600" />
                            <div>
                                <h3 className="mb-2 text-lg font-semibold text-red-800">Crisis Resources</h3>
                                <p className="mb-4 text-red-700">
                                    If you are experiencing a mental health emergency or having thoughts of self-harm, please reach out for immediate
                                    help:
                                </p>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {emergencyContacts.map((contact, index) => (
                                        <div key={index} className="rounded-lg bg-white p-4">
                                            <h4 className="font-semibold text-slate-800">{contact.name}</h4>
                                            <p className="text-lg font-bold text-red-600">{contact.number}</p>
                                            <p className="text-sm text-slate-600">{contact.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-4 md:flex-row">
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search resources..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-10 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Filter className="h-5 w-5 text-slate-400" />
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="rounded-lg border border-slate-300 px-4 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                                >
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Categories Grid */}
                    <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`rounded-lg border p-4 transition-all ${
                                    selectedCategory === category.id
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                                }`}
                            >
                                <category.icon className="mx-auto mb-2 h-6 w-6" />
                                <span className="block text-sm font-medium">{category.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Resources Grid */}
                    <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredResources.map((resource) => (
                            <div key={resource.id} className="rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md">
                                <div className="p-6">
                                    <div className="mb-3 flex items-start justify-between">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                resource.category === 'emergency'
                                                    ? 'bg-red-100 text-red-800'
                                                    : resource.category === 'self-help'
                                                      ? 'bg-green-100 text-green-800'
                                                      : resource.category === 'treatment'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : resource.category === 'administrative'
                                                          ? 'bg-gray-100 text-gray-800'
                                                          : 'bg-green-100 text-green-800'
                                            }`}
                                        >
                                            {categories.find((cat) => cat.id === resource.category)?.name}
                                        </span>
                                        <span className="text-xs text-slate-500">{resource.type}</span>
                                    </div>

                                    <h3 className="mb-3 text-lg font-semibold text-slate-800">{resource.title}</h3>
                                    <p className="mb-4 text-sm leading-relaxed text-slate-600">{resource.description}</p>

                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex items-center text-sm text-slate-500">
                                            <Clock className="mr-1 h-4 w-4" />
                                            {resource.readTime}
                                        </div>
                                    </div>

                                    <div className="mb-4 flex flex-wrap gap-2">
                                        {resource.tags.map((tag, index) => (
                                            <span key={index} className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex gap-2">
                                        <a
                                            href={resource.downloadUrl}
                                            className="flex flex-1 items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Download
                                        </a>
                                        <button className="rounded-lg border border-slate-300 px-3 py-2 transition-colors hover:bg-slate-50">
                                            <ExternalLink className="h-4 w-4 text-slate-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* No Results */}
                    {filteredResources.length === 0 && (
                        <div className="py-12 text-center">
                            <Brain className="mx-auto mb-4 h-16 w-16 text-slate-300" />
                            <h3 className="mb-2 text-lg font-semibold text-slate-600">No resources found</h3>
                            <p className="text-slate-500">Try adjusting your search terms or selected category.</p>
                        </div>
                    )}

                    {/* Additional Support Section */}
                    <div className="rounded-lg border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 text-center text-2xl font-bold text-green-800">Need Additional Support?</h2>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="rounded-lg bg-slate-50 p-6 text-center">
                                <Phone className="mx-auto mb-4 h-12 w-12 text-green-600" />
                                <h3 className="mb-2 text-lg font-semibold text-slate-800">Call Our Office</h3>
                                <p className="mb-4 text-slate-600">Speak with our team about your questions or concerns.</p>
                                <p className="font-semibold text-green-600">(555) 123-4567</p>
                            </div>

                            <div className="rounded-lg bg-slate-50 p-6 text-center">
                                <Mail className="mx-auto mb-4 h-12 w-12 text-green-600" />
                                <h3 className="mb-2 text-lg font-semibold text-slate-800">Email Us</h3>
                                <p className="mb-4 text-slate-600">Send us your questions via email and we'll respond promptly.</p>
                                <p className="font-semibold text-green-600">contact@psychiatrypllc.com</p>
                            </div>

                            <div className="rounded-lg bg-slate-50 p-6 text-center">
                                <Users className="mx-auto mb-4 h-12 w-12 text-purple-600" />
                                <h3 className="mb-2 text-lg font-semibold text-slate-800">Schedule Appointment</h3>
                                <p className="mb-4 text-slate-600">Book a consultation to discuss your mental health needs.</p>
                                <Link
                                    href="/appointments/book"
                                    className="inline-block rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700"
                                >
                                    Book Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
