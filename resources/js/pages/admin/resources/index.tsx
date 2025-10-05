import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, Edit, ExternalLink, Eye, FileText, Filter, Phone, Plus, Search, User } from 'lucide-react';
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
    type: 'article' | 'video' | 'pdf' | 'link' | 'audio';
    category: string | null;
    content: string | null;
    file_path: string | null;
    external_url: string | null;
    tags: string[] | null;
    is_published: boolean;
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
        published?: string;
    };
    stats: {
        total: number;
        published: number;
        draft: number;
        articles: number;
        links: number;
        emergency: number;
    };
    categories: string[];
}

export default function AdminResourcesIndex({ resources, filters, stats, categories }: Props) {
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/resources',
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
        router.get('/admin/resources', filterData, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearchQuery('');
        router.get('/admin/resources');
    };

    const handleDelete = (resourceId: number) => {
        if (confirm('Are you sure you want to delete this resource?')) {
            router.delete(`/admin/resources/${resourceId}`, {
                preserveState: true,
            });
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'article':
                return <FileText className="h-4 w-4" />;
            case 'emergency':
                return <Phone className="h-4 w-4" />;
            case 'link':
                return <ExternalLink className="h-4 w-4" />;
            default:
                return <FileText className="h-4 w-4" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'article':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'emergency':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'link':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    return (
        <AdminLayout>
            <Head title="Manage Resources" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Manage Resources</h1>
                        <p className="mt-1 text-slate-600">Create and manage patient resources</p>
                    </div>
                    <Link
                        href="/admin/resources/create"
                        className="bg-custom-green hover:bg-custom-green-dark inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Add Resource
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Total</p>
                                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                            </div>
                            <BookOpen className="h-8 w-8 text-slate-400" />
                        </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-custom-green text-sm font-medium">Published</p>
                                <p className="text-custom-green-dark text-2xl font-bold">{stats.published}</p>
                            </div>
                            <Eye className="text-custom-green h-8 w-8" />
                        </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-amber-600">Draft</p>
                                <p className="text-2xl font-bold text-amber-800">{stats.draft}</p>
                            </div>
                            <Edit className="h-8 w-8 text-amber-400" />
                        </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Articles</p>
                                <p className="text-2xl font-bold text-blue-800">{stats.articles}</p>
                            </div>
                            <FileText className="h-8 w-8 text-blue-400" />
                        </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600">Links</p>
                                <p className="text-2xl font-bold text-green-800">{stats.links}</p>
                            </div>
                            <ExternalLink className="h-8 w-8 text-green-400" />
                        </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-red-600">Emergency</p>
                                <p className="text-2xl font-bold text-red-800">{stats.emergency}</p>
                            </div>
                            <Phone className="h-8 w-8 text-red-400" />
                        </div>
                    </div>
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
                                        placeholder="Search resources by title or description..."
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
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Type</label>
                                    <select
                                        value={filters?.type || ''}
                                        onChange={(e) => handleFilter({ ...filters, search: searchQuery, type: e.target.value || undefined })}
                                        className="focus:ring-custom-green focus:border-custom-green w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2"
                                    >
                                        <option value="">All Types</option>
                                        <option value="article">Article</option>
                                        <option value="link">Link</option>
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
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
                                    <select
                                        value={filters?.published || ''}
                                        onChange={(e) => handleFilter({ ...filters, search: searchQuery, published: e.target.value || undefined })}
                                        className="focus:ring-custom-green focus:border-custom-green w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2"
                                    >
                                        <option value="">All Status</option>
                                        <option value="1">Published</option>
                                        <option value="0">Draft</option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={clearFilters}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Resources List */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    {resources.data.length === 0 ? (
                        <div className="py-12 text-center">
                            <BookOpen className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                            <h3 className="mb-2 text-lg font-medium text-slate-900">No resources found</h3>
                            <p className="mb-4 text-slate-600">No resources match your current search and filters.</p>
                            <Link
                                href="/admin/resources/create"
                                className="bg-custom-green hover:bg-custom-green-dark inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                Create First Resource
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b border-slate-200 bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-900">Resource</th>
                                        <th className="px-6 py-3 text-center font-semibold text-slate-900">Type</th>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-900">Category</th>
                                        <th className="px-6 py-3 text-center font-semibold text-slate-900">Status</th>
                                        <th className="px-6 py-3 text-center font-semibold text-slate-900">Views</th>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-900">Created</th>
                                        <th className="px-6 py-3 text-right font-semibold text-slate-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {resources.data.map((resource) => (
                                        <tr key={resource.id} className="transition-colors hover:bg-slate-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-slate-900">{resource.title}</div>
                                                    <div className="line-clamp-2 text-sm text-slate-600">{resource.description}</div>
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <User className="h-3 w-3 text-slate-400" />
                                                        <span className="text-xs text-slate-500">{resource.creator.name}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${getTypeColor(resource.type)}`}
                                                >
                                                    {getTypeIcon(resource.type)}
                                                    {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-slate-900">{resource.category || 'Uncategorized'}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                        resource.is_published
                                                            ? 'bg-custom-green-light text-custom-green-dark'
                                                            : 'bg-amber-100 text-amber-800'
                                                    }`}
                                                >
                                                    {resource.is_published ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="font-medium text-slate-900">{resource.view_count}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-slate-600">{new Date(resource.created_at).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/resources/${resource.id}`}
                                                        className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-800"
                                                    >
                                                        View
                                                    </Link>
                                                    <Link
                                                        href={`/admin/resources/${resource.id}/edit`}
                                                        className="text-custom-green hover:text-custom-green-dark text-sm font-medium transition-colors"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(resource.id)}
                                                        className="text-sm font-medium text-red-600 transition-colors hover:text-red-800"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

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
        </AdminLayout>
    );
}
