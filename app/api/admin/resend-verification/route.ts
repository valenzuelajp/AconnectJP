import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "administrator") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { alumniId } = await request.json();

        // Get alumni details
        const [alumni]: any = await db.query(
            "SELECT * FROM alumni WHERE id = ?",
            [alumniId]
        );

        if (!alumni || alumni.length === 0) {
            return NextResponse.json({ error: "Alumni not found" }, { status: 404 });
        }

        const alum = alumni[0];

        // Check if already verified
        if (alum.email_verified) {
            return NextResponse.json({ error: "This account is already verified" }, { status: 400 });
        }

        // Generate new verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Update verification token in database
        await db.query(
            "UPDATE alumni SET verification_token = ? WHERE id = ?",
            [verificationCode, alumniId]
        );

        // Send verification email
        await sendVerificationEmail(alum.email, verificationCode);

        console.log(`✓ Verification email resent to: ${alum.email}`);

        return NextResponse.json({
            success: true,
            message: `Verification email sent to ${alum.email}`
        });
    } catch (error: any) {
        console.error("Error resending verification email:", error);
        return NextResponse.json({ error: error.message || "Failed to send email" }, { status: 500 });
    }
}
