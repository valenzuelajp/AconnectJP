import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    const currentAlumniId = parseInt(user.id);
    const { eventId } = await req.json();

    try {
        
        const [existingRows]: any = await db.query(
            "SELECT id FROM event_registrations WHERE event_id = ? AND alumni_id = ? LIMIT 1",
            [eventId, currentAlumniId]
        );

        if (existingRows.length > 0) {
            return NextResponse.json({ error: "Already registered" }, { status: 400 });
        }

        await db.query(
            "INSERT INTO event_registrations (event_id, alumni_id) VALUES (?, ?)",
            [eventId, currentAlumniId]
        );

        return NextResponse.json({ message: "Registered successfully" });
    } catch (error) {
        console.error("Event registration error:", error);
        return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }
}
