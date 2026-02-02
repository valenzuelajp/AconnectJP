import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "administrator") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [jobs]: any = await db.query("SELECT * FROM jobs ORDER BY created_at DESC");
  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "administrator") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const { job_title, company, description, location, salary_range, qualifications, contact_details } = data;

  try {
    const [result]: any = await db.query(
      "INSERT INTO jobs (job_title, company, description, location, salary_range, qualifications, contact_details, posted_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [job_title, company, description, location, salary_range, qualifications, contact_details, (session.user as any).id]
    );

    return NextResponse.json({ id: result.insertId, ...data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "administrator") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  let id = searchParams.get("id");

  if (!id) {
    try {
      const body = await req.json();
      id = body.id;
    } catch { }
  }

  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  try {
    await db.query("DELETE FROM jobs WHERE id = ?", [parseInt(id as string)]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "administrator") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const { id, job_title, company, description, location, salary_range, qualifications, contact_details } = data;

  try {
    await db.query(
      `UPDATE jobs SET 
        job_title = ?, company = ?, description = ?, location = ?, 
        salary_range = ?, qualifications = ?, contact_details = ?, updated_by = ?, updated_at = NOW()
       WHERE id = ?`,
      [job_title, company, description, location, salary_range, qualifications, contact_details, (session.user as any).id, id]
    );

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
