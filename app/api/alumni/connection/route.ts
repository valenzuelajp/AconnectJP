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
    const { action, targetId, requestId } = await req.json();

    try {
        switch (action) {
            case "send_request":
                await db.query(
                    "INSERT INTO connection_requests (sender_id, receiver_id, status) VALUES (?, ?, ?)",
                    [currentAlumniId, targetId, "pending"]
                );
                return NextResponse.json({ message: "Request sent" });

            case "cancel_request":
                await db.query(
                    "DELETE FROM connection_requests WHERE sender_id = ? AND receiver_id = ? AND status = 'pending'",
                    [currentAlumniId, targetId]
                );
                return NextResponse.json({ message: "Request canceled" });

            case "accept_request":
                
                await db.query(
                    "INSERT INTO connections (sender_id, receiver_id, status) VALUES (?, ?, ?)",
                    [targetId, currentAlumniId, "accepted"]
                );
                
                await db.query(
                    "DELETE FROM connection_requests WHERE id = ?",
                    [requestId]
                );
                return NextResponse.json({ message: "Request accepted" });

            case "decline_request":
                await db.query(
                    "DELETE FROM connection_requests WHERE id = ?",
                    [requestId]
                );
                return NextResponse.json({ message: "Request declined" });

            case "remove_connection":
                await db.query(
                    `DELETE FROM connections 
                     WHERE (sender_id = ? AND receiver_id = ?) 
                     OR (sender_id = ? AND receiver_id = ?)`,
                    [currentAlumniId, targetId, targetId, currentAlumniId]
                );
                return NextResponse.json({ message: "Connection removed" });

            default:
                return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }
    } catch (error) {
        console.error("Connection action error:", error);
        return NextResponse.json({ error: "Action failed" }, { status: 500 });
    }
}
