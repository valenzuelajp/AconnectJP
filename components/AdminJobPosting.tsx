"use client";

import { useEffect, useState } from "react";

export default function AdminJobPosting() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    job_title: "",
    company: "",
    description: "",
    location: "",
    salary_range: "",
    qualifications: "",
    contact_details: ""
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/jobs");
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        fetchJobs();
        setFormData({ job_title: "", company: "", description: "", location: "", salary_range: "", qualifications: "", contact_details: "" });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this job posting?")) return;
    try {
      const res = await fetch("/api/admin/jobs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (res.ok) fetchJobs();
    } catch (error) {
      console.error(error);
    }
  }

  const filteredJobs = jobs.filter(j =>
    j.job_title.toLowerCase().includes(search.toLowerCase()) ||
    j.company.toLowerCase().includes(search.toLowerCase())
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
            <i className="fas fa-briefcase text-[#700A0A]"></i>
            Career <span className="text-[#700A0A]">Center</span>
          </h1>
          <p className="text-slate-500 mt-2">Manage job opportunities for the alumni network</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#700A0A] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-red-100 hover:brightness-110 transition-all flex items-center gap-2"
        >
          <i className="fas fa-plus"></i> Post New Job
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input
              type="text"
              placeholder="Search jobs by title or company..."
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
                <th className="py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Job Details</th>
                <th className="py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Location & Salary</th>
                <th className="py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Posted Date</th>
                <th className="py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-800">{job.job_title}</div>
                    <div className="text-xs text-[#700A0A] font-bold uppercase tracking-tight">{job.company}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-bold text-slate-700">{job.location}</div>
                    <div className="text-xs text-emerald-600 font-bold">{job.salary_range}</div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-500">
                    {new Date(job.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDelete(job.id)}
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#700A0A] p-6 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">Post New Job Opening</h2>
              <button onClick={() => setShowModal(false)} className="hover:opacity-75 transition-opacity">
                <i className="fas fa-times text-2xl"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Job Title</label>
                <input
                  required
                  type="text"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#700A0A]/20 focus:border-[#700A0A] outline-none"
                  value={formData.job_title}
                  onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Company</label>
                <input
                  required
                  type="text"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#700A0A]/20 focus:border-[#700A0A] outline-none"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Location</label>
                <input
                  required
                  type="text"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#700A0A]/20 focus:border-[#700A0A] outline-none"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Salary Range</label>
                <input
                  type="text"
                  placeholder="e.g. 30k - 50k"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#700A0A]/20 focus:border-[#700A0A] outline-none"
                  value={formData.salary_range}
                  onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Contact Details</label>
                <input
                  required
                  type="text"
                  placeholder="Email or Phone"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#700A0A]/20 focus:border-[#700A0A] outline-none"
                  value={formData.contact_details}
                  onChange={(e) => setFormData({ ...formData, contact_details: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                <textarea
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#700A0A]/20 focus:border-[#700A0A] outline-none resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Qualifications</label>
                <textarea
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#700A0A]/20 focus:border-[#700A0A] outline-none resize-none"
                  value={formData.qualifications}
                  onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                ></textarea>
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
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
                  Post Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
