'use client';

import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

type EventType = {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  userId?: number;
};

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [token, setToken] = useState('');
  const [events, setEvents] = useState<EventType[]>([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('token');

    if (savedToken) {
      setToken(savedToken);
    }

    loadEvents();
  }, []);

  async function register() {
    try {
      const res = await fetch('http://https://event-platform-backend-lon2.onrender.com/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Errore registrazione');
        return;
      }

      toast.success('Registrazione completata');

      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      toast.error('Errore server');
    }
  }

  async function login() {
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Login fallito');
        return;
      }

      localStorage.setItem('token', data.access_token);

      setToken(data.access_token);

      toast.success('Login effettuato');
    } catch (error) {
      toast.error('Errore server');
    }
  }

  function logout() {
    localStorage.removeItem('token');

    setToken('');

    toast.success('Logout effettuato');
  }

  async function loadEvents() {
    try {
      const res = await fetch('http://localhost:3000/events');

      const data = await res.json();

      setEvents(data);
    } catch (error) {
      toast.error('Errore caricamento eventi');
    }
  }

  async function saveEvent() {
    if (!token) {
      toast.error('Devi fare login');
      return;
    }

    try {
      const isoDate = new Date(date).toISOString();

      const res = await fetch('http://localhost:3000/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          location,
          date: isoDate,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Errore creazione evento');
        return;
      }

      toast.success('Evento creato');

      setTitle('');
      setDescription('');
      setLocation('');
      setDate('');

      loadEvents();
    } catch (error) {
      toast.error('Errore server');
    }
  }

  async function deleteEvent(id: number) {
    if (!token) {
      toast.error('Devi fare login');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/events/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        toast.error('Non puoi eliminare questo evento');
        return;
      }

      toast.success('Evento eliminato');

      loadEvents();
    } catch (error) {
      toast.error('Errore server');
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <Toaster />

      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-10">
          Event Platform
        </h1>

        <div className="bg-white p-8 rounded-xl shadow-md mb-10">
          <h2 className="text-2xl font-bold mb-6">
            Registrazione / Login
          </h2>

          <div className="grid gap-4">
            <input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-3 rounded-lg"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-3 rounded-lg"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-3 rounded-lg"
            />

            <div className="flex gap-4">
              <button
                onClick={register}
                className="bg-blue-600 text-white px-5 py-3 rounded-lg"
              >
                Registrati
              </button>

              <button
                onClick={login}
                className="bg-green-600 text-white px-5 py-3 rounded-lg"
              >
                Login
              </button>

              <button
                onClick={logout}
                className="bg-red-600 text-white px-5 py-3 rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md mb-10">
          <h2 className="text-2xl font-bold mb-6">
            Crea Evento
          </h2>

          <div className="grid gap-4">
            <input
              type="text"
              placeholder="Titolo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-3 rounded-lg"
            />

            <textarea
              placeholder="Descrizione"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              placeholder="Luogo"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border p-3 rounded-lg"
            />

            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border p-3 rounded-lg"
            />

            <button
              onClick={saveEvent}
              className="bg-purple-600 text-white px-5 py-3 rounded-lg"
            >
              Salva Evento
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-6">
            Lista Eventi
          </h2>

          <div className="grid gap-5">
            {events.map((event) => (
              <div
                key={event.id}
                className="border rounded-xl p-5"
              >
                <h3 className="text-xl font-bold">
                  {event.title}
                </h3>

                <p className="mt-2">
                  {event.description}
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  📍 {event.location}
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  📅 {new Date(event.date).toLocaleString()}
                </p>

                <button
                  onClick={() => deleteEvent(event.id)}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Elimina
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}