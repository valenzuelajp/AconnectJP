import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    const currentAlumniId = parseInt(user.id);

    try {
        const [alumniRows]: any = await db.query(
            "SELECT * FROM alumni WHERE id = ?",
            [currentAlumniId]
        );

        const alumni = alumniRows[0];

        if (!alumni) {
            return NextResponse.json({ error: "Alumni not found" }, { status: 404 });
        }

        const [employmentRows]: any = await db.query(
            "SELECT * FROM employment WHERE alumni_id = ?",
            [currentAlumniId]
        );

        const [certificationRows]: any = await db.query(
            "SELECT * FROM Certification WHERE alumni_id = ?",
            [currentAlumniId]
        );

        return NextResponse.json({
            ...alumni,
            employment: employmentRows,
            certifications: certificationRows,
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
