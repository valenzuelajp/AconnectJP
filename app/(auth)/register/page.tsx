"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { registerAction } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";
import EmailVerificationModal from "@/components/EmailVerificationModal";

export default function RegisterPage() {
    const router = useRouter();
    const [state, action] = useActionState(registerAction, null);
    const [selectedDegree, setSelectedDegree] = useState("");

    useEffect(() => {
        const s = state as any;
        if (s?.success) {
            // Redirect directly to login on success
            router.push("/login?verified=true");
        }
    }, [state, router]);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 16 }, (_, i) => (currentYear + 5 - i).toString());

    return (
        <div className="flex min-h-screen bg-[#f7f7f7]">
            <div className="hidden md:flex flex-[0_0_50%] items-center justify-center overflow-hidden bg-[#920E0E]">
                <img
                    src="/assets/images/circles.png"
                    className="w-full h-full object-cover"
                    alt="AConnect Platform Visual"
                />
            </div>

            <div className="flex flex-[0_0_50%] flex-col items-center justify-start p-8 bg-white overflow-y-auto max-h-screen">
                <div className="w-full max-w-[450px]">
                    <div className="text-center mb-2">
                        <img
                            src="/assets/images/logo.png"
                            alt="AConnect Logo"
                            className="mx-auto max-w-[150px] h-auto"
                        />
                    </div>

                    <h1 className="text-[1.6rem] font-bold text-[#333] text-center mb-6">
                        Create Your AConnect Profile
                    </h1>

                    {state?.success && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded text-sm text-center">
                            {state.message}
                        </div>
                    )}

                    {state?.message && !state?.success && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded text-sm text-center">
                            {state.message}
                        </div>
                    )}

                    <form action={action} className="space-y-3 pb-8">
                        <div className="grid grid-cols-1 gap-3">
                            <div>
                                <input
                                    name="student_number"
                                    type="text"
                                    placeholder="Student Number (e.g., 2017-00001)"
                                    className={`w-full h-[40px] px-[15px] border rounded outline-none focus:border-[#700A0A] focus:ring-1 focus:ring-[#700A0A]/20 ${state?.error?.student_number ? 'border-red-500' : 'border-[#ddd]'}`}
                                    required
                                />
                                {state?.error?.student_number && <p className="text-red-500 text-xs mt-1">{state.error.student_number[0]}</p>}
                            </div>

                            <div>
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    className={`w-full h-[40px] px-[15px] border rounded outline-none focus:border-[#700A0A] focus:ring-1 focus:ring-[#700A0A]/20 ${state?.error?.password ? 'border-red-500' : 'border-[#ddd]'}`}
                                    required
                                />
                                {state?.error?.password && <p className="text-red-500 text-xs mt-1">{state.error.password[0]}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <input
                                        name="first_name"
                                        type="text"
                                        placeholder="First Name"
                                        className={`w-full h-[40px] px-[15px] border rounded outline-none focus:border-[#700A0A] focus:ring-1 focus:ring-[#700A0A]/20 ${state?.error?.first_name ? 'border-red-500' : 'border-[#ddd]'}`}
                                        required
                                    />
                                    {state?.error?.first_name && <p className="text-red-500 text-xs mt-1">{state.error.first_name[0]}</p>}
                                </div>
                                <div>
                                    <input
                                        name="last_name"
                                        type="text"
                                        placeholder="Last Name"
                                        className={`w-full h-[40px] px-[15px] border rounded outline-none focus:border-[#700A0A] focus:ring-1 focus:ring-[#700A0A]/20 ${state?.error?.last_name ? 'border-red-500' : 'border-[#ddd]'}`}
                                        required
                                    />
                                    {state?.error?.last_name && <p className="text-red-500 text-xs mt-1">{state.error.last_name[0]}</p>}
                                </div>
                            </div>

                            <div>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Email - (Do not use the SDCA Email)"
                                    className={`w-full h-[40px] px-[15px] border rounded outline-none focus:border-[#700A0A] focus:ring-1 focus:ring-[#700A0A]/20 ${state?.error?.email ? 'border-red-500' : 'border-[#ddd]'}`}
                                    required
                                />
                                {state?.error?.email && <p className="text-red-500 text-xs mt-1">{state.error.email[0]}</p>}
                            </div>

                            <div>
                                <input
                                    name="alternative_email"
                                    type="email"
                                    placeholder="Alternate Email"
                                    className={`w-full h-[40px] px-[15px] border rounded outline-none focus:border-[#700A0A] focus:ring-1 focus:ring-[#700A0A]/20 ${state?.error?.alternative_email ? 'border-red-500' : 'border-[#ddd]'}`}
                                    required
                                />
                                {state?.error?.alternative_email && <p className="text-red-500 text-xs mt-1">{state.error.alternative_email[0]}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <input
                                        name="phone"
                                        type="tel"
                                        placeholder="Phone (09xxxxxxxxx)"
                                        className={`w-full h-[40px] px-[15px] border rounded outline-none focus:border-[#700A0A] focus:ring-1 focus:ring-[#700A0A]/20 ${state?.error?.phone ? 'border-red-500' : 'border-[#ddd]'}`}
                                        required
                                    />
                                    {state?.error?.phone && <p className="text-red-500 text-xs mt-1">{state.error.phone[0]}</p>}
                                </div>
                                <div>
                                    <input
                                        name="telephone"
                                        type="text"
                                        placeholder="Telephone"
                                        className="w-full h-[40px] px-[15px] border border-[#ddd] rounded outline-none focus:border-[#700A0A] focus:ring-1 focus:ring-[#700A0A]/20"
                                    />
                                </div>
                            </div>

                            <div>
                                <select
                                    name="graduation_year"
                                    className={`w-full h-[40px] px-[15px] border rounded outline-none focus:border-[#700A0A] focus:ring-1 focus:ring-[#700A0A]/20 bg-white ${state?.error?.graduation_year ? 'border-red-500' : 'border-[#ddd]'}`}
                                    required
                                >
                                    <option value="">Graduation Year</option>
                                    {years.map((year) => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                                {state?.error?.graduation_year && <p className="text-red-500 text-xs mt-1">{state.error.graduation_year[0]}</p>}
                            </div>

                            <div>
                                <label className="text-sm font-semibold mb-1 block">Degree</label>
                                <select
                                    name="degree"
                                    onChange={(e) => setSelectedDegree(e.target.value)}
                                    className={`w-full h-[40px] px-[15px] border rounded outline-none focus:border-[#700A0A] focus:ring-1 focus:ring-[#700A0A]/20 bg-white ${state?.error?.degree ? 'border-red-500' : 'border-[#ddd]'}`}
                                    required
                                >
                                    <option value="">-- Select Degree --</option>
                                    <optgroup label="School of Nursing and Allied Health Studies">
                                        <option>BS in Nursing</option>
                                        <option>BS in Radiologic Technology</option>
                                        <option>BS in Physical Therapy</option>
                                    </optgroup>
                                    <optgroup label="School of Medical Laboratory Science">
                                        <option>BS in Medical Laboratory Science</option>
                                        <option>BS in Pharmacy</option>
                                        <option>BS in Biology</option>
                                    </optgroup>
                                    <optgroup label="School of Accountancy, Science, and Education">
                                        <option>BS in Accountancy</option>
                                        <option>BS in Accounting Technology / AIS</option>
                                        <option>BS in Psychology</option>
                                        <option>BS in Elementary Education</option>
                                        <option>BS in Secondary Education</option>
                                    </optgroup>
                                    <optgroup label="School of International, Hospitality, Tourism & Management">
                                        <option>BS in Business Administration - Financial Management</option>
                                        <option>BS in Business Administration - Marketing Management</option>
                                        <option>BS in Business Administration - HR Development</option>
                                        <option>BS in Business Administration - Operations Management</option>
                                        <option>BS in Tourism Management</option>
                                        <option>BS in Hospitality Management</option>
                                        <option>BS in Hospitality Management - Culinary Arts</option>
                                        <option>BS in Hospitality Management - Cruiseline Operations</option>
                                    </optgroup>
                                    <optgroup label="School of Communication, Multimedia, and Computer Studies">
                                        <option>BA in Communication</option>
                                        <option>Bachelor of Multimedia Arts</option>
                                        <option>BS in Information Technology</option>
                                    </optgroup>
                                    <option value="Other">Other (Not Listed)</option>
                                </select>
                                {state?.error?.degree && <p className="text-red-500 text-xs mt-1">{state.error.degree[0]}</p>}
                            </div>

                            {selectedDegree === "Other" && (
                                <div>
                                    <label className="text-sm font-semibold mb-1 block">Please specify your degree</label>
                                    <input
                                        name="degree_other"
                                        type="text"
                                        placeholder="Enter your degree"
                                        className="w-full h-[40px] px-[15px] border border-[#ddd] rounded outline-none focus:border-[#700A0A] focus:ring-1 focus:ring-[#700A0A]/20"
                                        required
                                    />
                                </div>
                            )}

                            <div>
                                <select
                                    name="gender"
                                    className={`w-full h-[40px] px-[15px] border rounded outline-none focus:border-[#700A0A] focus:ring-1 focus:ring-[#700A0A]/20 bg-white ${state?.error?.gender ? 'border-red-500' : 'border-[#ddd]'}`}
                                    required
                                >
                                    <option value="">Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                {state?.error?.gender && <p className="text-red-500 text-xs mt-1">{state.error.gender[0]}</p>}
                            </div>

                            <div>
                                <label className="text-sm font-semibold mb-1 block">Profile Picture (Optional)</label>
                                <input
                                    name="profile_image"
                                    type="file"
                                    accept="image/*"
                                    className="w-full h-[40px] px-[15px] border border-[#ddd] rounded outline-none focus:border-[#700A0A] focus:ring-1 focus:ring-[#700A0A]/20 py-1"
                                />
                            </div>
                        </div>

                        <SubmitButton>Register Account</SubmitButton>
                    </form>

                    <div className="mt-4 pt-4 border-t border-[#eee] text-center">
                        <p className="text-[0.85rem] text-[#6c757d]">
                            Already have an account?{" "}
                            <Link href="/login" className="text-[#700A0A] font-semibold hover:underline">
                                Log in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
