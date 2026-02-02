import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import AlumniDashboard from "@/components/AlumniDashboard";
import AdminDashboard from "@/components/AdminDashboard";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/login");
    }

    const user = session.user as any;

    if (user.role === "administrator") {
        const [eventResult]: any = await db.query("SELECT COUNT(*) as count FROM events");
        const [postResult]: any = await db.query("SELECT COUNT(*) as count FROM post");
        const [jobResult]: any = await db.query("SELECT COUNT(*) as count FROM jobs");
        const [alumniResult]: any = await db.query("SELECT COUNT(*) as count FROM alumni");
        const [adminResult]: any = await db.query("SELECT COUNT(*) as count FROM admin_users");
        const [activeResult]: any = await db.query("SELECT COUNT(*) as count FROM alumni WHERE status = 'active'");
        const [inactiveResult]: any = await db.query("SELECT COUNT(*) as count FROM alumni WHERE status = 'inactive'");

        return (
            <AdminDashboard
                stats={{
                    totalEvents: eventResult[0].count,
                    totalPosts: postResult[0].count,
                    totalJobs: jobResult[0].count,
                    totalAlumni: alumniResult[0].count,
                    totalAccounts: adminResult[0].count,
                    activeUsers: activeResult[0].count,
                    inactiveUsers: inactiveResult[0].count,
                }}
            />
        );
    }

    return <AlumniDashboard />;
}
