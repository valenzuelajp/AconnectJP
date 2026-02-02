"use server";

import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
    student_number: z.string().min(1, "Student number is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    alternative_email: z.string().email("Invalid alternate email address"),
    phone: z.string().min(1, "Phone number is required"),
    telephone: z.string().optional(),
    graduation_year: z.string().min(1, "Graduation year is required"),
    degree: z.string().min(1, "Degree is required"),
    degree_other: z.string().optional(),
    gender: z.string().min(1, "Gender is required"),
});

export async function registerAction(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());

    const validatedFields = registerSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Register.",
        };
    }

    const {
        student_number,
        password,
        first_name,
        last_name,
        email,
        alternative_email,
        phone,
        telephone,
        graduation_year,
        degree,
        degree_other,
        gender
    } = validatedFields.data;

    try {
        const [existingUsers]: any = await db.query(
            "SELECT id FROM alumni WHERE email = ? OR student_number = ? LIMIT 1",
            [email, student_number]
        );

        if (existingUsers.length > 0) {
            return {
                message: "User with this email or student number already exists.",
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const yearAdmitted = parseInt(student_number.split('-')[0]) || 2000;
        const finalDegree = degree === "Other" ? degree_other : degree;

        await db.query(
            `INSERT INTO alumni (
                student_number, password, first_name, last_name, email, 
                alternative_email, phone, telephone, graduation_year, 
                degree, gender, year_admitted, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                student_number, hashedPassword, first_name, last_name, email,
                alternative_email, phone, telephone || null, parseInt(graduation_year),
                finalDegree, gender.toLowerCase(), yearAdmitted, "inactive"
            ]
        );

        return {
            success: true,
            message: "Registration successful! Redirecting to login...",
        };
    } catch (error) {
        console.error("Registration error:", error);
        return {
            message: "Database Error: Failed to Create Account.",
        };
    }
}
