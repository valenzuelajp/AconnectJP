"use client";

import React from "react";
import Link from "next/link";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface AdminDashboardProps {
    stats: {
        totalEvents: number;
        totalPosts: number;
        totalJobs: number;
        totalAlumni: number;
        totalAccounts: number;
        activeUsers: number;
        inactiveUsers: number;
    };
}

const AdminDashboard = ({ stats }: AdminDashboardProps) => {
    const chartData = {
        labels: ["Active Community", "Pending/Inactive"],
        datasets: [
            {
                data: [stats.activeUsers, stats.inactiveUsers],
                backgroundColor: ["#10b981", "#ef4444"],
                hoverBackgroundColor: ["#059669", "#dc2626"],
                hoverOffset: 10,
                borderWidth: 0,
                borderRadius: 5,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "82%",
        plugins: {
            legend: {
                position: "bottom" as const,
                labels: {
                    usePointStyle: true,
                    padding: 25,
                    font: { size: 12, weight: 'bold' as any },
                    color: '#64748b'
                },
            },
        },
    };

    const widgets = [
        { label: "Community Events", value: stats.totalEvents, icon: "fa-calendar-day", color: "bg-blue-500", href: "/admin/events" },
        { label: "Platform Posts", value: stats.totalPosts, icon: "fa-rss", color: "bg-rose-500", href: "/admin/posting" },
        { label: "Job Opportunities", value: stats.totalJobs, icon: "fa-briefcase", color: "bg-amber-500", href: "/admin/jobs" },
        { label: "Verified Alumni", value: stats.totalAlumni, icon: "fa-user-graduate", color: "bg-emerald-500", href: "/admin/alumni" },
    ];

    return (
        <div className="px-6 py-10 font-sans max-w-[1240px] mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
                    Platform <span className="text-[#700A0A]">Overview</span>
                </h1>
                <p className="text-slate-500 mt-2 font-medium">Welcome back, Administrator. Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {}
                <div className="lg:col-span-1">
                    <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm h-full flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-lg font-black text-slate-800">Alumni Status</h2>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time Metrics</p>
                            </div>
                            <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                <i className="fas fa-chart-pie"></i>
                            </div>
                        </div>

                        <div className="flex-grow flex items-center justify-center relative min-h-[250px]">
                            <Doughnut data={chartData} options={chartOptions} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-4xl font-black text-slate-800 tracking-tighter">{stats.activeUsers + stats.inactiveUsers}</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Total Members</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-50 space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                    <span className="text-sm font-bold text-slate-600">Active</span>
                                </div>
                                <span className="text-sm font-black text-slate-800">{Math.round((stats.activeUsers / (stats.activeUsers + stats.inactiveUsers)) * 100)}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                    <span className="text-sm font-bold text-slate-600">Inactive</span>
                                </div>
                                <span className="text-sm font-black text-slate-800">{Math.round((stats.inactiveUsers / (stats.activeUsers + stats.inactiveUsers)) * 100)}%</span>
                            </div>
                        </div>
                    </section>
                </div>

                {}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {widgets.map((widget) => (
                        <Link
                            key={widget.label}
                            href={widget.href}
                            className="bg-white border border-slate-200 rounded-[2.5rem] p-6 flex flex-col justify-between hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-14 h-14 rounded-[1.5rem] ${widget.color} text-white flex items-center justify-center shadow-lg shadow-current/20`}>
                                    <i className={`fas ${widget.icon} text-2xl`}></i>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#700A0A] group-hover:text-white transition-colors">
                                    <i className="fas fa-arrow-right text-xs"></i>
                                </div>
                            </div>
                            <div>
                                <span className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{widget.label}</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-slate-800 tracking-tighter">{widget.value}</span>
                                    <span className="text-emerald-500 text-xs font-bold">
                                        <i className="fas fa-caret-up"></i> +4%
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {}
                    <Link
                        href="/admin/activity-log"
                        className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 flex items-center justify-between hover:brightness-110 transition-all group overflow-hidden relative"
                    >
                        <div className="relative z-10">
                            <span className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">System Audit</span>
                            <h3 className="text-xl font-bold text-white">Review System Integrity</h3>
                            <p className="text-slate-400 text-sm mt-1">Audit user activities and administrative changes.</p>
                        </div>
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white relative z-10 group-hover:scale-110 transition-transform">
                            <i className="fas fa-history text-2xl"></i>
                        </div>
                        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-[#700A0A]/20 blur-3xl rounded-full"></div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
