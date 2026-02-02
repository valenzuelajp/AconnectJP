import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "administrator") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [rows]: any = await db.query(
      `SELECT al.*, a.first_name, a.last_name 
       FROM activity_logs al 
       LEFT JOIN alumni a ON al.alumni_id = a.id 
       ORDER BY al.created_at DESC 
       LIMIT 100`
    );

    const logs = rows.map((row: any) => ({
      ...row,
      alumni: {
        first_name: row.first_name,
        last_name: row.last_name
      }
    }));

    return NextResponse.json(logs);
  } catch (error: any) {
    console.error("Activity log API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
