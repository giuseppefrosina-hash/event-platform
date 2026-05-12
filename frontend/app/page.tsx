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

  const [token, setToken] = useState("");

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
      const res = await fetch(`${API_URL}/auth/register`, {
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

      alert("Registration completed");
      console.log(data);
    } catch (err) {
      console.error(err);
      alert("Registration failed");
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

      if (data.access_token) {
        setToken(data.access_token);
        localStorage.setItem("token", data.access_token);

        alert("Login successful");
      } else {
        alert("Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Login error");
    }
  }

  async function createEvent() {
    try {
      const savedToken = token || localStorage.getItem("token");

      const res = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${savedToken}`,
        },
        body: JSON.stringify({
          title,
          description,
          location,
          date,
          price: Number(price),
        }),
      });

      const data = await res.json();

      console.log(data);

      alert("Event created");

      setTitle("");
      setDescription("");
      setLocation("");
      setDate("");
      setPrice("");

      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Error creating event");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        padding: "80px",
        fontFamily: "Inter, sans-serif",
        color: "#111111",
      }}
    >
      <div style={{ marginBottom: "80px" }}>
        <h1
          style={{
            fontSize: "72px",
            fontWeight: 700,
            marginBottom: "16px",
          }}
        >
          Event Platform
        </h1>

        <p
          style={{
            fontSize: "28px",
            color: "#666",
          }}
        >
          Discover premium experiences
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          marginBottom: "80px",
        }}
      >
        <div
          style={{
            background: "#f5f5f7",
            borderRadius: "32px",
            padding: "40px",
          }}
        >
          <h2
            style={{
              fontSize: "32px",
              marginBottom: "32px",
            }}
          >
            Authentication
          </h2>

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "24px",
            }}
          >
            <button onClick={register} style={secondaryButton}>
              Register
            </button>

            <button onClick={login} style={primaryButton}>
              Login
            </button>
          </div>
        </div>

        <div
          style={{
            background: "#f5f5f7",
            borderRadius: "32px",
            padding: "40px",
          }}
        >
          <h2
            style={{
              fontSize: "32px",
              marginBottom: "32px",
            }}
          >
            Create Event
          </h2>

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

          <input
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={inputStyle}
          />

          <button
            onClick={createEvent}
            style={{
              ...primaryButton,
              width: "100%",
              marginTop: "16px",
            }}
          >
            Create Event
          </button>
        </div>
      </div>

      <div>
        <h2
          style={{
            fontSize: "48px",
            marginBottom: "32px",
          }}
        >
          Events
        </h2>

        <div
          style={{
            display: "grid",
            gap: "24px",
          }}
        >
          {events.map((event, index) => (
            <div
              key={index}
              style={{
                background: "#f5f5f7",
                borderRadius: "28px",
                padding: "32px",
              }}
            >
              <h3
                style={{
                  fontSize: "28px",
                  marginBottom: "12px",
                }}
              >
                {event.title}
              </h3>

              <p
                style={{
                  color: "#666",
                  marginBottom: "12px",
                }}
              >
                {event.description}
              </p>

              <p>{event.location}</p>

              <p>{event.date}</p>

              <p
                style={{
                  marginTop: "16px",
                  fontWeight: 600,
                }}
              >
                € {event.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "22px",
  borderRadius: "20px",
  border: "1px solid #d2d2d7",
  background: "#ffffff",
  fontSize: "18px",
  color: "#111",
  marginBottom: "18px",
  outline: "none",
};

const primaryButton = {
  background: "#0071e3",
  color: "#fff",
  border: "none",
  padding: "18px 28px",
  borderRadius: "16px",
  fontSize: "18px",
  cursor: "pointer",
};

const secondaryButton = {
  background: "#e5e5ea",
  color: "#111",
  border: "none",
  padding: "18px 28px",
  borderRadius: "16px",
  fontSize: "18px",
  cursor: "pointer",
};