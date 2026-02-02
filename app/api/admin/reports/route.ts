import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "administrator") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const grad_year = searchParams.get("grad_year");
  const status = searchParams.get("status");
  const date_from = searchParams.get("date_from");
  const date_to = searchParams.get("date_to");

  try {
    const [alumniByYear]: any = await db.query(
      "SELECT graduation_year, COUNT(*) as count FROM alumni GROUP BY graduation_year ORDER BY graduation_year DESC"
    );

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [activeByYear]: any = await db.query(
      "SELECT graduation_year, COUNT(*) as count FROM alumni WHERE last_login >= ? GROUP BY graduation_year",
      [thirtyDaysAgo]
    );

    const engagement_by_year = alumniByYear.map((row: any) => {
      const active = activeByYear.find((a: any) => a.graduation_year === row.graduation_year);
      return {
        graduation_year: row.graduation_year,
        total_alumni: row.count,
        active_alumni: active ? active.count : 0,
        event_registrations: 0,
        job_applications: 0
      };
    });

    
    let sql = `
      SELECT e.*, a.first_name, a.last_name, a.email, a.graduation_year 
      FROM employment e 
      LEFT JOIN alumni a ON e.alumni_id = a.id 
      WHERE 1=1
    `;
    const params: any[] = [];

    if (grad_year) {
      sql += " AND a.graduation_year = ?";
      params.push(parseInt(grad_year));
    }
    if (status) {
      sql += " AND e.employment_status = ?";
      params.push(status);
    }
    if (date_from) {
      sql += " AND e.created_at >= ?";
      params.push(new Date(date_from));
    }
    if (date_to) {
      sql += " AND e.created_at <= ?";
      params.push(new Date(date_to));
    }

    sql += " ORDER BY e.created_at DESC";

    const [rows]: any = await db.query(sql, params);

    const employment_rows = rows.map((row: any) => ({
      ...row,
      alumni: {
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email,
        graduation_year: row.graduation_year
      }
    }));

    return NextResponse.json({
      engagement_by_year,
      employment_rows
    });

  } catch (error: any) {
    console.error("Admin reports API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
