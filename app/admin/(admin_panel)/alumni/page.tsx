import db from "@/lib/db";
import AlumniList from "@/components/AlumniList";

export default async function AdminAlumniPage() {
    const [alumni]: any = await db.query("SELECT * FROM alumni ORDER BY created_at DESC");

    return (
        <div className="bg-white min-h-screen">
            { }
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

            { }
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

            { }
            <AlumniList initialAlumni={alumni} />
        </div>
    );
}
