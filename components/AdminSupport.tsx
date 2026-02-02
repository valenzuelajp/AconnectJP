"use client";

import { useEffect, useState } from "react";

export default function AdminSupport() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/support");
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(id: number, currentStatus: string) {
    const newStatus = currentStatus === "solved" ? "open" : "solved";
    try {
      const res = await fetch(`/api/admin/support?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setMessages(messages.map(msg => msg.id === id ? { ...msg, status: newStatus } : msg));
      }
    } catch (error) {
      console.error(error);
    }
  }

  const filteredMessages = messages.filter(msg => {
    const nameMatch = (msg.alumni?.first_name + " " + msg.alumni?.last_name).toLowerCase().includes(search.toLowerCase()) ||
      msg.message.toLowerCase().includes(search.toLowerCase()) ||
      msg.alumni?.email.toLowerCase().includes(search.toLowerCase());
    const statusMatch = statusFilter === "all" || msg.status === statusFilter;
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
          <i className="fas fa-headset text-[#700A0A]"></i>
          Support <span className="text-[#700A0A]">Inbox</span>
        </h1>
        <p className="text-slate-500 mt-2">Address alumni inquiries and technical issues</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input
              type="text"
              placeholder="Search by name, email, or message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#700A0A] focus:ring-1 focus:ring-[#700A0A]/20 outline-none text-sm transition-all"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'open', 'solved'].map(f => (
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
                <th className="py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Message Brief</th>
                <th className="py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Date Reported</th>
                <th className="py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredMessages.length > 0 ? (
                filteredMessages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-800">{msg.alumni?.first_name} {msg.alumni?.last_name}</div>
                      <div className="text-xs text-slate-500">{msg.alumni?.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-slate-600 line-clamp-1 max-w-xs">{msg.message}</div>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-500">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${msg.status === 'solved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                        {msg.status || 'open'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => toggleStatus(msg.id, msg.status)}
                        className={`text-xs font-bold px-4 py-2 rounded-lg border transition-all ${msg.status === 'solved'
                            ? 'border-slate-200 text-slate-600 hover:bg-slate-100'
                            : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                          }`}
                      >
                        {msg.status === 'solved' ? 'Reopen' : 'Mark Solved'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-slate-400 italic font-medium">
                    No messages found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
