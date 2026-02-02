import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import AdminDashboard from "@/components/AdminDashboard";

export default async function AdminDashboardPage() {
    const [eventResult]: any = await db.query("SELECT COUNT(*) as count FROM events");
    const [postResult]: any = await db.query("SELECT COUNT(*) as count FROM post");
    const [jobResult]: any = await db.query("SELECT COUNT(*) as count FROM jobs");
    const [alumniResult]: any = await db.query("SELECT COUNT(*) as count FROM alumni");
    const [adminResult]: any = await db.query("SELECT COUNT(*) as count FROM admin_users");
    const [activeResult]: any = await db.query("SELECT COUNT(*) as count FROM alumni WHERE status = 'active'");
    const [inactiveResult]: any = await db.query("SELECT COUNT(*) as count FROM alumni WHERE status = 'inactive'");

    const totalEvents = eventResult[0].count;
    const totalPosts = postResult[0].count;
    const totalJobs = jobResult[0].count;
    const totalAlumni = alumniResult[0].count;
    const totalAccounts = adminResult[0].count;
    const activeUsers = activeResult[0].count;
    const inactiveUsers = inactiveResult[0].count;

    return (
        <AdminDashboard
            stats={{
                totalEvents,
                totalPosts,
                totalJobs,
                totalAlumni,
                totalAccounts,
                activeUsers,
                inactiveUsers,
            }}
        />
    );
}
