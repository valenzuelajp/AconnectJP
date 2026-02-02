import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { computeAiMatch } from "@/lib/ai-matcher";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const location = searchParams.get("location") || "";

    const user = session.user as any;
    const currentAlumniId = parseInt(user.id);

    try {
        const [alumniRows]: any = await db.query(
            "SELECT * FROM alumni WHERE id = ?",
            [currentAlumniId]
        );

        const alumni = alumniRows[0];

        const [jobsList]: any = await db.query(
            `SELECT * FROM jobs 
             WHERE (job_title LIKE ? OR company LIKE ?) 
             AND location LIKE ? 
             ORDER BY created_at DESC`,
            [`%${search}%`, `%${search}%`, `%${location}%`]
        );

        const jobsWithMatch = jobsList.map((job: any) => ({
            ...job,
            matchScore: computeAiMatch(alumni, job),
        }));

        return NextResponse.json(jobsWithMatch);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
