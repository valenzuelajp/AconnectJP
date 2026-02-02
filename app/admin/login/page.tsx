"use client";

import { useActionState, useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const adminLoginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/dashboard");
        }
    }, [status, router]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AdminLoginFormValues>({
        resolver: zodResolver(adminLoginSchema),
    });

    if (status === "loading" || status === "authenticated") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f7f7f7]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#700A0A]"></div>
            </div>
        );
    }

    const onSubmit = async (data: AdminLoginFormValues) => {
        setLoading(true);
        setError(null);

        const result = await signIn("admin", {
            username: data.username,
            password: data.password,
            redirect: false,
        });

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push("/dashboard");
            router.refresh();
        }
    };

    return (
        <div className="flex min-h-screen bg-[#f7f7f7]">
            {}
            <div className="hidden md:flex flex-1 items-center justify-center overflow-hidden bg-[#920E0E]">
                <img
                    src="/assets/images/welcome.png"
                    className="w-full h-full object-cover"
                    alt="AConnect Platform Visual"
                />
            </div>

            {}
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
                            Administrator Portal
                        </h1>
                        <p className="text-[0.95rem] text-[#6c757d]">
                            Authorized personnel session only.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded text-center text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <input
                                {...register("username")}
                                type="text"
                                placeholder="Username"
                                className={`w-full h-[48px] px-[15px] border rounded transition-all focus:border-[#700A0A] focus:ring-1 focus:ring-[#700A0A]/20 outline-none border-[#ddd] ${errors.username ? "border-red-500" : ""}`}
                            />
                            {errors.username && (
                                <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
                            )}
                        </div>

                        <div>
                            <input
                                {...register("password")}
                                type="password"
                                placeholder="Password"
                                className={`w-full h-[48px] px-[15px] border rounded transition-all focus:border-[#700A0A] focus:ring-1 focus:ring-[#700A0A]/20 outline-none border-[#ddd] ${errors.password ? "border-red-500" : ""}`}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full h-[48px] bg-[#700A0A] text-white font-semibold rounded hover:bg-[#5a0808] transition-colors disabled:opacity-70 disabled:cursor-not-allowed`}
                        >
                            {loading ? "Authenticating..." : "Login"}
                        </button>
                    </form>

                    <div className="mt-8 pt-4 border-t border-[#eee] text-center">
                        <Link href="/login" className="text-[0.9rem] text-[#6c757d] hover:text-[#700A0A] transition-colors">
                            Return to Alumni Portal
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
