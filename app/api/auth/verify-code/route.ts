import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { email, code } = await req.json();

        if (!email || !code) {
            return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
        }

        const [rows]: any = await db.query(
            "SELECT id FROM alumni WHERE email = ? AND verification_token = ?",
            [email, code]
        );

        if (rows.length === 0) {
            return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
        }

        await db.query(
            "UPDATE alumni SET email_verified = true, verification_token = null, status = 'active' WHERE email = ?",
            [email]
        );

        return NextResponse.json({ success: true, message: "Email verified successfully!" });
    } catch (error: any) {
        console.error("Verification error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
