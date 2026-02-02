import { NextResponse } from "next/server";
import db from "@/lib/db";
import { transporter } from "@/lib/email";

export const dynamic = "force-dynamic";

const MAX_ATTEMPTS = 3;

export async function GET(request: Request) {
    
    const authHeader = request.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const [emails]: any = await db.query(
            `SELECT * FROM email_queue 
             WHERE status = 'pending' 
             AND (send_after IS NULL OR send_after <= NOW()) 
             ORDER BY created_at ASC 
             LIMIT 20`
        );

        if (emails.length === 0) {
            return NextResponse.json({ message: "No pending emails" });
        }

        const results = [];

        for (const email of emails) {
            try {
                await transporter.sendMail({
                    from: `"AConnect Alumni System" <${process.env.EMAIL_USER}>`,
                    to: email.recipient,
                    subject: email.subject,
                    html: email.body,
                });

                await db.query(
                    "UPDATE email_queue SET status = 'sent' WHERE id = ?",
                    [email.id]
                );

                results.push({ id: email.id, status: "sent" });
            } catch (error: any) {
                const updatedAttempts = (email.attempts || 0) + 1;
                let updateSql = "UPDATE email_queue SET attempts = ?";
                const params = [updatedAttempts];

                if (updatedAttempts >= MAX_ATTEMPTS) {
                    updateSql += ", status = 'failed'";
                } else {
                    const delay = Math.pow(2, updatedAttempts); 
                    
                    updateSql += ", send_after = DATE_ADD(NOW(), INTERVAL ? MINUTE)";
                    params.push(delay);
                }

                updateSql += " WHERE id = ?";
                params.push(email.id);

                await db.query(updateSql, params);

                results.push({ id: email.id, status: "error", error: error.message });
            }
        }

        return NextResponse.json({
            message: `Processed ${emails.length} emails`,
            results
        });

    } catch (error: any) {
        console.error("Email worker error:", error);
        return NextResponse.json({ message: "Worker failed", error: error.message }, { status: 500 });
    }
}
