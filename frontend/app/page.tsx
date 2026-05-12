"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API = "https://event-platform-vr94.onrender.com";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [location, setLocation] =
    useState("");
  const [image, setImage] = useState("");
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

      toast.success("Registrazione ok");
    } catch (err) {
      console.log(
        "REGISTER ERROR:",
        err
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
        response.data.access_token
      );

      console.log(
        "TOKEN SALVATO:",
        localStorage.getItem("token")
      );

      toast.success("Login effettuato");
    } catch (err) {
      console.log(
        "LOGIN ERROR:",
        err
      );

      toast.error("Errore login");
    }
  }

  async function fetchEvents() {
    try {
      const response = await axios.get(
        `${API}/events`
      );

      setEvents(response.data);
    } catch (err) {
      console.log(
        "FETCH EVENTS ERROR:",
        err
      );
    }
  }

  async function createEvent() {
    try {
      const token =
        localStorage.getItem("token");

      console.log(
        "TOKEN USATO:",
        token
      );

      if (!token) {
        toast.error(
          "Devi fare login prima"
        );
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
          },
        }
      );

      console.log(
        "CREATE EVENT RESPONSE:",
        response.data
      );

      toast.success("Evento creato");

      setTitle("");
      setDescription("");
      setLocation("");
      setImage("");
      setSelectedDate("");

      fetchEvents();
    } catch (err) {
      console.log(
        "CREATE EVENT ERROR:",
        err
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
      <Toaster />

      <h1 className="text-7xl font-bold">
        Event Platform
      </h1>

      <p className="text-3xl text-gray-400 mt-4 mb-10">
        Premium Event SaaS Dashboard
      </p>

      <div className="bg-zinc-900 p-8 rounded-3xl mb-10">
        <h2 className="text-5xl font-bold mb-8">
          Login / Register
        </h2>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="bg-zinc-800 p-5 rounded-xl text-2xl"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="bg-zinc-800 p-5 rounded-xl text-2xl"
          />

          <button
            onClick={register}
            className="bg-blue-600 p-5 rounded-xl text-2xl font-bold"
          >
            Registrati
          </button>

          <button
            onClick={login}
            className="bg-green-500 p-5 rounded-xl text-2xl font-bold"
          >
            Login
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 p-8 rounded-3xl mb-10">
        <h2 className="text-5xl font-bold mb-8">
          Crea Evento
        </h2>

        <div className="flex flex-col gap-4">
          <input
            placeholder="Titolo"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="bg-zinc-800 p-5 rounded-xl text-2xl"
          />

          <input
            placeholder="Descrizione"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            className="bg-zinc-800 p-5 rounded-xl text-2xl"
          />

          <input
            placeholder="Location"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
            className="bg-zinc-800 p-5 rounded-xl text-2xl"
          />

          <input
            placeholder="Image URL"
            value={image}
            onChange={(e) =>
              setImage(e.target.value)
            }
            className="bg-zinc-800 p-5 rounded-xl text-2xl"
          />

          <input
            type="date"
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(
                e.target.value
              )
            }
            className="bg-zinc-800 p-5 rounded-xl text-2xl"
          />

          <button
            onClick={createEvent}
            className="bg-purple-600 p-5 rounded-xl text-2xl font-bold"
          >
            Crea Evento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-zinc-900 p-6 rounded-3xl"
          >
            <h3 className="text-4xl font-bold">
              {event.title}
            </h3>

            <p className="text-2xl mt-4 text-gray-300">
              {event.description}
            </p>

            <p className="text-xl mt-4 text-gray-400">
              {event.location}
            </p>

            <p className="text-xl mt-2 text-gray-500">
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