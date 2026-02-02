"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function PeerProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [alumnus, setAlumnus] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (id) fetchPeerProfile();
    }, [id]);

    const fetchPeerProfile = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/alumni/${id}`);
            const data = await res.json();
            if (!data.error) {
                setAlumnus(data);
            } else if (data.isOwnProfile) {
                router.push("/profile");
            }
        } catch (error) {
            console.error("Failed to fetch peer profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleConnectionAction = async (action: string) => {
        setActionLoading(true);
        try {
            const res = await fetch("/api/alumni/connection", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action,
                    targetId: parseInt(id as string),
                    requestId: alumnus.requestId,
                }),
            });
            if (res.ok) {
                fetchPeerProfile();
            }
        } catch (error) {
            console.error("Connection action failed:", error);
        } finally {
            setActionLoading(false);
        }
    };

    const getImagePath = () => {
        if (alumnus?.profile_image) return `/assets/uploads/alumni/${alumnus.profile_image}`;
        return `/assets/images/person-${alumnus?.gender?.toLowerCase() === "female" ? "female" : "male"}.png`;
    };

    if (loading || !alumnus) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B1538]"></div>
            </div>
        );
    }

    const employment = alumnus.employment?.[0] || {};

    return (
        <div className="bg-[#FAFAF8] min-h-screen font-sans pb-20 pt-10 px-4">
            <div className="max-w-[900px] mx-auto">
                {}
                <Link
                    href="/alumni"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#6B7280] hover:text-[#8B1538] mb-6 transition-colors"
                >
                    <i className="fas fa-arrow-left"></i> Back to Network
                </Link>

                {}
                <div className="bg-gradient-to-br from-[#8B1538] to-[#6B0F2A] h-[180px] rounded-t-2xl relative shadow-md overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                </div>

                {}
                <div className="bg-white p-6 md:p-10 rounded-b-2xl shadow-md relative mb-6">
                    <div className="absolute -top-[70px] left-6 md:left-10 w-[140px] h-[140px] rounded-full border-[6px] border-white shadow-xl overflow-hidden bg-white">
                        <img
                            src={getImagePath()}
                            className="w-full h-full object-cover"
                            alt="Profile"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${alumnus.first_name}+${alumnus.last_name}&background=8B1538&color=fff`;
                            }}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start pt-16 md:pt-0 md:pl-[160px] gap-6">
                        <div className="flex-grow">
                            <h1 className="text-3xl font-bold text-[#1F2937] mb-1 capitalize">
                                {alumnus.first_name} {alumnus.last_name}
                            </h1>
                            <p className="text-lg text-[#6B7280] font-medium mb-3">{alumnus.degree || "Alumni"}</p>
                            <div className="flex flex-wrap gap-5 text-sm text-[#6B7280]">
                                <span className="flex items-center gap-2">
                                    <i className="fas fa-graduation-cap text-[#D4A574]"></i> Graduated {alumnus.graduation_year || "N/A"}
                                </span>
                                <span className="flex items-center gap-2">
                                    <i className="fas fa-id-badge text-[#D4A574]"></i> Class of {alumnus.year_admitted}
                                </span>
                            </div>
                        </div>

                        {}
                        <div className="flex gap-3">
                            {alumnus.connectionStatus === "accepted" ? (
                                <button className="bg-emerald-50 text-emerald-700 px-6 py-3 rounded-xl font-bold text-sm border-2 border-emerald-100 flex items-center gap-2">
                                    <i className="fas fa-check-circle"></i> Linked
                                </button>
                            ) : alumnus.connectionStatus === "pending" ? (
                                <button
                                    disabled={actionLoading}
                                    onClick={() => handleConnectionAction("cancel_request")}
                                    className="bg-amber-50 text-amber-700 px-6 py-3 rounded-xl font-bold text-sm border-2 border-amber-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-100 transition-all flex items-center gap-2 group"
                                >
                                    <i className="fas fa-clock group-hover:hidden"></i>
                                    <span className="group-hover:hidden">Pending</span>
                                    <i className="fas fa-times hidden group-hover:block"></i>
                                    <span className="hidden group-hover:block">Cancel Request</span>
                                </button>
                            ) : alumnus.connectionStatus === "received" ? (
                                <div className="flex gap-2">
                                    <button
                                        disabled={actionLoading}
                                        onClick={() => handleConnectionAction("accept_request")}
                                        className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-sm hover:brightness-110 transition-all flex items-center gap-2"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        disabled={actionLoading}
                                        onClick={() => handleConnectionAction("decline_request")}
                                        className="bg-rose-600 text-white px-4 py-3 rounded-xl font-bold text-sm shadow-sm hover:brightness-110 transition-all"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    disabled={actionLoading}
                                    onClick={() => handleConnectionAction("send_request")}
                                    className="bg-gradient-to-br from-[#8B1538] to-[#6B0F2A] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-sm hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center gap-2"
                                >
                                    <i className="fas fa-user-plus"></i> Connect
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {}
                <div className="grid grid-cols-1 gap-6">
                    {}
                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-[#E5E7EB]">
                        <h3 className="text-xl font-bold text-[#1F2937] mb-6 pb-4 border-b-2 border-[#D4A574] flex items-center gap-3">
                            <i className="fas fa-briefcase text-[#8B1538]"></i> Career Summary
                        </h3>
                        {employment.job_title ? (
                            <div className="flex gap-6 items-start">
                                <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                                    <i className="fas fa-building"></i>
                                </div>
                                <div className="flex-grow">
                                    <h4 className="text-lg font-bold text-[#1F2937] mb-1">{employment.job_title}</h4>
                                    <p className="text-[#6B7280] mb-3">{employment.company_name}</p>
                                    <p className="text-sm text-[#4B5563] leading-relaxed line-clamp-3">
                                        {employment.job_description || "Currently pursuing professional growth in this role."}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-500 italic text-center py-4">No professional experience listed</p>
                        )}
                    </section>

                    {}
                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-[#E5E7EB]">
                        <h3 className="text-xl font-bold text-[#1F2937] mb-6 pb-4 border-b-2 border-[#D4A574] flex items-center gap-3">
                            <i className="fas fa-award text-[#8B1538]"></i> Professional Certifications
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {alumnus.certifications?.length > 0 ? (
                                alumnus.certifications.map((cert: any) => (
                                    <div key={cert.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex gap-3 mb-3">
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#D4A574] shadow-sm">
                                                <i className="fas fa-medal"></i>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-[#1F2937]">{cert.name}</h4>
                                                <p className="text-[11px] text-[#6B7280]">{cert.issuing_org}</p>
                                            </div>
                                        </div>
                                        {cert.credential_url && (
                                            <a
                                                href={cert.credential_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[10px] font-bold text-[#8B1538] uppercase tracking-widest hover:underline"
                                            >
                                                Verify Credential <i className="fas fa-external-link-alt ml-1"></i>
                                            </a>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="col-span-2 text-slate-500 italic text-center py-4">No certifications listed</p>
                            )}
                        </div>
                    </section>

                    {}
                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-[#E5E7EB]">
                        <h3 className="text-xl font-bold text-[#1F2937] mb-6 pb-4 border-b-2 border-[#D4A574] flex items-center gap-3">
                            <i className="fas fa-shapes text-[#8B1538]"></i> Areas of Expertise
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {alumnus.technical_skills ? (
                                alumnus.technical_skills.split(",").map((skill: string) => (
                                    <span
                                        key={skill}
                                        className="px-4 py-2 bg-slate-100 text-[#1F2937] rounded-xl text-xs font-bold border border-slate-200"
                                    >
                                        {skill.trim()}
                                    </span>
                                ))
                            ) : (
                                <p className="text-slate-500 italic">No expertise listed</p>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
