import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "administrator") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const [posts]: any = await db.query(
            `SELECT p.*, a.first_name, a.last_name 
             FROM post p 
             LEFT JOIN admin_users a ON p.created_by = a.id 
             ORDER BY p.created_at DESC`
        );
        return NextResponse.json(posts);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "administrator") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        const post_type = formData.get("post_type") as string;
        const recipient_batch = formData.get("recipient_batch") as string;
        const file = formData.get("file") as File | null;

        let imageName: string | null = null;

        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            imageName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
            const uploadDir = path.join(process.cwd(), "public", "assets", "uploads", "post");
            const filePath = path.join(uploadDir, imageName);
            await writeFile(filePath, buffer);
        }

        const [result]: any = await db.query(
            "INSERT INTO post (title, content, post_type, image, recipient_batch, created_by) VALUES (?, ?, ?, ?, ?, ?)",
            [title, content, post_type, imageName, recipient_batch, (session.user as any).id]
        );

        const post = {
            id: result.insertId,
            title,
            content,
            post_type,
            image: imageName,
            recipient_batch,
            created_by: (session.user as any).id,
            created_at: new Date()
        };

        return NextResponse.json(post);
    } catch (error: any) {
        console.error("Post creation error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "administrator") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    try {
        await db.query("DELETE FROM post WHERE id = ?", [parseInt(id)]);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
