import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "administrator") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const [photos]: any = await db.query(
            "SELECT * FROM carousel_photos ORDER BY uploaded_at DESC"
        );
        return NextResponse.json(photos);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "administrator") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
        const uploadDir = path.join(process.cwd(), "public", "assets", "uploads", "carousel");
        const filePath = path.join(uploadDir, fileName);

        await writeFile(filePath, buffer);

        const [result]: any = await db.query(
            "INSERT INTO carousel_photos (title, description, file_name) VALUES (?, ?, ?)",
            [title, description, fileName]
        );

        return NextResponse.json({
            id: result.insertId,
            title,
            description,
            file_name: fileName,
            uploaded_at: new Date()
        });
    } catch (error: any) {
        console.error("Carousel upload error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "administrator") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    try {
        
        await db.query("DELETE FROM carousel_photos WHERE id = ?", [parseInt(id)]);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
