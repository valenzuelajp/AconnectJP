import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "administrator") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [events]: any = await db.query("SELECT * FROM events ORDER BY event_date DESC");
  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "administrator") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { event_name, event_date, event_time_duration, location, contact_person, description } = body;

  try {
    const [result]: any = await db.query(
      "INSERT INTO events (event_name, event_date, event_time_duration, location, contact_person, description) VALUES (?, ?, ?, ?, ?, ?)",
      [event_name, new Date(event_date), event_time_duration, location, contact_person, description]
    );

    return NextResponse.json({ id: result.insertId, ...body });
  } catch (error: any) {
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
    await db.query("DELETE FROM events WHERE id = ?", [parseInt(id)]);
    return NextResponse.json({ success: true });
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
  const { event_name, event_date, event_time_duration, location, contact_person, description } = body;

  try {
    let sql = "UPDATE events SET id = id";
    const params: any[] = [];

    if (event_name) { sql += ", event_name = ?"; params.push(event_name); }
    if (event_date) { sql += ", event_date = ?"; params.push(new Date(event_date)); }
    if (event_time_duration) { sql += ", event_time_duration = ?"; params.push(event_time_duration); }
    if (location) { sql += ", location = ?"; params.push(location); }
    if (contact_person) { sql += ", contact_person = ?"; params.push(contact_person); }
    if (description) { sql += ", description = ?"; params.push(description); }

    sql += " WHERE id = ?";
    params.push(parseInt(id));

    await db.query(sql, params);
    return NextResponse.json({ success: true, id, ...body });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
