"use client";

import db from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ConfirmModal from "@/components/ConfirmModal";
import SuccessModal from "@/components/SuccessModal";

interface AlumniListProps {
    initialAlumni: any[];
}

export default function AlumniList({ initialAlumni }: AlumniListProps) {
    const [alumni, setAlumni] = useState(initialAlumni);
    const [selectedAlumni, setSelectedAlumni] = useState<any>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showResendConfirm, setShowResendConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState<{ show: boolean, message: string }>({ show: false, message: "" });
    const [isResending, setIsResending] = useState(false);

    const viewAlumniDetails = (alum: any) => {
        setSelectedAlumni(alum);
        setShowDetailModal(true);
    };

    const handleResendEmail = async () => {
        if (!selectedAlumni) return;

        setIsResending(true);
        try {
            const res = await fetch("/api/admin/resend-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ alumniId: selectedAlumni.id })
            });

            const data = await res.json();

            if (res.ok) {
                setShowResendConfirm(false);
                setShowSuccess({ show: true, message: data.message || "Verification email sent successfully!" });
            } else {
                alert(`Error: ${data.error || "Failed to send email"}`);
            }
        } catch (error) {
            console.error("Error resending email:", error);
            alert("Failed to send verification email. Please try again.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 bg-white">
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Alumni</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Student ID</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Academic Detail</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Batch</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {alumni.map((alum: any) => (
                                <tr key={alum.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative border border-gray-100">
                                                {alum.profile_image ? (
                                                    <Image
                                                        src={`/assets/uploads/alumni/${alum.profile_image}`}
                                                        alt={`${alum.first_name} ${alum.last_name}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <i className="fas fa-user text-sm"></i>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800 text-sm">
                                                    {alum.first_name} {alum.last_name}
                                                </div>
                                                <div className="text-xs text-gray-400">{alum.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#8B1538] font-medium font-mono">
                                        {alum.student_number || "N/A"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-700">{alum.degree || "N/A"}</div>
                                        <div className="text-xs text-gray-400">{alum.school || "N/A"}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {alum.graduation_year || "N/A"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${alum.email_verified
                                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                            : "bg-amber-50 text-amber-600 border-amber-100"
                                            }`}>
                                            {alum.email_verified ? "Verified" : "Pending"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => viewAlumniDetails(alum)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-400 hover:text-[#8B1538] hover:border-[#8B1538] transition-all bg-white shadow-sm"
                                        >
                                            <i className="fas fa-eye text-xs"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {alumni.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center">
                                            <i className="fas fa-users text-4xl mb-3 text-gray-200"></i>
                                            <span className="text-sm">No alumni records found</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Alumni Detail Modal */}
            {showDetailModal && selectedAlumni && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-br from-[#8B1538] to-[#6B0F2A] text-white p-6 flex justify-between items-center sticky top-0">
                            <h3 className="text-xl font-bold">Alumni Details</h3>
                            <button onClick={() => setShowDetailModal(false)} className="text-2xl hover:opacity-75">
                                &times;
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            {/* Profile Section */}
                            <div className="flex items-center gap-6 pb-6 border-b">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#8B1538]/20">
                                    {selectedAlumni.profile_image ? (
                                        <img
                                            src={`/assets/uploads/alumni/${selectedAlumni.profile_image}`}
                                            alt={`${selectedAlumni.first_name} ${selectedAlumni.last_name}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <i className="fas fa-user text-4xl text-gray-400"></i>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-2xl font-bold text-gray-900">
                                        {selectedAlumni.first_name} {selectedAlumni.middle_name || ''} {selectedAlumni.last_name}
                                    </h4>
                                    <p className="text-gray-600">{selectedAlumni.email}</p>
                                    <p className="text-sm text-[#8B1538] font-mono font-bold">{selectedAlumni.student_number}</p>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Phone</label>
                                    <p className="text-gray-900">{selectedAlumni.phone || "N/A"}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Alternative Email</label>
                                    <p className="text-gray-900">{selectedAlumni.alternative_email || "N/A"}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Degree</label>
                                    <p className="text-gray-900">{selectedAlumni.degree || "N/A"}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Graduation Year</label>
                                    <p className="text-gray-900">{selectedAlumni.graduation_year || "N/A"}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Gender</label>
                                    <p className="text-gray-900 capitalize">{selectedAlumni.gender || "N/A"}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Status</label>
                                    <p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedAlumni.email_verified
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-amber-100 text-amber-700"
                                            }`}>
                                            {selectedAlumni.email_verified ? "Verified" : "Pending Verification"}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Current Job */}
                            {selectedAlumni.current_job && (
                                <div className="pt-4 border-t">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Current Position</label>
                                    <p className="text-gray-900 text-lg">{selectedAlumni.current_job}</p>
                                </div>
                            )}

                            {/* Resend Verification Button */}
                            {!selectedAlumni.email_verified && (
                                <div className="pt-6 border-t">
                                    <button
                                        onClick={() => setShowResendConfirm(true)}
                                        disabled={isResending}
                                        className="w-full bg-gradient-to-r from-[#8B1538] to-[#6B0F2A] text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <i className="fas fa-envelope"></i>
                                        {isResending ? "Sending..." : "Resend Verification Email"}
                                    </button>
                                    <p className="text-xs text-gray-500 text-center mt-2">
                                        Send a new verification code to {selectedAlumni.email}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal for Resend */}
            <ConfirmModal
                isOpen={showResendConfirm}
                title="Resend Verification Email"
                message={`Are you sure you want to send a new verification email to ${selectedAlumni?.email}? A new 6-digit code will be generated and sent.`}
                confirmText="Send Email"
                cancelText="Cancel"
                type="info"
                onConfirm={handleResendEmail}
                onCancel={() => setShowResendConfirm(false)}
            />

            {/* Success Modal */}
            <SuccessModal
                isOpen={showSuccess.show}
                title="Email Sent!"
                message={showSuccess.message}
                onClose={() => setShowSuccess({ show: false, message: "" })}
            />
        </>
    );
}
