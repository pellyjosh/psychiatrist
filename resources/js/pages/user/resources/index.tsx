import UserLayout from '@/layouts/user-layout';
import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, Clock, ExternalLink, Eye, FileText, Filter, Phone, Search, Tag } from 'lucide-react';
import { useState } from 'react';

interface Creator {
    id: number;
    name: string;
    email: string;
}

interface Resource {
    id: number;
    title: string;
    description: string;
    type: 'article' | 'link' | 'emergency';
    category: string | null;
    tags: string[] | null;
    view_count: number;
    created_at: string;
    creator: Creator;
}

interface Props {
    resources: {
        data: Resource[];
        links: any[];
        meta: any;
    };
    filters: {
        search?: string;
        type?: string;
        category?: string;
    };
    categories: string[];
}

export default function UserResourcesIndex({ resources, filters, categories }: Props) {
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/user/resources',
            {
                ...filters,
                search: searchQuery || undefined,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleFilter = (filterData: any) => {
        router.get('/user/resources', filterData, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearchQuery('');
        router.get('/user/resources');
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'emergency':
                return <Phone className="h-5 w-5" />;
            case 'link':
                return <ExternalLink className="h-5 w-5" />;
            default:
                return <FileText className="h-5 w-5" />;
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

    return (
        <UserLayout>
            <Head title="My Resources - Omolola Akinola Psychiatry PLLC" />

            <div className="space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-slate-800">Resources</h1>
                    <p className="mt-2 text-slate-600">Helpful resources for your mental health journey</p>
                </div>

                {/* Search & Filters */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-4">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search resources..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="focus:ring-custom-green focus:border-custom-green w-full rounded-lg border border-slate-300 py-2 pr-3 pl-10 text-sm focus:ring-2"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="bg-custom-green hover:bg-custom-green-dark rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
                            >
                                Search
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                            >
                                <Filter className="mr-2 inline h-4 w-4" />
                                Filters
                            </button>
                        </form>
                    </div>

                    {showFilters && (
                        <div className="border-b border-slate-200 bg-slate-50 p-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Type</label>
                                    <select
                                        value={filters?.type || ''}
                                        onChange={(e) => handleFilter({ ...filters, search: searchQuery, type: e.target.value || undefined })}
                                        className="focus:ring-custom-green focus:border-custom-green w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2"
                                    >
                                        <option value="">All Types</option>
                                        <option value="article">Articles</option>
                                        <option value="link">External Links</option>
                                        <option value="emergency">Emergency</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
                                    <select
                                        value={filters?.category || ''}
                                        onChange={(e) => handleFilter({ ...filters, search: searchQuery, category: e.target.value || undefined })}
                                        className="focus:ring-custom-green focus:border-custom-green w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={clearFilters}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Resources Grid */}
                {resources.data.length === 0 ? (
                    <div className="py-12 text-center">
                        <BookOpen className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                        <h3 className="mb-2 text-lg font-medium text-slate-900">No resources found</h3>
                        <p className="text-slate-600">No resources match your current search and filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {resources.data.map((resource) => (
                            <Link
                                key={resource.id}
                                href={`/user/resources/${resource.id}`}
                                className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
                            >
                                <div className="p-6">
                                    <div className="mb-3 flex items-start justify-between">
                                        <div
                                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${getTypeColor(resource.type)}`}
                                        >
                                            {getTypeIcon(resource.type)}
                                            {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-slate-500">
                                            <Eye className="h-3 w-3" />
                                            {resource.view_count}
                                        </div>
                                    </div>

                                    <h3 className="group-hover:text-custom-green mb-2 text-lg font-semibold text-slate-900 transition-colors">
                                        {resource.title}
                                    </h3>

                                    <p className="mb-4 line-clamp-3 text-sm text-slate-600">{resource.description}</p>

                                    <div className="space-y-3">
                                        {resource.category && (
                                            <div className="text-custom-green bg-custom-green-light inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium">
                                                <Tag className="h-3 w-3" />
                                                {resource.category}
                                            </div>
                                        )}

                                        {resource.tags && resource.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {resource.tags.slice(0, 3).map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {resource.tags.length > 3 && (
                                                    <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-1 text-xs font-medium text-slate-500">
                                                        +{resource.tags.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs text-slate-500">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {new Date(resource.created_at).toLocaleDateString()}
                                            </div>
                                            <span className="text-custom-green group-hover:text-custom-green-dark font-medium">Read more →</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {resources.links && resources.links.length > 3 && (
                    <div className="flex items-center justify-center space-x-2">
                        {resources.links.map((link: any, index: number) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                                    link.active ? 'bg-custom-green text-white' : 'hover:text-custom-green hover:bg-custom-green-light text-slate-600'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </UserLayout>
    );
}
