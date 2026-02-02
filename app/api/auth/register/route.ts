import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            first_name,
            last_name,
            email,
            password,
            phone,
            telephone,
            alternative_email,
            graduation_year,
            student_number,
            degree,
            gender,
            degree_other,
        } = body;

        
        const [existingUserRows]: any = await db.query(
            "SELECT id FROM alumni WHERE email = ? OR student_number = ? LIMIT 1",
            [email, student_number]
        );

        if (existingUserRows.length > 0) {
            return NextResponse.json(
                { message: "Email or Student Number already registered" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const token = crypto.randomBytes(32).toString("hex");
        const finalDegree = degree === "Other" ? degree_other : degree;

        await db.query(
            `INSERT INTO alumni (
                first_name, last_name, email, password, phone, telephone, 
                alternative_email, graduation_year, student_number, degree, 
                gender, status, email_verified, verification_token, year_admitted
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                first_name,
                last_name,
                email,
                hashedPassword,
                phone,
                telephone,
                alternative_email,
                graduation_year ? parseInt(graduation_year) : null,
                student_number,
                finalDegree,
                gender,
                "active",
                true,
                null,
                0 
            ]
        );

        
        

        return NextResponse.json(
            { message: "Registration successful! You may now log in." },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
