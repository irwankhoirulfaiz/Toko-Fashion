"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError("Email atau password salah.");
      return;
    }
    router.push("/admin/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm rounded-xl border border-stone-200 bg-white p-8 shadow-sm"
      >
        <h1 className="mb-6 text-xl font-semibold text-stone-900">
          Admin Login
        </h1>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-md bg-stone-900 py-2.5 text-sm font-medium text-white hover:bg-stone-800"
          >
            Masuk
          </button>
        </div>
      </form>
    </main>
  );
}
