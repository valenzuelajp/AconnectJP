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
        const [alumniList]: any = await db.query(
            `SELECT id, first_name, last_name, degree, graduation_year, 
                    profile_image, gender, current_job, email, technical_skills 
             FROM alumni 
             WHERE id != ? AND status = 'active'`,
            [currentAlumniId]
        );


        const [requests]: any = await db.query(
            "SELECT * FROM connection_requests WHERE sender_id = ? OR receiver_id = ?",
            [currentAlumniId, currentAlumniId]
        );

        const [connections]: any = await db.query(
            "SELECT * FROM connections WHERE sender_id = ? OR receiver_id = ?",
            [currentAlumniId, currentAlumniId]
        );


        const formattedAlumni = alumniList.map((alumnus) => {
            let connectionStatus = "connectable";
            let requestId: any = null;
            let senderId: any = null;

            const request = requests.find(
                (r: any) =>
                    (r.sender_id === currentAlumniId && r.receiver_id === alumnus.id) ||
                    (r.sender_id === alumnus.id && r.receiver_id === currentAlumniId)
            );

            const connection = connections.find(
                (c: any) =>
                    (c.sender_id === currentAlumniId && c.receiver_id === alumnus.id) ||
                    (c.sender_id === alumnus.id && c.receiver_id === currentAlumniId)
            );

            if (connection && connection.status === "accepted") {
                connectionStatus = "accepted";
            } else if (request && request.status === "pending") {
                connectionStatus = "pending";
                requestId = request.id;
                senderId = request.sender_id;
            }

            return {
                ...alumnus,
                connectionStatus,
                requestId,
                senderId,
            };
        });

        return NextResponse.json(formattedAlumni);
    } catch (error) {
        console.error("Error fetching alumni:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
