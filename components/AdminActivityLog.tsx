"use client";

import { useEffect, useState } from "react";

export default function AdminActivityLog() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/activity-log");
      const data = await res.json();
      if (!data.error) {
        setLogs(data);
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredLogs = logs.filter(log =>
    (log.alumni?.first_name + " " + log.alumni?.last_name).toLowerCase().includes(search.toLowerCase()) ||
    log.activity.toLowerCase().includes(search.toLowerCase())
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
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <i className="fas fa-history text-[#700A0A]"></i>
          Activity <span className="text-[#700A0A]">Log</span>
        </h1>
        <p className="text-slate-500 mt-2">Monitor system actions and user interactions</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input
              type="text"
              placeholder="Search by user or activity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#700A0A] focus:ring-1 focus:ring-[#700A0A]/20 outline-none text-sm transition-all"
            />
          </div>
          <button
            onClick={fetchLogs}
            className="text-sm font-bold text-[#700A0A] hover:underline flex items-center gap-2"
          >
            <i className="fas fa-sync-alt"></i> Refresh Log
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                <th className="py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">User Involved</th>
                <th className="py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Activity Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm text-slate-500 font-medium">
                      {new Date(log.created_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-800">
                        {log.alumni?.first_name} {log.alumni?.last_name}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">ALUMNI ID: {log.alumni_id}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                        {log.activity}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-20 text-slate-400 italic font-medium">
                    No logs found matching your search.
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
