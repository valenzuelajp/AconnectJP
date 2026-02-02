import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const [certifications]: any = await db.query(
            "SELECT * FROM Certification WHERE alumni_id = ? ORDER BY created_at DESC",
            [parseInt((session.user as any).id)]
        );
        return NextResponse.json(certifications);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, issuing_org, issue_date, expiration_date, credential_id, credential_url } = body;

        await db.query(
            `INSERT INTO Certification (
                alumni_id, name, issuing_org, issue_date, 
                expiration_date, credential_id, credential_url
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                parseInt((session.user as any).id),
                name,
                issuing_org,
                issue_date ? new Date(issue_date) : null,
                expiration_date ? new Date(expiration_date) : null,
                credential_id,
                credential_url
            ]
        );

        return NextResponse.json({ message: "Certification added" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        await db.query(
            "DELETE FROM Certification WHERE id = ? AND alumni_id = ?",
            [parseInt(id), parseInt((session.user as any).id)]
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
