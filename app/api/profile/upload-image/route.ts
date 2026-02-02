import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name.replace(/\s+/g, "_")}`;
        const uploadDir = path.join(process.cwd(), "public", "assets", "uploads", "alumni");

        // Ensure directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) { }

        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);

        // Update database
        await db.query(
            "UPDATE alumni SET profile_image = ? WHERE id = ?",
            [fileName, userId]
        );

        return NextResponse.json({
            success: true,
            message: "Profile picture updated",
            profile_image: fileName
        });
    } catch (error: any) {
        console.error("Profile image upload error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
