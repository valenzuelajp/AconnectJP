import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    const currentAlumniId = parseInt(user.id);

    const { searchParams } = new URL(req.url);
    const friendId = searchParams.get("friendId");

    try {
        if (friendId) {
            
            const [messages]: any = await db.query(
                `SELECT * FROM messages 
                 WHERE (sender_id = ? AND receiver_id = ?) 
                 OR (sender_id = ? AND receiver_id = ?) 
                 ORDER BY sent_at ASC`,
                [currentAlumniId, parseInt(friendId), parseInt(friendId), currentAlumniId]
            );
            return NextResponse.json(messages);
        } else {
            
            const [friends]: any = await db.query(
                `SELECT id, first_name, last_name, profile_image, gender 
                 FROM alumni 
                 WHERE id IN (
                    SELECT CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END
                    FROM connections
                    WHERE (sender_id = ? OR receiver_id = ?) AND status = 'accepted'
                 )`,
                [currentAlumniId, currentAlumniId, currentAlumniId]
            );

            return NextResponse.json(friends);
        }
    } catch (error) {
        console.error("Error fetching messages/friends:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
