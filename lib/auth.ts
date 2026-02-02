import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "alumni",
            name: "Alumni Login",
            credentials: {
                student_number: { label: "Student Number", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.student_number || !credentials?.password) return null;

                const [rows]: any = await db.query(
                    "SELECT * FROM alumni WHERE student_number = ?",
                    [credentials.student_number]
                );

                const user = rows[0];

                if (!user) {
                    throw new Error("Unregistered Student Number");
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) {
                    throw new Error("Invalid Password");
                }

                return {
                    id: user.id.toString(),
                    name: `${user.first_name} ${user.last_name}`,
                    email: user.email,
                    role: "alumni",
                    student_number: user.student_number
                };
            }
        }),
        CredentialsProvider({
            id: "admin",
            name: "Admin Login",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) return null;

                const [rows]: any = await db.query(
                    "SELECT * FROM admin_users WHERE username = ?",
                    [credentials.username]
                );

                const user = rows[0];

                if (!user) {
                    throw new Error("Unregistered Admin Username");
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) {
                    throw new Error("Invalid Password");
                }

                return {
                    id: user.id.toString(),
                    name: `${user.first_name} ${user.last_name}`,
                    email: user.email,
                    role: "administrator"
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
                token.student_number = (user as any).student_number;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                (session.user as any).student_number = token.student_number;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
