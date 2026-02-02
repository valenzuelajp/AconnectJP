import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
        return NextResponse.json({ message: "Missing token" }, { status: 400 });
    }

    try {
        const [userRows]: any = await db.query(
            "SELECT id FROM alumni WHERE verification_token = ? LIMIT 1",
            [token]
        );

        const user = userRows[0];

        if (!user) {
            return new NextResponse("Invalid or expired token.", { status: 400 });
        }

        await db.query(
            "UPDATE alumni SET email_verified = ?, status = ?, verification_token = ? WHERE id = ?",
            [true, "active", null, user.id]
        );

        
        return NextResponse.redirect(
            new URL("/login?verified=true", req.url)
        );
    } catch (error) {
        console.error("Verification error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
