import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    const currentAlumniId = parseInt(user.id);

    
    const { searchParams } = new URL(request.url);
    const showPast = searchParams.get("past") === "true";

    try {
        const [eventsList]: any = await db.query(
            `SELECT * FROM events 
             WHERE event_date ${showPast ? '<' : '>='} NOW() 
             ORDER BY event_date ${showPast ? 'DESC' : 'ASC'}`
        );

        const [registrations]: any = await db.query(
            "SELECT event_id FROM event_registrations WHERE alumni_id = ?",
            [currentAlumniId]
        );

        const registeredEventIds = new Set(registrations.map((r: any) => r.event_id));

        const eventsWithStatus = eventsList.map((event: any) => ({
            ...event,
            isRegistered: registeredEventIds.has(event.id),
        }));

        return NextResponse.json(eventsWithStatus);
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
