import { NextRequest, NextResponse } from 'next/server';
import db from "@/lib/db";

export async function GET() {
  const [messages]: any = await db.query(
    "SELECT * FROM support_messages ORDER BY created_at DESC"
  );
  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { alumni_id, subject, message } = data;

  const [result]: any = await db.query(
    "INSERT INTO support_messages (alumni_id, subject, message, status) VALUES (?, ?, ?, ?)",
    [alumni_id, subject, message, 'pending']
  );

  return NextResponse.json({ id: result.insertId, ...data, status: 'pending' });
}
