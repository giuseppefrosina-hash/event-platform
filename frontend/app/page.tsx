"use client";

import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://event-platform-vr94.onrender.com";

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const res = await fetch(`${API_URL}/events`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error(err);
      setEvents([]);
    }
  }

  async function register() {
    try {
      await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      alert("Registered");
    } catch (err) {
      console.error(err);
    }
  }

  async function login() {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      localStorage.setItem("token", data.access_token);

      alert("Logged in");
    } catch (err) {
      console.error(err);
    }
  }

  async function createEvent() {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${API_URL}/events`, {
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
          price: Number(price),
        }),
      });

      setTitle("");
      setDescription("");
      setLocation("");
      setDate("");
      setPrice("");

      fetchEvents();

      alert("Event created");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-black">
      {/* NAVBAR */}
      <nav className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">
            Event Platform
          </h1>

          <button className="bg-black text-white px-5 py-2 rounded-full text-sm hover:opacity-80 transition">
            Explore Events
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-5">
            Discover Experiences
          </p>

          <h1 className="text-6xl md:text-7xl font-semibold leading-tight tracking-tight">
            Find and create
            <br />
            unforgettable events.
          </h1>

          <p className="text-gray-500 text-xl mt-8 leading-relaxed">
            Minimal, elegant and modern event management platform designed for
            creators, communities and experiences.
          </p>

          <div className="flex gap-4 mt-10">
            <button className="bg-black text-white px-7 py-4 rounded-full text-sm font-medium hover:scale-105 transition">
              Get Started
            </button>

            <button className="bg-white border border-gray-300 px-7 py-4 rounded-full text-sm font-medium hover:bg-gray-100 transition">
              Browse Events
            </button>
          </div>
        </div>
      </section>

      {/* FORMS */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AUTH */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
          <h2 className="text-3xl font-semibold mb-8 tracking-tight">
            Authentication
          </h2>

          <div className="space-y-4">
            <input
              placeholder="Email"
              className="w-full h-14 rounded-2xl border border-gray-200 px-5 outline-none focus:ring-2 focus:ring-black/10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full h-14 rounded-2xl border border-gray-200 px-5 outline-none focus:ring-2 focus:ring-black/10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex gap-4 pt-3">
              <button
                onClick={register}
                className="bg-black text-white px-6 py-3 rounded-full hover:opacity-80 transition"
              >
                Register
              </button>

              <button
                onClick={login}
                className="bg-gray-100 px-6 py-3 rounded-full hover:bg-gray-200 transition"
              >
                Login
              </button>
            </div>
          </div>
        </div>

        {/* CREATE EVENT */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
          <h2 className="text-3xl font-semibold mb-8 tracking-tight">
            Create Event
          </h2>

          <div className="space-y-4">
            <input
              placeholder="Title"
              className="w-full h-14 rounded-2xl border border-gray-200 px-5 outline-none focus:ring-2 focus:ring-black/10"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              placeholder="Description"
              className="w-full h-14 rounded-2xl border border-gray-200 px-5 outline-none focus:ring-2 focus:ring-black/10"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              placeholder="Location"
              className="w-full h-14 rounded-2xl border border-gray-200 px-5 outline-none focus:ring-2 focus:ring-black/10"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <input
              type="datetime-local"
              className="w-full h-14 rounded-2xl border border-gray-200 px-5 outline-none focus:ring-2 focus:ring-black/10"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <input
              type="number"
              placeholder="Price"
              className="w-full h-14 rounded-2xl border border-gray-200 px-5 outline-none focus:ring-2 focus:ring-black/10"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <button
              onClick={createEvent}
              className="w-full h-14 rounded-2xl bg-black text-white font-medium hover:opacity-80 transition mt-4"
            >
              Create Event
            </button>
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-5xl font-semibold tracking-tight">
            Upcoming Events
          </h2>

          <button className="text-sm text-gray-500 hover:text-black transition">
            View all →
          </button>
        </div>

        {events.length === 0 ? (
          <div className="bg-white rounded-[32px] p-16 text-center border border-gray-100">
            <h3 className="text-2xl font-semibold mb-3">
              No events available
            </h3>

            <p className="text-gray-500">
              Create your first event to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-[32px] p-7 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="bg-black text-white text-xs px-4 py-2 rounded-full">
                    EVENT
                  </div>

                  <div className="text-sm text-gray-400">
                    €{event.price || 0}
                  </div>
                </div>

                <h3 className="text-3xl font-semibold tracking-tight mb-4">
                  {event.title}
                </h3>

                <p className="text-gray-500 leading-relaxed mb-8">
                  {event.description}
                </p>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Location</span>
                    <span>{event.location}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Date</span>
                    <span>
                      {event.date
                        ? new Date(event.date).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>

                <button className="w-full mt-8 h-12 rounded-2xl bg-gray-100 hover:bg-black hover:text-white transition">
                  View Event
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}