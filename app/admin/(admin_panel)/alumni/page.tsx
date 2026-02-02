import db from "@/lib/db";
import Image from "next/image";
import Link from "next/link";

export default async function AdminAlumniPage() {
    const [alumni]: any = await db.query("SELECT * FROM alumni ORDER BY created_at DESC");

    return (
        <div className="bg-white min-h-screen">
            {}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#8B1538] flex items-center gap-2">
                    Alumni Management
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    Maintain and verify alumni records and professional profiles.
                </p>
                <div className="flex justify-end mt-4">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors">
                        <i className="fas fa-sync-alt"></i> Sync Database
                    </button>
                </div>
            </div>

            {}
            <div className="bg-[#F9FAFB] p-4 rounded-xl mb-6 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="flex-1 relative">
                    <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                        type="text"
                        placeholder="Find by name, student ID, or batch..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#8B1538] text-sm"
                    />
                </div>
                <button className="bg-[#700A0A] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#5a0808] transition-colors">
                    Search
                </button>
            </div>

            {}
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
                                                        src={alum.profile_image}
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
                                        <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-400 hover:text-[#8B1538] hover:border-[#8B1538] transition-all bg-white shadow-sm">
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
        </div>
    );
}
