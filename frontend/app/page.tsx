"use client";

import { useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    try {
      setMessage("");

      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Registration failed");
        return;
      }

      setMessage("Account created successfully 🚀");
    } catch (error) {
      setMessage("Server connection error");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        <h1 className="text-4xl font-bold mb-2">
          Event Platform
        </h1>

        <p className="text-zinc-400 mb-8">
          Modern event management platform
        </p>

        <form
          onSubmit={handleRegister}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-3 outline-none"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-3 outline-none"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-white text-black py-3 font-semibold hover:opacity-90 transition"
          >
            Create Account
          </button>
        </form>

        {message && (
          <div className="mt-4 text-sm text-zinc-300">
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
