import { SharedHeader } from '@/components/shared-header';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar, ExternalLink, Eye, FileText, Link as LinkIcon, Phone } from 'lucide-react';

interface Resource {
    id: number;
    title: string;
    description: string;
    type: 'article' | 'link' | 'emergency';
    category: string;
    content?: string;
    external_url?: string;
    file_path?: string;
    tags: string[];
    view_count: number;
    created_at: string;
    creator: {
        name: string;
    };
}

interface Props extends SharedData {
    resource: Resource;
}

const getTypeIcon = (type: string) => {
    switch (type) {
        case 'emergency':
            return Phone;
        case 'link':
            return LinkIcon;
        default:
            return FileText;
    }
};

const getTypeColor = (type: string) => {
    switch (type) {
        case 'emergency':
            return 'bg-red-100 text-red-800';
        case 'link':
            return 'bg-blue-100 text-blue-800';
        default:
            return 'bg-emerald-100 text-emerald-800';
    }
};

export default function ResourceShow() {
    const { resource, auth } = usePage<Props>().props;
    const TypeIcon = getTypeIcon(resource.type);

    const handleExternalLink = () => {
        if (resource.external_url) {
            window.open(resource.external_url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <>
            <Head title={`${resource.title} - Resources`} />

            <div className="min-h-screen bg-slate-50">
                <SharedHeader />

                <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Back button */}
                    <div className="mb-6">
                        <Link
                            href={auth.user?.role === 'admin' ? '/admin/resources' : '/user/resources'}
                            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-emerald-600"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Resources
                        </Link>
                    </div>

                    {/* Resource content */}
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        {/* Header */}
                        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="mb-2 flex items-center space-x-3">
                                        <span
                                            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getTypeColor(resource.type)}`}
                                        >
                                            <TypeIcon className="mr-1 h-4 w-4" />
                                            {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                                        </span>
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                                            {resource.category}
                                        </span>
                                    </div>
                                    <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{resource.title}</h1>
                                    <p className="mt-2 text-lg text-slate-600">{resource.description}</p>
                                </div>
                            </div>

                            {/* Meta information */}
                            <div className="mt-4 flex items-center space-x-6 text-sm text-slate-500">
                                <div className="flex items-center">
                                    <Eye className="mr-1 h-4 w-4" />
                                    {resource.view_count} views
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="mr-1 h-4 w-4" />
                                    {new Date(resource.created_at).toLocaleDateString()}
                                </div>
                                <div>By {resource.creator.name}</div>
                            </div>

                            {/* Tags */}
                            {resource.tags.length > 0 && (
                                <div className="mt-4">
                                    <div className="flex flex-wrap gap-2">
                                        {resource.tags.map((tag, index) => (
                                            <span key={index} className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="px-6 py-6">
                            {resource.type === 'link' && resource.external_url ? (
                                <div className="text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                                        <ExternalLink className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-medium text-slate-900">External Resource</h3>
                                    <p className="mb-4 text-slate-600">This resource links to an external website.</p>
                                    <button
                                        onClick={handleExternalLink}
                                        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                                    >
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Visit Resource
                                    </button>
                                </div>
                            ) : resource.type === 'emergency' ? (
                                <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6">
                                    <div className="mb-4 flex items-center">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                            <Phone className="h-6 w-6 text-red-600" />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-red-900">Emergency Information</h3>
                                            <p className="text-red-700">Important contacts and crisis resources</p>
                                        </div>
                                    </div>
                                    <div className="prose prose-red max-w-none">
                                        {resource.content ? (
                                            <div
                                                className="text-red-800"
                                                style={{ lineHeight: '1.7' }}
                                                dangerouslySetInnerHTML={{
                                                    __html: resource.content.replace(/\n/g, '<br>'),
                                                }}
                                            />
                                        ) : (
                                            <p className="text-red-700">No emergency information available.</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                // Article content
                                <div className="prose prose-slate max-w-none">
                                    {resource.content ? (
                                        <div
                                            className="text-slate-700"
                                            style={{ lineHeight: '1.7' }}
                                            dangerouslySetInnerHTML={{
                                                __html: resource.content.replace(/\n/g, '<br>'),
                                            }}
                                        />
                                    ) : (
                                        <p className="text-slate-600">No content available for this resource.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Related actions */}
                    <div className="mt-6 flex justify-between">
                        <Link
                            href={auth.user?.role === 'admin' ? '/admin/resources' : '/user/resources'}
                            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Resources
                        </Link>

                        {auth.user?.role === 'admin' && (
                            <Link
                                href={`/admin/resources/${resource.id}/edit`}
                                className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
                            >
                                Edit Resource
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
