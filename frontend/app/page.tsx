"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import dynamic from "next/dynamic";

const Calendar = dynamic(
  () => import("react-calendar"),
  { ssr: false }
);

import "react-calendar/dist/Calendar.css";

import toast, { Toaster } from "react-hot-toast";

import QRCode from "react-qr-code";

import {
  CalendarDays,
  MapPin,
  Trash2,
  Plus,
  LogIn,
  UserPlus,
} from "lucide-react";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [location, setLocation] =
    useState("");
  const [image, setImage] = useState("");

  const [events, setEvents] = useState<any[]>(
    []
  );

  const [selectedDate, setSelectedDate] =
    useState<Date>(new Date());

  const API =
    "https://event-platform-vr94.onrender.com";

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const res = await axios.get(
        `${API}/events`
      );

      setEvents(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function register() {
    try {
      const res = await axios.post(
        `${API}/auth/register`,
        {
          email,
          password,
        }
      );

      console.log(
        "REGISTER RESPONSE:",
        res.data
      );

      toast.success(
        "Registrazione completata"
      );
    } catch (err) {
      console.log(
        "REGISTER ERROR:",
        err
      );

      toast.error(
        "Errore registrazione"
      );
    }
  }

  async function login() {
    try {
      const res = await axios.post(
        `${API}/auth/login`,
        {
          email,
          password,
        }
      );

      console.log(
        "LOGIN RESPONSE:",
        res.data
      );

      localStorage.setItem(
        "token",
        res.data.access_token
      );

      console.log(
        "TOKEN SALVATO:",
        res.data.access_token
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

  async function createEvent() {
    try {
      const token =
        localStorage.getItem("token");

      console.log(
        "TOKEN USATO:",
        token
      );

      await axios.post(
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

      toast.success("Evento creato");

      setTitle("");
      setDescription("");
      setLocation("");
      setImage("");

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

  async function deleteEvent(id: number) {
    try {
      const token =
        localStorage.getItem("token");

      await axios.delete(
        `${API}/events/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Evento eliminato");

      fetchEvents();
    } catch (err) {
      console.log(err);

      toast.error(
        "Errore eliminazione"
      );
    }
  }

  async function buyTicket() {
    try {
      const res = await axios.post(
        `${API}/stripe/create-checkout-session`
      );

      window.location.href =
        res.data.url;
    } catch (err) {
      console.log(err);

      toast.error("Errore pagamento");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Toaster />

      <div className="max-w-7xl mx-auto">
        <h1 className="text-7xl font-bold mb-3">
          Event Platform
        </h1>

        <p className="text-zinc-400 text-2xl mb-14">
          Premium Event SaaS Dashboard
        </p>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <h2 className="text-5xl font-bold mb-8">
              Login / Register
            </h2>

            <div className="flex flex-col gap-5">
              <input
                placeholder="Email"
                className="bg-zinc-800 border border-zinc-700 rounded-2xl p-5 text-xl"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

              <input
                placeholder="Password"
                type="password"
                className="bg-zinc-800 border border-zinc-700 rounded-2xl p-5 text-xl"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
              />

              <button
                onClick={register}
                className="bg-blue-600 hover:bg-blue-700 transition-all rounded-2xl p-5 text-xl font-semibold flex items-center justify-center gap-3"
              >
                <UserPlus />
                Registrati
              </button>

              <button
                onClick={login}
                className="bg-green-500 hover:bg-green-600 transition-all rounded-2xl p-5 text-xl font-semibold flex items-center justify-center gap-3"
              >
                <LogIn />
                Login
              </button>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <h2 className="text-5xl font-bold mb-8">
              Crea Evento
            </h2>

            <div className="flex flex-col gap-5">
              <input
                placeholder="Titolo"
                className="bg-zinc-800 border border-zinc-700 rounded-2xl p-5 text-xl"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
              />

              <textarea
                placeholder="Descrizione"
                className="bg-zinc-800 border border-zinc-700 rounded-2xl p-5 text-xl"
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Location"
                className="bg-zinc-800 border border-zinc-700 rounded-2xl p-5 text-xl"
                value={location}
                onChange={(e) =>
                  setLocation(
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Image URL"
                className="bg-zinc-800 border border-zinc-700 rounded-2xl p-5 text-xl"
                value={image}
                onChange={(e) =>
                  setImage(e.target.value)
                }
              />

              <button
                onClick={createEvent}
                className="bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:scale-[1.02] transition-all rounded-2xl p-5 text-xl font-semibold flex items-center justify-center gap-3"
              >
                <Plus />
                Crea Evento
              </button>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <h2 className="text-5xl font-bold mb-8 flex items-center gap-3">
              <CalendarDays />
              Calendario
            </h2>

            <div className="bg-zinc-950 rounded-3xl p-5 overflow-hidden">
              <Calendar
                onChange={(value: any) =>
                  setSelectedDate(value)
                }
                value={selectedDate}
              />
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-6xl font-bold mb-10">
            Eventi
          </h2>

          <div className="grid lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
              >
                <img
                  src={
                    event.image
                      ? event.image
                      : "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
                  }
                  alt={event.title}
                  className="w-full h-56 object-cover rounded-2xl mb-5"
                />

                <div className="flex justify-between items-start">
                  <h3 className="text-4xl font-bold">
                    {event.title}
                  </h3>

                  <button
                    onClick={() =>
                      deleteEvent(event.id)
                    }
                    className="bg-red-500 hover:bg-red-600 transition-all p-3 rounded-xl"
                  >
                    <Trash2 />
                  </button>
                </div>

                <p className="text-zinc-400 text-xl mt-5">
                  {event.description}
                </p>

                <div className="flex items-center gap-2 mt-6 text-zinc-300 text-xl">
                  <MapPin size={20} />
                  {event.location}
                </div>

                <div className="flex items-center gap-2 mt-4 text-zinc-400">
                  <CalendarDays size={20} />
                  {new Date(
                    event.date
                  ).toLocaleDateString()}
                </div>

                <div className="mt-6 flex flex-col gap-4">
                  <button
                    onClick={buyTicket}
                    className="bg-green-500 hover:bg-green-600 transition-all px-5 py-3 rounded-2xl text-xl font-semibold"
                  >
                    Compra Biglietto €19.99
                  </button>

                  <div className="bg-white p-3 rounded-2xl w-fit">
                    <QRCode
                      value={`https://event-platform-six-fawn.vercel.app/event/${event.id}`}
                      size={100}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}