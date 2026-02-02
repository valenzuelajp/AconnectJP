import { NextRequest, NextResponse } from 'next/server';
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
      `SELECT sm.*, a.first_name, a.last_name, a.email 
       FROM support_messages sm 
       LEFT JOIN alumni a ON sm.sender_id = a.id 
       ORDER BY sm.created_at DESC`
    );

    const messages = rows.map((row: any) => ({
      ...row,
      alumni: {
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email
      }
    }));

    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "administrator") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  const body = await request.json();
  const { status } = body;

  try {
    await db.query(
      "UPDATE support_messages SET status = ? WHERE id = ?",
      [status, parseInt(id)]
    );
    return NextResponse.json({ success: true, id, status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
