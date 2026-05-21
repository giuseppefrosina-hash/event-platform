"use client";

import { useEffect, useState } from "react";

const API_URL = "https://api.uniquo.it";

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
  const [messageType, setMessageType] =
    useState<"success" | "error">("success");

  function showToast(
    text: string,
    type: "success" | "error" = "success",
  ) {
    setMessage(text);
    setMessageType(type);
  }

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
      const res = await fetch(
        `${API_URL}/events`,
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setEvents(data);
      } else if (
        Array.isArray(data.events)
      ) {
        setEvents(data.events);
      } else if (
        Array.isArray(data.data)
      ) {
        setEvents(data.data);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error(err);

      showToast(
        "Errore caricamento eventi",
        "error",
      );
    }
  }

  async function register() {
    try {
      const res = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      if (!res.ok) {
        showToast(
          "Registrazione fallita",
          "error",
        );

        return;
      }

      showToast(
        "Registrazione completata",
        "success",
      );
    } catch (err) {
      console.error(err);

      showToast(
        "Errore durante la registrazione",
        "error",
      );
    }
  }

  async function login() {
    try {
      const res = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      if (!res.ok) {
        showToast(
          "Email o password errati",
          "error",
        );

        return;
      }

      const data = await res.json();

      const jwtToken =
        data.access_token ||
        data.token;

      if (jwtToken) {
        setToken(jwtToken);

        localStorage.setItem(
          "token",
          jwtToken,
        );

        showToast(
          "Accesso effettuato",
          "success",
        );

        setTimeout(() => {
          window.location.href =
            "/companies";
        }, 1000);
      } else {
        showToast(
          "Token non ricevuto",
          "error",
        );
      }
    } catch (err) {
      console.error(err);

      showToast(
        "Errore durante il login",
        "error",
      );
    }
  }

  async function createEvent() {
    try {
      const savedToken =
        token ||
        localStorage.getItem(
          "token",
        );

      if (!savedToken) {
        showToast(
          "Devi effettuare il login",
          "error",
        );

        return;
      }

      const res = await fetch(
        `${API_URL}/events`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${savedToken}`,
          },
          body: JSON.stringify({
            title,
            description,
            location,
            date,
            price: Number(price),
          }),
        },
      );

      if (!res.ok) {
        showToast(
          "Errore creazione evento",
          "error",
        );

        return;
      }

      showToast(
        "Evento creato con successo",
        "success",
      );

      setTitle("");
      setDescription("");
      setLocation("");
      setDate("");
      setPrice("");

      fetchEvents();
    } catch (err) {
      console.error(err);

      showToast(
        "Errore server",
        "error",
      );
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        padding: "80px",
        fontFamily:
          "Inter, sans-serif",
        color: "#111111",
      }}
    >
      {message && (
        <div
          style={{
            position: "fixed",
            top: "30px",
            right: "30px",
            background:
              messageType ===
              "success"
                ? "#0a7f3f"
                : "#c62828",
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

      <div
        style={{
          marginBottom: "80px",
        }}
      >
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
          gridTemplateColumns:
            "1fr 1fr",
          gap: "40px",
          marginBottom: "80px",
        }}
      >
        <div style={cardStyle}>
          <h2 style={titleStyle}>
            Autenticazione
          </h2>

          <input
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value,
              )
            }
            style={inputStyle}
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value,
              )
            }
            style={inputStyle}
          />

          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "24px",
            }}
          >
            <button
              onClick={register}
              style={secondaryButton}
            >
              Registrati
            </button>

            <button
              onClick={login}
              style={primaryButton}
            >
              Accedi
            </button>
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={titleStyle}>
            Crea evento
          </h2>

          <input
            placeholder="Titolo"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value,
              )
            }
            style={inputStyle}
          />

          <input
            placeholder="Descrizione"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value,
              )
            }
            style={inputStyle}
          />

          <input
            placeholder="Luogo"
            value={location}
            onChange={(e) =>
              setLocation(
                e.target.value,
              )
            }
            style={inputStyle}
          />

          <input
            type="datetime-local"
            value={date}
            onChange={(e) =>
              setDate(
                e.target.value,
              )
            }
            style={inputStyle}
          />

          <input
            placeholder="Prezzo"
            value={price}
            onChange={(e) =>
              setPrice(
                e.target.value,
              )
            }
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
            Crea evento
          </button>
        </div>
      </div>
    </main>
  );
}

const cardStyle = {
  background: "#f5f5f7",
  borderRadius: "32px",
  padding: "40px",
};

const titleStyle = {
  fontSize: "32px",
  marginBottom: "32px",
};

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