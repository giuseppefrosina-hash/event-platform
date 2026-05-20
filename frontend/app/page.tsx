"use client";

import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

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
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  async function fetchEvents() {
    try {
      const res = await fetch(`${API_URL}/events`);

      const data = await res.json();

      if (Array.isArray(data)) {
        setEvents(data);
      } else if (Array.isArray(data.events)) {
        setEvents(data.events);
      } else if (Array.isArray(data.data)) {
        setEvents(data.data);
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

      await res.json();

      setMessage("Registration completed");
    } catch (err) {
      console.error(err);
      setMessage("Registration failed");
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

      const jwtToken = data.access_token || data.token;

      if (jwtToken) {
        setToken(jwtToken);

        localStorage.setItem("token", jwtToken);

        setMessage("Login successful");

        window.location.href = "/companies";
      } else {
        setMessage("Login failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Login error");
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

      await res.json();

      setMessage("Event created");

      setTitle("");
      setDescription("");
      setLocation("");
      setDate("");
      setPrice("");

      fetchEvents();
    } catch (err) {
      console.error(err);
      setMessage("Error creating event");
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
      {message && (
        <div
          style={{
            position: "fixed",
            top: "30px",
            right: "30px",
            background: "#111",
            color: "#fff",
            padding: "18px 28px",
            borderRadius: "18px",
            fontSize: "16px",
            zIndex: 999,
          }}
        >
          {message}
        </div>
      )}

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
          {events.length === 0 && (
            <div
              style={{
                background: "#f5f5f7",
                padding: "32px",
                borderRadius: "24px",
                color: "#666",
                fontSize: "18px",
              }}
            >
              No events yet
            </div>
          )}

          {events.map((event: any, index: number) => (
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
                {event.title || "Untitled Event"}
              </h3>

              <p
                style={{
                  color: "#666",
                  marginBottom: "12px",
                }}
              >
                {event.description || "No description"}
              </p>

              <p style={{ marginBottom: "8px" }}>
                📍 {event.location || "Unknown location"}
              </p>

              <p style={{ marginBottom: "8px" }}>
                📅 {event.date || "No date"}
              </p>

              <p
                style={{
                  marginTop: "16px",
                  fontWeight: 600,
                  fontSize: "20px",
                }}
              >
                € {event.price || 0}
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