"use client";
import { useState } from "react";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSent(true);
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      {sent ? (
        <div className="text-green-600">If your email exists, a reset link has been sent.</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input className="block mb-2 border p-2 w-full" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required />
          <button className="px-4 py-2 bg-blue-600 text-white rounded" type="submit">Send Reset Link</button>
        </form>
      )}
    </div>
  );
}
