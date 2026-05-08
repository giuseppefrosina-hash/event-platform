```tsx
"use client";

import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface EventItem {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
}

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      setToken(savedToken);
      fetchEvents(savedToken);
    }
  }, []);

  async function register() {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Registration failed");
        return;
      }

      setMessage("Registration successful");
      setIsLogin(true);
    } catch (error) {
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  }

  async function login() {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);

      fetchEvents(data.access_token);

      setMessage("Login successful");
    } catch (error) {
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  }

  async function fetchEvents(currentToken?: string) {
    try {
      const authToken = currentToken || token;

      const response = await fetch(`${API_URL}/events`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      if (Array.isArray(data)) {
        setEvents(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function createEvent() {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          location,
          date,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Cannot create event");
        return;
      }

      setTitle("");
      setDescription("");
      setLocation("");
      setDate("");

      fetchEvents();

      setMessage("Event created");
    } catch (error) {
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  }

  async function deleteEvent(id: number) {
    try {
      await fetch(`${API_URL}/events/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchEvents();
    } catch (error) {
      setMessage("Delete failed");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setToken("");
    setEvents([]);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold">Event Platform</h1>

            <p className="mt-3 text-gray-400">
              Modern full-stack event platform.
            </p>
          </div>

          {token && (
            <button
              onClick={logout}
              className="rounded-2xl border border-red-500 px-5 py-3 text-red-400 hover:bg-red-500 hover:text-white"
            >
              Logout
            </button>
          )}
        </div>

        {!token ? (
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <div className="mb-6 flex gap-4">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`rounded-xl px-5 py-3 font-semibold ${
                    isLogin
                      ? "bg-white text-black"
                      : "bg-white/10 text-white"
                  }`}
                >
                  Login
                </button>

                <button
                  onClick={() => setIsLogin(false)}
                  className={`rounded-xl px-5 py-3 font-semibold ${
                    !isLogin
                      ? "bg-white text-black"
                      : "bg-white/10 text-white"
                  }`}
                >
                  Register
                </button>
              </div>

              {!isLogin && (
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mb-4 w-full rounded-2xl border border-white/10 bg-black/40 p-4"
                />
              )}

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4 w-full rounded-2xl border border-white/10 bg-black/40 p-4"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-6 w-full rounded-2xl border border-white/10 bg-black/40 p-4"
              />

              <button
                onClick={isLogin ? login : register}
                disabled={loading}
                className="w-full rounded-2xl bg-white py-4 font-bold text-black"
              >
                {loading
                  ? "Loading..."
                  : isLogin
                  ? "Login"
                  : "Create Account"}
              </button>

              {message && (
                <p className="mt-5 text-sm text-gray-300">{message}</p>
              )}
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 p-8">
              <h2 className="text-3xl font-bold">
                Create and manage events online
              </h2>

              <p className="mt-4 text-gray-300">
                Full-stack app with Next.js, NestJS, Prisma and PostgreSQL.
              </p>

              <div className="mt-10 space-y-4">
                <div className="rounded-2xl bg-black/30 p-5">
                  🔐 JWT Authentication
                </div>

                <div className="rounded-2xl bg-black/30 p-5">
                  📅 Event Management
                </div>

                <div className="rounded-2xl bg-black/30 p-5">
                  ☁️ Vercel + Render Deploy
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <h2 className="mb-6 text-2xl font-bold">Create Event</h2>

              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-4 w-full rounded-2xl border border-white/10 bg-black/40 p-4"
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mb-4 h-32 w-full rounded-2xl border border-white/10 bg-black/40 p-4"
              />

              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mb-4 w-full rounded-2xl border border-white/10 bg-black/40 p-4"
              />

              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mb-6 w-full rounded-2xl border border-white/10 bg-black/40 p-4"
              />

              <button
                onClick={createEvent}
                className="w-full rounded-2xl bg-white py-4 font-bold text-black"
              >
                Create Event
              </button>
            </div>

            <div className="lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold">Your Events</h2>

                <button
                  onClick={() => fetchEvents()}
                  className="rounded-2xl border border-white/10 px-5 py-3"
                >
                  Refresh
                </button>
              </div>

              <div className="grid gap-6">
                {events.length === 0 ? (
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-gray-400">
                    No events found
                  </div>
                ) : (
                  events.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-3xl border border-white/10 bg-white/5 p-8"
                    >
                      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <h3 className="text-2xl font-bold">
                            {event.title}
                          </h3>

                          <p className="mt-3 text-gray-300">
                            {event.description}
                          </p>

                          <div className="mt-5 flex flex-wrap gap-3 text-sm text-gray-400">
                            <span className="rounded-full bg-white/10 px-4 py-2">
                              📍 {event.location}
                            </span>

                            <span className="rounded-full bg-white/10 px-4 py-2">
                              📅 {new Date(event.date).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="rounded-2xl border border-red-500 px-5 py-3 text-red-400 hover:bg-red-500 hover:text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
```
