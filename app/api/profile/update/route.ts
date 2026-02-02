import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    const currentAlumniId = parseInt(user.id);
    const data = await req.json();

    try {
        const { type, ...payload } = data;

        if (type === "basic") {
            await db.query(
                `UPDATE alumni SET 
                    first_name = ?, last_name = ?, degree = ?, 
                    graduation_year = ?, year_admitted = ?, phone = ?, 
                    alternative_phone = ?, email = ?, alternative_email = ? 
                 WHERE id = ?`,
                [
                    payload.first_name,
                    payload.last_name,
                    payload.degree,
                    payload.graduation_year ? parseInt(payload.graduation_year) : null,
                    payload.year_admitted ? parseInt(payload.year_admitted) : 0,
                    payload.phone,
                    payload.alternative_phone,
                    payload.email,
                    payload.alternative_email,
                    currentAlumniId
                ]
            );
        } else if (type === "employment") {
            const [existingRows]: any = await db.query(
                "SELECT id FROM employment WHERE alumni_id = ? LIMIT 1",
                [currentAlumniId]
            );

            if (existingRows.length > 0) {
                await db.query(
                    `UPDATE employment SET 
                        employment_status = ?, job_title = ?, company_name = ?, 
                        job_description = ?, year_of_service = ?, promotion_count = ? 
                     WHERE id = ?`,
                    [
                        payload.employment_status,
                        payload.job_title,
                        payload.company_name,
                        payload.job_description,
                        payload.year_of_service ? parseInt(payload.year_of_service) : 0,
                        payload.promotion_count ? parseInt(payload.promotion_count) : 0,
                        existingRows[0].id
                    ]
                );
            } else {
                await db.query(
                    `INSERT INTO employment (
                        alumni_id, employment_status, job_title, company_name, 
                        job_description, year_of_service, promotion_count
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [
                        currentAlumniId,
                        payload.employment_status,
                        payload.job_title,
                        payload.company_name,
                        payload.job_description,
                        payload.year_of_service ? parseInt(payload.year_of_service) : 0,
                        payload.promotion_count ? parseInt(payload.promotion_count) : 0
                    ]
                );
            }
        } else if (type === "skills") {
            await db.query(
                "UPDATE alumni SET soft_skills = ?, technical_skills = ? WHERE id = ?",
                [
                    Array.isArray(payload.soft_skills) ? payload.soft_skills.join(",") : payload.soft_skills,
                    Array.isArray(payload.technical_skills) ? payload.technical_skills.join(",") : payload.technical_skills,
                    currentAlumniId
                ]
            );
        }

        return NextResponse.json({ status: "success" });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}
