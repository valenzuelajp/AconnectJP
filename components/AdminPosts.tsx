"use client";

import { useEffect, useState } from "react";

export default function AdminPosts() {
    const [posts, setPosts] = useState<any[]>([]);
    const [carouselPhotos, setCarouselPhotos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showCarouselModal, setShowCarouselModal] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        post_type: "announcements",
        recipient_batch: "",
        imageFile: null as File | null
    });
    const [carouselFormData, setCarouselFormData] = useState({
        title: "",
        description: "",
        file: null as File | null
    });

    useEffect(() => {
        fetchPosts();
        fetchCarousel();
    }, []);

    async function fetchPosts() {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/posts");
            const data = await res.json();
            setPosts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchCarousel() {
        try {
            const res = await fetch("/api/admin/carousel");
            const data = await res.json();
            setCarouselPhotos(data);
        } catch (error) {
            console.error(error);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const data = new FormData();
        data.append("title", formData.title);
        data.append("content", formData.content);
        data.append("post_type", formData.post_type);
        data.append("recipient_batch", formData.recipient_batch);
        if (formData.imageFile) {
            data.append("file", formData.imageFile);
        }

        try {
            const res = await fetch("/api/admin/posts", {
                method: "POST",
                body: data
            });
            if (res.ok) {
                setShowModal(false);
                fetchPosts();
                setFormData({
                    title: "",
                    content: "",
                    post_type: "announcements",
                    recipient_batch: "",
                    imageFile: null
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function handleCarouselSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!carouselFormData.file) return alert("Please select a file");

        const data = new FormData();
        data.append("file", carouselFormData.file);
        data.append("title", carouselFormData.title);
        data.append("description", carouselFormData.description);

        try {
            const res = await fetch("/api/admin/carousel", {
                method: "POST",
                body: data
            });
            if (res.ok) {
                fetchCarousel();
                setCarouselFormData({ title: "", description: "", file: null });
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Are you sure you want to delete this post?")) return;
        try {
            const res = await fetch(`/api/admin/posts?id=${id}`, { method: "DELETE" });
            if (res.ok) fetchPosts();
        } catch (error) {
            console.error(error);
        }
    }

    async function handleCarouselDelete(id: number) {
        if (!confirm("Remove this banner?")) return;
        try {
            const res = await fetch(`/api/admin/carousel?id=${id}`, { method: "DELETE" });
            if (res.ok) fetchCarousel();
        } catch (error) {
            console.error(error);
        }
    }

    const filteredPosts = posts.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.content.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#700A0A]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto px-6 py-10 font-sans">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                        <i className="fas fa-rss text-[#700A0A]"></i>
                        Content <span className="text-[#700A0A]">Manager</span>
                    </h1>
                    <p className="text-slate-500 mt-2">Publish announcements, news, and alumni stories</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowCarouselModal(true)}
                        className="bg-white text-slate-700 border border-slate-200 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
                    >
                        <i className="fas fa-images"></i> Carousel
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-[#700A0A] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-red-100 hover:brightness-110 transition-all flex items-center gap-2"
                    >
                        <i className="fas fa-plus"></i> Create New Post
                    </button>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-96">
                        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                        <input
                            type="text"
                            placeholder="Search posts by title or content..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#700A0A] focus:ring-1 focus:ring-[#700A0A]/20 outline-none text-sm transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Post Title</th>
                                <th className="py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Type</th>
                                <th className="py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Published</th>
                                <th className="py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Author</th>
                                <th className="py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="font-bold text-slate-800 line-clamp-1">{post.title}</div>
                                        <div className="text-xs text-slate-500 line-clamp-1 max-w-xs">{post.content}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${post.post_type === 'news' ? 'bg-blue-100 text-blue-700' :
                                            post.post_type === 'announcements' ? 'bg-amber-100 text-amber-700' :
                                                'bg-emerald-100 text-emerald-700'
                                            }`}>
                                            {post.post_type}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-slate-500">
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-6 text-sm font-bold text-slate-600">
                                        {post.admin_users_post_created_byToadmin_users?.first_name || "Admin"}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="text-red-500 hover:text-red-700 p-2 transition-colors"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[5000] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-[#700A0A] p-6 text-white flex justify-between items-center">
                            <h2 className="text-xl font-bold">Create New Post</h2>
                            <button onClick={() => setShowModal(false)} className="hover:opacity-75 transition-opacity">
                                <i className="fas fa-times text-2xl"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Post Title</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#700A0A]/20 focus:border-[#700A0A] outline-none"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Featured Image</label>
                                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-[#700A0A] transition-colors bg-slate-50/50 cursor-pointer relative">
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept="image/*"
                                        onChange={(e) => setFormData({ ...formData, imageFile: e.target.files?.[0] || null })}
                                    />
                                    <i className="fas fa-cloud-upload-alt text-3xl text-slate-300 mb-2"></i>
                                    <div className="text-sm font-bold text-slate-600">
                                        {formData.imageFile ? formData.imageFile.name : "Click to upload post image"}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Full 1080x1080 or 1599x1600 seen on site</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                                    <select
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#700A0A]/20 focus:border-[#700A0A] outline-none"
                                        value={formData.post_type}
                                        onChange={(e) => setFormData({ ...formData, post_type: e.target.value })}
                                    >
                                        <option value="announcements">Announcement</option>
                                        <option value="news">News</option>
                                        <option value="stories">Story</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Recipient Batch (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 2024, 2023"
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#700A0A]/20 focus:border-[#700A0A] outline-none"
                                        value={formData.recipient_batch}
                                        onChange={(e) => setFormData({ ...formData, recipient_batch: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Content</label>
                                <textarea
                                    required
                                    rows={5}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#700A0A]/20 focus:border-[#700A0A] outline-none resize-none"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-slate-100 text-slate-600 px-8 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-[#700A0A] text-white px-10 py-3 rounded-xl font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-red-100"
                                >
                                    Publish Post
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {}
            {showCarouselModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[5000] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
                        <div className="bg-[#8B1538] p-6 text-white flex justify-between items-center sticky top-0 z-10">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <i className="fas fa-images"></i> Carousel Manager
                            </h2>
                            <button onClick={() => setShowCarouselModal(false)} className="hover:opacity-75 transition-opacity">
                                <i className="fas fa-times text-2xl"></i>
                            </button>
                        </div>

                        <div className="p-8 space-y-10">
                            {}
                            <div>
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Currently Active Banners</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {carouselPhotos.map((photo) => (
                                        <div key={photo.id} className="relative group bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 aspect-video">
                                            <img
                                                src={`/assets/uploads/carousel/${photo.file_name}`}
                                                className="w-full h-full object-cover"
                                                alt={photo.title}
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleCarouselDelete(photo.id)}
                                                    className="w-10 h-10 bg-white text-red-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                                <div className="text-white text-[10px] font-bold text-center px-2">
                                                    {photo.title}
                                                </div>
                                            </div>
                                            <button className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px]" onClick={() => handleCarouselDelete(photo.id)}>
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    ))}
                                    {carouselPhotos.length === 0 && (
                                        <div className="col-span-full py-10 text-center text-slate-400 italic">No banners active.</div>
                                    )}
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {}
                            <form onSubmit={handleCarouselSubmit} className="space-y-6">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Add New Banner</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Banner Title</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Welcome to SDCA"
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#700A0A]/20 focus:border-[#700A0A] outline-none"
                                            value={carouselFormData.title}
                                            onChange={(e) => setCarouselFormData({ ...carouselFormData, title: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Short Description</label>
                                        <textarea
                                            rows={3}
                                            placeholder="Clicking the banner will show this in a modal..."
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#700A0A]/20 focus:border-[#700A0A] outline-none resize-none"
                                            value={carouselFormData.description}
                                            onChange={(e) => setCarouselFormData({ ...carouselFormData, description: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <div>
                                        <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:border-[#8B1538] transition-colors bg-slate-50/50 cursor-pointer relative">
                                            <input
                                                type="file"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                accept="image/*"
                                                onChange={(e) => setCarouselFormData({ ...carouselFormData, file: e.target.files?.[0] || null })}
                                            />
                                            <i className="fas fa-cloud-upload-alt text-4xl text-slate-300 mb-4"></i>
                                            <div className="text-sm font-bold text-slate-600">
                                                {carouselFormData.file ? carouselFormData.file.name : "Click to choose file or drag and drop"}
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-widest">Recommended size: 1920x600px (16:9 ratio)</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        className="bg-[#8B1538] text-white px-10 py-4 rounded-xl font-bold text-sm hover:brightness-110 transition-all shadow-lg active:scale-95"
                                    >
                                        Upload Banner
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
