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

      console.log("EVENTS:", data);

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
      const res = await fetch(`${API}/auth/register`, {
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

      console.log(data);

      alert("Registration completed");
    } catch (err) {
      console.log(err);
      alert("Registration failed");
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

      console.log("LOGIN:", data);

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        alert("Login successful");
      } else {
        alert("Login failed");
      }
    } catch (err) {
      console.log(err);
      alert("Login error");
    }
  }

  async function createEvent() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Login required");
        return;
      }

      const res = await fetch(`${API}/events`, {
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

      const data = await res.json();

      console.log("CREATE EVENT:", data);

      alert("Event created");

      setTitle("");
      setDescription("");
      setLocation("");
      setDate("");

      loadEvents();
    } catch (err) {
      console.log(err);
      alert("Error creating event");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        padding: "60px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#111",
            marginBottom: 10,
          }}
        >
          Event Platform
        </h1>

        <p
          style={{
            fontSize: 28,
            color: "#666",
            marginBottom: 60,
          }}
        >
          Discover premium experiences
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 30,
            marginBottom: 60,
          }}
        >
          {/* AUTH */}

          <div style={cardStyle}>
            <h2 style={titleStyle}>Authentication</h2>

            <div style={columnStyle}>
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

              <div style={{ display: "flex", gap: 12 }}>
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

          <div style={cardStyle}>
            <h2 style={titleStyle}>Create Event</h2>

            <div style={columnStyle}>
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

        <h2
          style={{
            fontSize: 42,
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
            <div key={index} style={eventCard}>
              <h3
                style={{
                  fontSize: 24,
                  marginBottom: 14,
                  color: "#111",
                }}
              >
                {event.title}
              </h3>

              <p
                style={{
                  color: "#555",
                  marginBottom: 18,
                  lineHeight: 1.6,
                }}
              >
                {event.description}
              </p>

              <div style={{ color: "#777" }}>
                📍 {event.location || "Unknown"}
              </div>

              <div style={{ color: "#777", marginTop: 8 }}>
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

const cardStyle = {
  background: "#fff",
  borderRadius: 30,
  padding: 40,
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
};

const titleStyle = {
  fontSize: 32,
  marginBottom: 30,
  color: "#111",
};

const columnStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 18,
};

const inputStyle = {
  width: "100%",
  padding: "18px",
  borderRadius: 18,
  border: "1px solid #ddd",
  fontSize: 16,
  background: "#fff",
  color: "#111",
  outline: "none",
};

const primaryButton = {
  background: "#0071e3",
  color: "white",
  border: "none",
  padding: "16px 26px",
  borderRadius: 16,
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
};

const secondaryButton = {
  background: "#f2f2f2",
  color: "#111",
  border: "none",
  padding: "16px 26px",
  borderRadius: 16,
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
};

const greenButton = {
  background: "#34c759",
  color: "white",
  border: "none",
  padding: "18px",
  borderRadius: 18,
  fontSize: 17,
  fontWeight: 600,
  cursor: "pointer",
};

const eventCard = {
  background: "#fff",
  borderRadius: 26,
  padding: 28,
  boxShadow: "0 10px 24px rgba(0,0,0,0.05)",
};