import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

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

async function handleImageUpload(file: File): Promise<string | null> {
    if (!file || file.size === 0) return null;

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const uploadDir = path.join(process.cwd(), "public", "assets", "uploads", "certifications");

    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (e) {
        // Directory exists
    }

    await writeFile(path.join(uploadDir, filename), buffer);
    return filename;
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const name = formData.get("name") as string;
        const issuing_org = formData.get("issuing_org") as string;
        const issue_date = formData.get("issue_date") as string;
        const expiration_date = formData.get("expiration_date") as string;
        const credential_id = formData.get("credential_id") as string;
        const credential_url = formData.get("credential_url") as string;
        const certification_image = formData.get("certification_image") as File;

        const imageName = await handleImageUpload(certification_image);

        await db.query(
            `INSERT INTO Certification (
                alumni_id, name, issuing_org, issue_date, 
                expiration_date, credential_id, credential_url, certification_image
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                parseInt((session.user as any).id),
                name,
                issuing_org,
                issue_date ? new Date(issue_date) : null,
                expiration_date ? new Date(expiration_date) : null,
                credential_id,
                credential_url,
                imageName
            ]
        );

        return NextResponse.json({ message: "Certification added" });
    } catch (error: any) {
        console.error("Error adding certification:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const id = formData.get("id") as string;
        const name = formData.get("name") as string;
        const issuing_org = formData.get("issuing_org") as string;
        const issue_date = formData.get("issue_date") as string;
        const expiration_date = formData.get("expiration_date") as string;
        const credential_id = formData.get("credential_id") as string;
        const credential_url = formData.get("credential_url") as string;
        const certification_image = formData.get("certification_image") as File;

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        let imageName = undefined;
        if (certification_image && certification_image.size > 0) {
            imageName = await handleImageUpload(certification_image);
        }

        // Build query dynamically based on whether image is updated
        let query = `UPDATE Certification SET 
            name = ?, issuing_org = ?, issue_date = ?, 
            expiration_date = ?, credential_id = ?, credential_url = ?`;

        const params: any[] = [
            name,
            issuing_org,
            issue_date ? new Date(issue_date) : null,
            expiration_date ? new Date(expiration_date) : null,
            credential_id,
            credential_url
        ];

        if (imageName) {
            query += `, certification_image = ?`;
            params.push(imageName);
        }

        query += ` WHERE id = ? AND alumni_id = ?`;
        params.push(id, parseInt((session.user as any).id));

        await db.query(query, params);

        return NextResponse.json({ message: "Certification updated" });
    } catch (error: any) {
        console.error("Error updating certification:", error);
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
