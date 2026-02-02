"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const AdminSidebar = () => {
    const pathname = usePathname();

    const menuItems = [
        { label: "Overview", href: "/admin", icon: "fa-th-large" },
        { label: "Manage Accounts", href: "/admin/accounts", icon: "fa-users-cog" },
        { label: "Career Center", href: "/admin/jobs", icon: "fa-briefcase" },
        { label: "Event Manager", href: "/admin/events", icon: "fa-calendar-alt" },
        { label: "Reports & Analytics", href: "/admin/reports", icon: "fa-file-invoice-dollar" },
        { label: "Support Inbox", href: "/admin/support", icon: "fa-headset" },
        { label: "Activity Logs", href: "/admin/activity-log", icon: "fa-history" },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-200 z-[3000] hidden lg:flex flex-col">
            <div className="p-8 border-b border-slate-100 flex items-center gap-3">
                <Image
                    src="/assets/images/small_logo.png"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="h-10 w-auto"
                />
                <div>
                    <h1 className="text-lg font-black text-slate-800 leading-tight">Admin<span className="text-[#700A0A]">Portal</span></h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Management System</p>
                </div>
            </div>

            <nav className="flex-grow p-6 space-y-2 overflow-y-auto">
                <div className="px-3 mb-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Main Menu</p>
                </div>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                                    ? "bg-[#700A0A] text-white shadow-lg shadow-red-100"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                }`}
                        >
                            <span className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-300 ${isActive ? "bg-white/20" : "bg-slate-100 group-hover:bg-white"
                                }`}>
                                <i className={`fas ${item.icon} text-lg`}></i>
                            </span>
                            <span className="text-sm font-bold tracking-tight">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-slate-100">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-all text-sm font-bold"
                >
                    <i className="fas fa-arrow-left"></i>
                    Back to Platform
                </Link>
            </div>
        </aside>
    );
};

export default AdminSidebar;
