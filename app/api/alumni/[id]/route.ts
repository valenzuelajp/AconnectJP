import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const currentUserId = parseInt((session.user as any).id);

    try {
        const [alumnusRows]: any = await db.query(
            "SELECT * FROM alumni WHERE id = ?",
            [parseInt(id)]
        );

        const alumnus = alumnusRows[0];

        if (!alumnus) {
            return NextResponse.json({ error: "Alumni not found" }, { status: 404 });
        }

        const [employmentRows]: any = await db.query(
            "SELECT * FROM employment WHERE alumni_id = ?",
            [parseInt(id)]
        );

        const [certificationRows]: any = await db.query(
            "SELECT * FROM Certification WHERE alumni_id = ? ORDER BY created_at DESC",
            [parseInt(id)]
        );

        alumnus.employment = employmentRows;
        alumnus.certifications = certificationRows;

        
        const [sentRequestRows]: any = await db.query(
            "SELECT id FROM connection_requests WHERE sender_id = ? AND receiver_id = ? LIMIT 1",
            [currentUserId, parseInt(id)]
        );

        const [receivedRequestRows]: any = await db.query(
            "SELECT id FROM connection_requests WHERE sender_id = ? AND receiver_id = ? LIMIT 1",
            [parseInt(id), currentUserId]
        );

        const [connectionRows]: any = await db.query(
            `SELECT id FROM connections 
             WHERE (sender_id = ? AND receiver_id = ?) 
             OR (sender_id = ? AND receiver_id = ?) LIMIT 1`,
            [currentUserId, parseInt(id), parseInt(id), currentUserId]
        );

        const sentRequest = sentRequestRows[0];
        const receivedRequest = receivedRequestRows[0];
        const connection = connectionRows[0];

        let connectionStatus = "connectable";
        let requestId = null;

        if (connection) {
            connectionStatus = "accepted";
        } else if (sentRequest) {
            connectionStatus = "pending";
            requestId = sentRequest.id;
        } else if (receivedRequest) {
            connectionStatus = "received";
            requestId = receivedRequest.id;
        }

        return NextResponse.json({
            ...alumnus,
            connectionStatus,
            requestId,
            isOwnProfile: currentUserId === parseInt(id)
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
