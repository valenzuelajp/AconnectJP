"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminReports() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    grad_year: "",
    status: "",
    date_from: "",
    date_to: ""
  });

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    setLoading(true);
    const params = new URLSearchParams(filters);
    const res = await fetch(`/api/admin/reports?${params.toString()}`);
    const result = await res.json();
    setData(result);
    setLoading(false);
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const exportToExcel = () => {
    if (!data || !data.employment_rows) return;

    const worksheetData = data.employment_rows.map((row: any) => ({
      "Alumni Name": `${row.alumni.last_name}, ${row.alumni.first_name}`,
      "Email": row.alumni.email,
      "Graduation Year": row.alumni.graduation_year,
      "Status": row.employment_status,
      "Company": row.company_name,
      "Job Title": row.job_title,
      "Promotions": row.promotion_count,
      "Submitted At": new Date(row.created_at).toLocaleDateString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employment Report");
    XLSX.writeFile(workbook, `Employment_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToPDF = () => {
    if (!data || !data.employment_rows) return;

    const doc = new jsPDF("landscape");
    doc.text("AConnect - Employment Report", 14, 15);

    const tableData = data.employment_rows.map((row: any) => [
      `${row.alumni.last_name}, ${row.alumni.first_name}`,
      row.alumni.graduation_year,
      row.employment_status,
      row.company_name,
      row.job_title,
      row.promotion_count,
      new Date(row.created_at).toLocaleDateString()
    ]);

    autoTable(doc, {
      head: [["Alumni", "Grad Year", "Status", "Company", "Job Title", "Promotions", "Date"]],
      body: tableData,
      startY: 20,
      theme: 'grid',
      headStyles: { fillColor: [112, 10, 10] } 
    });

    doc.save(`Employment_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading || !data) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#700A0A]"></div>
      </div>
    );
  }

  const chartData = {
    labels: data.engagement_by_year.map((d: any) => d.graduation_year),
    datasets: [
      {
        label: 'Total Alumni',
        data: data.engagement_by_year.map((d: any) => d.total_alumni),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Active (30d)',
        data: data.engagement_by_year.map((d: any) => d.active_alumni),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 font-sans">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <i className="fas fa-file-contract text-[#700A0A]"></i>
          Reports & <span className="text-[#700A0A]">Analytics</span>
        </h1>
        <div className="flex gap-3">
          <button
            onClick={exportToExcel}
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-emerald-700 transition-all flex items-center gap-2"
          >
            <i className="fas fa-file-excel"></i> Export Excel
          </button>
          <button
            onClick={exportToPDF}
            className="bg-[#700A0A] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:brightness-110 transition-all flex items-center gap-2"
          >
            <i className="fas fa-file-pdf"></i> Export PDF
          </button>
        </div>
      </div>

      {}
      <section className="bg-white border border-slate-200 rounded-2xl p-8 mb-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800">Alumni Engagement by Graduation Year</h2>
          <p className="text-sm text-slate-500">Activity and registration metrics across batches</p>
        </div>
        <div className="h-[350px]">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'bottom' }
              }
            }}
          />
        </div>
      </section>

      {}
      <section className="bg-white border border-slate-200 rounded-2xl p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-end">
          <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Grad Year</label>
              <select
                name="grad_year"
                value={filters.grad_year}
                onChange={handleFilterChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm"
              >
                <option value="">All Years</option>
                {Array.from({ length: 46 }, (_, i) => new Date().getFullYear() - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm"
              >
                <option value="">All Status</option>
                <option value="Employed">Employed</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Self-employed">Self-employed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">From</label>
              <input
                type="date"
                name="date_from"
                value={filters.date_from}
                onChange={handleFilterChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">To</label>
              <input
                type="date"
                name="date_to"
                value={filters.date_to}
                onChange={handleFilterChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchReports}
              className="bg-[#700A0A] text-white px-6 py-2 rounded-xl font-bold text-sm hover:brightness-110"
            >
              Apply
            </button>
            <button
              onClick={() => {
                setFilters({ grad_year: "", status: "", date_from: "", date_to: "" });
                setTimeout(fetchReports, 0);
              }}
              className="bg-slate-100 text-slate-600 px-6 py-2 rounded-xl font-bold text-sm hover:bg-slate-200"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest px-2">Alumni</th>
                <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest px-2">Grad Year</th>
                <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest px-2">Status</th>
                <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest px-2">Company</th>
                <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest px-2">Job Title</th>
                <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest px-2 text-right">Promotions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.employment_rows.length > 0 ? (
                data.employment_rows.map((row: any) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-2">
                      <div className="font-bold text-slate-800">{row.alumni.last_name}, {row.alumni.first_name}</div>
                      <div className="text-xs text-slate-500">{row.alumni.email}</div>
                    </td>
                    <td className="py-4 px-2 text-sm text-slate-600">{row.alumni.graduation_year}</td>
                    <td className="py-4 px-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${row.employment_status === 'Employed' ? 'bg-emerald-100 text-emerald-700' :
                        row.employment_status === 'Self-employed' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {row.employment_status}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-sm text-slate-800 font-medium">{row.company_name}</td>
                    <td className="py-4 px-2 text-sm text-slate-600">{row.job_title}</td>
                    <td className="py-4 px-2 text-sm text-slate-600 text-right font-bold">{row.promotion_count}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-20 text-slate-400 italic">No records found matching filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
