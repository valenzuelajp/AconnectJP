"use client";

import { useActionState, useEffect, useState, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SubmitButton } from "@/components/SubmitButton";

function LoginForm() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/dashboard");
        }
    }, [status, router]);

    const verified = searchParams.get("verified");

    async function loginHandler(prevState: any, formData: FormData) {
        const student_number = formData.get("student_number") as string;
        const password = formData.get("password") as string;

        if (!student_number || !password) {
            return { error: "Student number and password are required" };
        }

        const result = await signIn("alumni", {
            student_number,
            password,
            redirect: false,
        });

        if (result?.error) {
            return { error: result.error };
        } else {
            router.push("/dashboard");
            router.refresh();
            return { success: true };
        }
    }

    const [state, action] = useActionState(loginHandler, null);

    if (status === "loading" || status === "authenticated") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f7f7f7]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#700A0A]"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#f7f7f7]">
            <div className="hidden md:flex flex-1 items-center justify-center overflow-hidden bg-[#920E0E]">
                <img
                    src="/assets/images/welcome.png"
                    className="w-full h-full object-cover"
                    alt="AConnect Platform Visual"
                />
            </div>

            <div className="flex flex-1 flex-col items-center justify-center p-8 bg-white">
                <div className="w-full max-w-[350px]">
                    <div className="text-center mb-2">
                        <img
                            src="/assets/images/logo.png"
                            alt="AConnect Logo"
                            className="mx-auto max-w-[200px] h-auto"
                        />
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-[1.8rem] font-bold text-[#333] mb-2 leading-tight">
                            AConnect: Alumni & Career Platform
                        </h1>
                        <p className="text-[0.95rem] text-[#6c757d]">
                            Connect with your fellow alumni and unlock exclusive career opportunities. Sign in to continue your journey.
                        </p>
                    </div>

                    {state?.error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded text-center text-sm">
                            {state.error}
                        </div>
                    )}

                    <form action={action} className="space-y-4">
                        <div>
                            <input
                                name="student_number"
                                type="text"
                                placeholder="Student Number"
                                className={`w-full h-[48px] px-[15px] border rounded transition-all focus:border-[#700A0A] focus:ring-1 focus:ring-[#700A0A]/20 outline-none border-[#ddd]`}
                                required
                            />
                        </div>

                        <div>
                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                className={`w-full h-[48px] px-[15px] border rounded transition-all focus:border-[#700A0A] focus:ring-1 focus:ring-[#700A0A]/20 outline-none border-[#ddd]`}
                                required
                            />
                        </div>

                        <div className="flex items-center text-[0.9rem]">
                            <input
                                type="checkbox"
                                id="remember"
                                name="remember"
                                className="mr-2 w-4 h-4 cursor-pointer"
                            />
                            <label htmlFor="remember" className="cursor-pointer text-[#333]">Keep me signed in</label>
                        </div>

                        <SubmitButton>Log in to AConnect</SubmitButton>
                    </form>

                    <div className="mt-8 pt-4 border-t border-[#eee] text-center">
                        <p className="text-[0.9rem] text-[#6c757d]">
                            New to AConnect?{" "}
                            <Link href="/register" className="text-[#700A0A] font-semibold hover:underline">
                                Create an Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-[#f7f7f7]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#700A0A]"></div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
