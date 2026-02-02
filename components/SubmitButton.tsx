"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
    children,
    className = "w-full h-[48px] bg-[#700A0A] text-white font-bold uppercase rounded hover:bg-[#550808] transition-colors mt-4",
    disabled = false
}: {
    children: React.ReactNode,
    className?: string,
    disabled?: boolean
}) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending || disabled}
            className={`${className} ${pending || disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            {pending ? "Processing..." : children}
        </button>
    );
}
