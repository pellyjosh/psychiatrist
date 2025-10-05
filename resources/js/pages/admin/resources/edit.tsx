import { SharedHeader } from '@/components/shared-header';
import { type SharedData } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

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
    is_published: boolean;
    view_count: number;
    created_at: string;
    creator: {
        name: string;
    };
}

interface Props extends SharedData {
    resource: Resource;
}

export default function EditResource() {
    const { resource } = usePage<Props>().props;
    const [isDeleting, setIsDeleting] = useState(false);

    const { data, setData, patch, processing, errors, reset } = useForm({
        title: resource.title,
        description: resource.description,
        type: resource.type,
        category: resource.category,
        content: resource.content || '',
        external_url: resource.external_url || '',
        tags: resource.tags.join(', '),
        is_published: resource.is_published,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(`/admin/resources/${resource.id}`, {
            onSuccess: () => {
                // Redirect to resources index on success
                router.visit('/admin/resources');
            },
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this resource?')) {
            setIsDeleting(true);
            router.delete(`/admin/resources/${resource.id}`, {
                onFinish: () => setIsDeleting(false),
            });
        }
    };

    return (
        <>
            <Head title={`Edit ${resource.title} - Admin Resources`} />

            <div className="min-h-screen bg-slate-50">
                <SharedHeader />

                <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <Link
                                    href="/admin/resources"
                                    className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-emerald-600"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Resources
                                </Link>
                                <h1 className="mt-2 text-2xl font-bold text-slate-900">Edit Resource</h1>
                                <p className="mt-1 text-sm text-slate-600">Update the resource information</p>
                            </div>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="inline-flex items-center rounded-lg border border-red-600 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="rounded-lg bg-white p-6 shadow">
                            {/* Basic Information */}
                            <div className="space-y-6">
                                <h2 className="text-lg font-medium text-slate-900">Basic Information</h2>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                            required
                                        />
                                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-slate-700">
                                            Category
                                        </label>
                                        <input
                                            type="text"
                                            id="category"
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                            placeholder="e.g., Mental Health, Self-Help"
                                            required
                                        />
                                        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={3}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        placeholder="Brief description of the resource"
                                        required
                                    />
                                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                                </div>

                                <div>
                                    <label htmlFor="type" className="block text-sm font-medium text-slate-700">
                                        Resource Type
                                    </label>
                                    <select
                                        id="type"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value as any)}
                                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        required
                                    >
                                        <option value="article">Article</option>
                                        <option value="link">External Link</option>
                                        <option value="emergency">Emergency Information</option>
                                    </select>
                                    {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                                </div>

                                <div>
                                    <label htmlFor="tags" className="block text-sm font-medium text-slate-700">
                                        Tags
                                    </label>
                                    <input
                                        type="text"
                                        id="tags"
                                        value={data.tags}
                                        onChange={(e) => setData('tags', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        placeholder="anxiety, depression, self-help (comma separated)"
                                    />
                                    <p className="mt-1 text-sm text-slate-500">Separate tags with commas</p>
                                    {errors.tags && <p className="mt-1 text-sm text-red-600">{errors.tags}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="rounded-lg bg-white p-6 shadow">
                            <h2 className="mb-6 text-lg font-medium text-slate-900">Content</h2>

                            {data.type === 'article' || data.type === 'emergency' ? (
                                <div>
                                    <label htmlFor="content" className="block text-sm font-medium text-slate-700">
                                        Content
                                    </label>
                                    <textarea
                                        id="content"
                                        rows={12}
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        placeholder={
                                            data.type === 'emergency'
                                                ? 'Enter emergency contact information and crisis resources...'
                                                : 'Enter the resource content...'
                                        }
                                    />
                                    {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
                                </div>
                            ) : (
                                <div>
                                    <label htmlFor="external_url" className="block text-sm font-medium text-slate-700">
                                        External URL
                                    </label>
                                    <input
                                        type="url"
                                        id="external_url"
                                        value={data.external_url}
                                        onChange={(e) => setData('external_url', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        placeholder="https://example.com"
                                    />
                                    {errors.external_url && <p className="mt-1 text-sm text-red-600">{errors.external_url}</p>}
                                </div>
                            )}
                        </div>

                        {/* Publishing Options */}
                        <div className="rounded-lg bg-white p-6 shadow">
                            <h2 className="mb-6 text-lg font-medium text-slate-900">Publishing</h2>

                            <div className="flex items-center">
                                <input
                                    id="is_published"
                                    type="checkbox"
                                    checked={data.is_published}
                                    onChange={(e) => setData('is_published', e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                />
                                <label htmlFor="is_published" className="ml-2 block text-sm text-slate-700">
                                    Publish this resource (make it visible to users)
                                </label>
                            </div>
                            {errors.is_published && <p className="mt-1 text-sm text-red-600">{errors.is_published}</p>}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-3">
                            <Link
                                href="/admin/resources"
                                className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {processing ? 'Saving...' : 'Save Resource'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
