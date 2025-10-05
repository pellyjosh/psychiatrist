import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

export default function AdminResourcesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        type: 'article',
        category: '',
        content: '',
        external_url: '',
        tags: [] as string[],
        is_published: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/resources');
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tags = e.target.value
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);
        setData('tags', tags);
    };

    return (
        <AdminLayout>
            <Head title="Create Resource - Admin | Omolola Akinola Psychiatry PLLC" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/resources"
                        className="hover:text-custom-green hover:border-custom-green rounded-lg border border-slate-300 p-2 text-slate-600 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Create Resource</h1>
                        <p className="mt-1 text-slate-600">Add a new resource for patients</p>
                    </div>
                </div>

                {/* Form */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6 p-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Title */}
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="focus:ring-custom-green focus:border-custom-green w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2"
                                    placeholder="Enter resource title..."
                                />
                                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                            </div>

                            {/* Type */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value as any)}
                                    className="focus:ring-custom-green focus:border-custom-green w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2"
                                >
                                    <option value="article">Article</option>
                                    <option value="link">External Link</option>
                                    <option value="emergency">Emergency Information</option>
                                </select>
                                {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                            </div>

                            {/* Category */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
                                <input
                                    type="text"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="focus:ring-custom-green focus:border-custom-green w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2"
                                    placeholder="e.g., Mental Health, Therapy, Wellness"
                                />
                                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    className="focus:ring-custom-green focus:border-custom-green w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2"
                                    placeholder="Brief description of the resource..."
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                            </div>

                            {/* External URL (for links) */}
                            {data.type === 'link' && (
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        External URL <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="url"
                                        value={data.external_url}
                                        onChange={(e) => setData('external_url', e.target.value)}
                                        className="focus:ring-custom-green focus:border-custom-green w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2"
                                        placeholder="https://example.com"
                                    />
                                    {errors.external_url && <p className="mt-1 text-sm text-red-600">{errors.external_url}</p>}
                                </div>
                            )}

                            {/* Content (for articles and emergency) */}
                            {(data.type === 'article' || data.type === 'emergency') && (
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Content</label>
                                    <textarea
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        rows={8}
                                        className="focus:ring-custom-green focus:border-custom-green w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2"
                                        placeholder={
                                            data.type === 'emergency' ? 'Emergency contact information and crisis resources...' : 'Article content...'
                                        }
                                    />
                                    {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
                                </div>
                            )}

                            {/* Tags */}
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-slate-700">Tags</label>
                                <input
                                    type="text"
                                    onChange={handleTagsChange}
                                    className="focus:ring-custom-green focus:border-custom-green w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2"
                                    placeholder="Separate tags with commas (e.g., anxiety, mindfulness, coping)"
                                />
                                <p className="mt-1 text-xs text-slate-500">Tags help patients find relevant resources</p>
                                {errors.tags && <p className="mt-1 text-sm text-red-600">{errors.tags}</p>}
                            </div>

                            {/* Published Status */}
                            <div className="md:col-span-2">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="is_published"
                                        checked={data.is_published}
                                        onChange={(e) => setData('is_published', e.target.checked)}
                                        className="text-custom-green focus:ring-custom-green rounded border-slate-300"
                                    />
                                    <label htmlFor="is_published" className="ml-2 text-sm font-medium text-slate-700">
                                        Publish immediately
                                    </label>
                                </div>
                                <p className="mt-1 text-xs text-slate-500">Unpublished resources are only visible to admins</p>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
                            <Link
                                href="/admin/resources"
                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-custom-green hover:bg-custom-green-dark inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
                            >
                                <Save className="h-4 w-4" />
                                {processing ? 'Creating...' : 'Create Resource'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
