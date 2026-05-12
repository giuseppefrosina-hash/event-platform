"use client";

import { useEffect, useState } from "react";

const API =
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

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      const res = await fetch(`${API}/events`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.log(err);
      setEvents([]);
    }
  }

  async function register() {
    try {
      await fetch(`${API}/auth/register`, {
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
      console.log(err);
    }
  }

  async function login() {
    try {
      const res = await fetch(`${API}/auth/login`, {
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
      console.log(err);
    }
  }

  async function createEvent() {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${API}/events`, {
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

      setTitle("");
      setDescription("");
      setLocation("");
      setDate("");

      loadEvents();

      alert("Event created");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f5f7",
        padding: "80px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "-3px",
            color: "#111",
            marginBottom: 12,
          }}
        >
          Event Platform
        </h1>

        <p
          style={{
            fontSize: 32,
            color: "#666",
            marginBottom: 60,
            fontWeight: 400,
          }}
        >
          Discover premium experiences
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
            marginBottom: 60,
          }}
        >
          {/* LOGIN */}

          <div
            style={{
              background: "white",
              borderRadius: 32,
              padding: 40,
              boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
            }}
          >
            <h2
              style={{
                fontSize: 28,
                marginBottom: 30,
                color: "#111",
              }}
            >
              Authentication
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />

              <div style={{ display: "flex", gap: 16 }}>
                <button onClick={register} style={secondaryButton}>
                  Register
                </button>

                <button onClick={login} style={primaryButton}>
                  Login
                </button>
              </div>
            </div>
          </div>

          {/* CREATE EVENT */}

          <div
            style={{
              background: "white",
              borderRadius: 32,
              padding: 40,
              boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
            }}
          >
            <h2
              style={{
                fontSize: 28,
                marginBottom: 30,
                color: "#111",
              }}
            >
              Create Event
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={inputStyle}
              />

              <input
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={inputStyle}
              />

              <input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={inputStyle}
              />

              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={inputStyle}
              />

              <button onClick={createEvent} style={greenButton}>
                Create Event
              </button>
            </div>
          </div>
        </div>

        {/* EVENTS */}

        <h2
          style={{
            fontSize: 40,
            marginBottom: 30,
            color: "#111",
          }}
        >
          Events
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
            gap: 24,
          }}
        >
          {events.map((event, index) => (
            <div
              key={index}
              style={{
                background: "white",
                borderRadius: 28,
                padding: 28,
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
              }}
            >
              <h3
                style={{
                  fontSize: 24,
                  marginBottom: 12,
                  color: "#111",
                }}
              >
                {event.title}
              </h3>

              <p
                style={{
                  color: "#666",
                  marginBottom: 18,
                  lineHeight: 1.6,
                }}
              >
                {event.description}
              </p>

              <div style={{ color: "#888", fontSize: 15 }}>
                📍 {event.location || "Unknown"}
              </div>

              <div
                style={{
                  color: "#888",
                  fontSize: 15,
                  marginTop: 8,
                }}
              >
                📅{" "}
                {event.date
                  ? new Date(event.date).toLocaleString()
                  : "No date"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "18px 20px",
  borderRadius: 18,
  border: "1px solid #ddd",
  fontSize: 16,
  outline: "none",
  background: "#fafafa",
};

const primaryButton = {
  background: "#0071e3",
  color: "white",
  border: "none",
  padding: "16px 28px",
  borderRadius: 16,
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
};

const secondaryButton = {
  background: "#e8e8ed",
  color: "#111",
  border: "none",
  padding: "16px 28px",
  borderRadius: 16,
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
};

const greenButton = {
  background: "#34c759",
  color: "white",
  border: "none",
  padding: "18px 28px",
  borderRadius: 18,
  fontSize: 17,
  fontWeight: 600,
  cursor: "pointer",
};