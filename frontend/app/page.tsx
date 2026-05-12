"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          setEvents([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setEvents([]);
      });
  }, []);

  async function deleteEvent(id: number) {
    const token = localStorage.getItem("token");

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEvents(events.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f5f7",
        padding: 40,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: 56,
            fontWeight: 700,
            marginBottom: 10,
            color: "#111",
            letterSpacing: "-2px",
          }}
        >
          Event Platform
        </h1>

        <p
          style={{
            color: "#666",
            fontSize: 22,
            marginBottom: 50,
          }}
        >
          Discover premium experiences
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(320px,1fr))",
            gap: 30,
          }}
        >
          {events.map((event) => (
            <div
              key={event.id}
              style={{
                background: "#fff",
                borderRadius: 30,
                overflow: "hidden",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.08)",
                transition: "0.3s",
              }}
            >
              <img
                src={
                  event.image ||
                  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
                }
                alt={event.title}
                style={{
                  width: "100%",
                  height: 240,
                  objectFit: "cover",
                }}
              />

              <div style={{ padding: 28 }}>
                <h2
                  style={{
                    fontSize: 30,
                    marginBottom: 12,
                    color: "#111",
                  }}
                >
                  {event.title}
                </h2>

                <p
                  style={{
                    color: "#666",
                    lineHeight: 1.6,
                    marginBottom: 16,
                  }}
                >
                  {event.description}
                </p>

                <p
                  style={{
                    color: "#888",
                    marginBottom: 8,
                    fontSize: 15,
                  }}
                >
                  📍 {event.location}
                </p>

                <p
                  style={{
                    color: "#888",
                    marginBottom: 8,
                    fontSize: 15,
                  }}
                >
                  📅{" "}
                  {event.date
                    ? new Date(event.date).toLocaleDateString()
                    : "No date"}
                </p>

                <p
                  style={{
                    fontWeight: 700,
                    marginBottom: 24,
                    color: "#111",
                    fontSize: 20,
                  }}
                >
                  € {event.price || 0}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: 12,
                  }}
                >
                  <button
                    style={{
                      flex: 1,
                      padding: 15,
                      borderRadius: 16,
                      border: "none",
                      background: "#0071e3",
                      color: "white",
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteEvent(event.id)}
                    style={{
                      flex: 1,
                      padding: 15,
                      borderRadius: 16,
                      border: "none",
                      background: "#ff3b30",
                      color: "white",
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}