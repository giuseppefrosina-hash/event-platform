"use client";

import { useEffect, useState } from "react";

const API_URL = "https://event-platform-vr94.onrender.com";

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");

  const [token, setToken] = useState("");

  useEffect(() => {
    fetchEvents();

    const saved = localStorage.getItem("token");

    if (saved) {
      setToken(saved);
    }
  }, []);

  async function fetchEvents() {
    try {
      const res = await fetch(`${API_URL}/events`);
      const data = await res.json();

      setEvents(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function register() {
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
  }

  async function login() {
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

    setToken(data.access_token);

    alert("Logged in");
  }

  async function createEvent() {
    const res = await fetch(`${API_URL}/events`, {
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
        image:
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
      }),
    });

    if (res.ok) {
      fetchEvents();

      setTitle("");
      setDescription("");
      setLocation("");
      setDate("");
      setPrice("");

      alert("Event created");
    } else {
      alert("Error creating event");
    }
  }

  async function deleteEvent(id: number) {
    await fetch(`${API_URL}/events/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchEvents();
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-6xl font-bold mb-12">Event Platform</h1>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-zinc-900 p-6 rounded-3xl">
          <h2 className="text-2xl font-bold mb-6">Authentication</h2>

          <div className="flex flex-col gap-4">
            <input
              className="bg-zinc-800 p-4 rounded-xl"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              className="bg-zinc-800 p-4 rounded-xl"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex gap-4">
              <button
                onClick={register}
                className="bg-white text-black px-6 py-3 rounded-2xl font-bold"
              >
                Register
              </button>

              <button
                onClick={login}
                className="bg-blue-600 px-6 py-3 rounded-2xl font-bold"
              >
                Login
              </button>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 p-6 rounded-3xl">
          <h2 className="text-2xl font-bold mb-6">Create Event</h2>

          <div className="flex flex-col gap-4">
            <input
              className="bg-zinc-800 p-4 rounded-xl"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              className="bg-zinc-800 p-4 rounded-xl"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              className="bg-zinc-800 p-4 rounded-xl"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <input
              type="datetime-local"
              className="bg-zinc-800 p-4 rounded-xl"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <input
              type="number"
              className="bg-zinc-800 p-4 rounded-xl"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <button
              onClick={createEvent}
              className="bg-green-500 text-black px-6 py-3 rounded-2xl font-bold"
            >
              Create Event
            </button>
          </div>
        </div>
      </div>

      <h2 className="text-4xl font-bold mt-16 mb-8">Events</h2>

      <div className="grid md:grid-cols-3 gap-8">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-zinc-900 rounded-3xl overflow-hidden"
          >
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-60 object-cover"
            />

            <div className="p-5">
              <h3 className="text-2xl font-bold">{event.title}</h3>

              <p className="text-zinc-400 mt-2">{event.description}</p>

              <p className="mt-3">📍 {event.location}</p>

              <p className="mt-2">
                📅 {new Date(event.date).toLocaleString()}
              </p>

              <p className="mt-2 text-green-400 font-bold">
                € {event.price}
              </p>

              <div className="flex gap-3 mt-5">
                <button className="bg-blue-600 px-4 py-2 rounded-xl">
                  Buy Ticket
                </button>

                <button className="bg-red-600 px-4 py-2 rounded-xl">
                  Edit
                </button>

                <button
                  onClick={() => deleteEvent(event.id)}
                  className="bg-zinc-700 px-4 py-2 rounded-xl"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}