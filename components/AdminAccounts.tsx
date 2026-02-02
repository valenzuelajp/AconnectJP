"use client";

import { useEffect, useState } from "react";

export default function AdminAccounts() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/accounts");
      const data = await res.json();
      setAccounts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(id: number, currentStatus: string) {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await fetch(`/api/admin/accounts?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setAccounts(accounts.map(acc => acc.id === id ? { ...acc, status: newStatus } : acc));
      }
    } catch (error) {
      console.error(error);
    }
  }

  const filteredAccounts = accounts.filter(acc => {
    const nameMatch = (acc.first_name + " " + acc.last_name).toLowerCase().includes(search.toLowerCase()) ||
      acc.email.toLowerCase().includes(search.toLowerCase());
    const statusMatch = statusFilter === "all" || acc.status === statusFilter;
    return nameMatch && statusMatch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#700A0A]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 font-sans">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <i className="fas fa-users-cog text-[#700A0A]"></i>
          Manage <span className="text-[#700A0A]">Accounts</span>
        </h1>
        <p className="text-slate-500 mt-2">Oversee alumni registrations and system access</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#700A0A] focus:ring-1 focus:ring-[#700A0A]/20 outline-none text-sm transition-all"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'inactive'].map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${statusFilter === f
                    ? 'bg-[#700A0A] text-white'
                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Alumni</th>
                <th className="py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">ID / Student No.</th>
                <th className="py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Joined Date</th>
                <th className="py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAccounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-800">{acc.first_name} {acc.last_name}</div>
                    <div className="text-xs text-slate-500">{acc.email}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-medium text-slate-600">{acc.student_number || 'N/A'}</div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-500">
                    {new Date(acc.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${acc.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                      {acc.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => toggleStatus(acc.id, acc.status)}
                      className={`text-xs font-bold px-4 py-2 rounded-lg border transition-all ${acc.status === 'active'
                          ? 'border-red-200 text-red-600 hover:bg-red-50'
                          : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                        }`}
                    >
                      {acc.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
