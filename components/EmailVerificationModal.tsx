"use client";

import { useState, useRef, useEffect } from "react";

interface EmailVerificationModalProps {
    email: string;
    isOpen: boolean;
    onClose: () => void;
    onVerified: () => void;
}

export default function EmailVerificationModal({ email, isOpen, onClose, onVerified }: EmailVerificationModalProps) {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const inputs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (isOpen) {
            inputs.current[0]?.focus();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (index: number, value: string) => {
        if (/[^0-9]/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const verificationCode = code.join("");
        if (verificationCode.length !== 6) {
            setError("Please enter the full 6-digit code.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/verify-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: verificationCode }),
            });

            const data = await res.json();

            if (data.success) {
                onVerified();
            } else {
                setError(data.error || "Verification failed. Please try again.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="bg-[#8B1538] text-white p-6 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-envelope-open-text text-2xl"></i>
                    </div>
                    <h2 className="text-xl font-bold">Verify Your Email</h2>
                    <p className="text-rose-100/80 text-sm mt-1">We've sent a 6-digit code to <br /><span className="font-semibold text-white">{email}</span></p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-between gap-2">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { inputs.current[index] = el; }}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-full h-12 text-center text-xl font-bold border-2 border-slate-100 rounded-xl focus:border-[#8B1538] focus:ring-4 focus:ring-[#8B1538]/10 outline-none transition-all"
                                />
                            ))}
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg">
                                <i className="fas fa-exclamation-circle mr-2"></i> {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#8B1538] text-white py-3 rounded-xl font-bold shadow-lg shadow-rose-200 hover:bg-[#700A0A] disabled:opacity-50 transition-all"
                        >
                            {loading ? (
                                <i className="fas fa-circle-notch animate-spin"></i>
                            ) : (
                                "Verify Account"
                            )}
                        </button>

                        <div className="text-center">
                            <p className="text-sm text-slate-500">
                                Didn't receive the code?{" "}
                                <button type="button" className="text-[#8B1538] font-bold hover:underline">Resend</button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
