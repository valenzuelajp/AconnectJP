import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "administrator") {
        redirect("/dashboard");
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#F9FAFB] pb-10">
                <main className="min-h-screen pt-6">
                    <div className="max-w-[1185px] mx-auto w-full px-[25px]">
                        {children}
                    </div>
                </main>
            </div>
        </>
    );
}
