"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const API =
  "https://event-platform-vr94.onrender.com";

export default function Home() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [image, setImage] =
    useState("");

  const [selectedDate, setSelectedDate] =
    useState("");

  const [events, setEvents] = useState<any[]>(
    []
  );

  async function register() {
    try {
      const response = await axios.post(
        `${API}/auth/register`,
        {
          email,
          password,
        }
      );

      console.log(
        "REGISTER RESPONSE:",
        response.data
      );

      toast.success("Registrazione completata");
    } catch (err: any) {
      console.log(
        "REGISTER ERROR:",
        err?.response?.data || err
      );

      toast.error("Errore registrazione");
    }
  }

  async function login() {
    try {
      const response = await axios.post(
        `${API}/auth/login`,
        {
          email,
          password,
        }
      );

      console.log(
        "LOGIN RESPONSE:",
        response.data
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      console.log(
        "TOKEN SALVATO:",
        response.data.token
      );

      toast.success("Login effettuato");
    } catch (err: any) {
      console.log(
        "LOGIN ERROR:",
        err?.response?.data || err
      );

      toast.error("Errore login");
    }
  }

  async function fetchEvents() {
    try {
      const response = await axios.get(
        `${API}/events`
      );

      console.log(
        "EVENTS:",
        response.data
      );

      setEvents(response.data);
    } catch (err: any) {
      console.log(
        "FETCH EVENTS ERROR:",
        err?.response?.data || err
      );
    }
  }

  async function createEvent() {
    try {
      const token =
        localStorage.getItem("token");

      console.log(
        "TOKEN RECUPERATO:",
        token
      );

      if (!token) {
        toast.error("Token mancante");
        return;
      }

      const response = await axios.post(
        `${API}/events`,
        {
          title,
          description,
          location,
          image,
          date: selectedDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
        }
      );

      console.log(
        "EVENTO CREATO:",
        response.data
      );

      toast.success("Evento creato");

      setTitle("");
      setDescription("");
      setLocation("");
      setImage("");
      setSelectedDate("");

      fetchEvents();
    } catch (err: any) {
      console.log(
        "ERRORE COMPLETO:",
        err
      );

      console.log(
        "RISPOSTA SERVER:",
        err?.response?.data
      );

      console.log(
        "STATUS:",
        err?.response?.status
      );

      toast.error(
        "Errore creazione evento"
      );
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-7xl font-bold mb-4">
        Event Platform
      </h1>

      <p className="text-2xl text-gray-400 mb-12">
        Premium Event SaaS Dashboard
      </p>

      <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 max-w-4xl mb-10">
        <h2 className="text-5xl font-bold mb-8">
          Login / Register
        </h2>

        <div className="flex flex-col gap-4">
          <input
            className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 text-3xl"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 text-3xl"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            onClick={register}
            className="bg-blue-600 hover:bg-blue-700 rounded-2xl p-6 text-3xl font-bold"
          >
            Registrati
          </button>

          <button
            onClick={login}
            className="bg-green-500 hover:bg-green-600 rounded-2xl p-6 text-3xl font-bold"
          >
            Login
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 max-w-4xl mb-10">
        <h2 className="text-5xl font-bold mb-8">
          Crea Evento
        </h2>

        <div className="flex flex-col gap-4">
          <input
            className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 text-3xl"
            placeholder="Titolo"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <textarea
            className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 text-3xl"
            placeholder="Descrizione"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <input
            className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 text-3xl"
            placeholder="Location"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
          />

          <input
            className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 text-3xl"
            placeholder="Image URL"
            value={image}
            onChange={(e) =>
              setImage(e.target.value)
            }
          />

          <input
            type="date"
            className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 text-3xl"
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(
                e.target.value
              )
            }
          />

          <button
            onClick={createEvent}
            className="bg-purple-600 hover:bg-purple-700 rounded-2xl p-6 text-3xl font-bold"
          >
            Crea Evento
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
          >
            <h3 className="text-4xl font-bold mb-4">
              {event.title}
            </h3>

            <p className="text-2xl text-gray-300 mb-4">
              {event.description}
            </p>

            <p className="text-xl text-gray-400">
              {event.location}
            </p>

            <p className="text-xl text-gray-500">
              {event.date}
            </p>

            {event.image && (
              <img
                src={event.image}
                alt={event.title}
                className="mt-4 rounded-2xl"
              />
            )}
          </div>
        ))}
      </div>
    </main>
  );
}