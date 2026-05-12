'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://event-platform-vr94.onrender.com';

export default function HomePage() {
  const [events, setEvents] = useState<any[]>([]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const [editingId, setEditingId] =
    useState<number | null>(null);

  async function loadEvents() {
    try {
      const res = await axios.get(
        `${API_URL}/events`
      );

      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function register() {
    try {
      await axios.post(
        `${API_URL}/auth/register`,
        {
          email,
          password,
        }
      );

      alert('Utente registrato');
    } catch (err) {
      console.error(err);
    }
  }

  async function login() {
    try {
      const res = await axios.post(
        `${API_URL}/auth/login`,
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        'token',
        res.data.access_token
      );

      alert('Login effettuato');
    } catch (err) {
      console.error(err);
    }
  }

  async function createEvent() {
    try {
      const token =
        localStorage.getItem('token');

      await axios.post(
        `${API_URL}/events`,
        {
          title,
          description,
          location,
          image:
            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
          price: 20,
          date: new Date(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      resetForm();

      loadEvents();
    } catch (err) {
      console.error(err);
    }
  }

  async function updateEvent() {
    try {
      const token =
        localStorage.getItem('token');

      await axios.patch(
        `${API_URL}/events/${editingId}`,
        {
          title,
          description,
          location,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditingId(null);

      resetForm();

      loadEvents();
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteEvent(id: number) {
    try {
      const token =
        localStorage.getItem('token');

      await axios.delete(
        `${API_URL}/events/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      loadEvents();
    } catch (err) {
      console.error(err);
    }
  }

  async function checkout(event: any) {
    try {
      const res = await axios.post(
        `${API_URL}/stripe/create-checkout-session`,
        {
          title: event.title,
          price: event.price,
        }
      );

      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
    }
  }

  function editEvent(event: any) {
    setEditingId(event.id);

    setTitle(event.title);
    setDescription(event.description);
    setLocation(event.location);
  }

  function resetForm() {
    setTitle('');
    setDescription('');
    setLocation('');
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-bold mb-10">
          Event Platform
        </h1>

        <div className="grid md:grid-cols-2 gap-10">

          <div className="bg-zinc-900 p-6 rounded-2xl">

            <h2 className="text-2xl font-bold mb-6">
              Authentication
            </h2>

            <input
              className="w-full p-3 rounded bg-zinc-800 mb-4"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <input
              className="w-full p-3 rounded bg-zinc-800 mb-4"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <div className="flex gap-4">

              <button
                onClick={register}
                className="bg-white text-black px-5 py-3 rounded-xl font-bold"
              >
                Register
              </button>

              <button
                onClick={login}
                className="bg-blue-600 px-5 py-3 rounded-xl font-bold"
              >
                Login
              </button>

            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl">

            <h2 className="text-2xl font-bold mb-6">
              {editingId
                ? 'Update Event'
                : 'Create Event'}
            </h2>

            <input
              className="w-full p-3 rounded bg-zinc-800 mb-4"
              placeholder="Title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />

            <input
              className="w-full p-3 rounded bg-zinc-800 mb-4"
              placeholder="Description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />

            <input
              className="w-full p-3 rounded bg-zinc-800 mb-4"
              placeholder="Location"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
            />

            {editingId ? (
              <button
                onClick={updateEvent}
                className="bg-yellow-500 text-black px-5 py-3 rounded-xl font-bold"
              >
                Update Event
              </button>
            ) : (
              <button
                onClick={createEvent}
                className="bg-green-500 text-black px-5 py-3 rounded-xl font-bold"
              >
                Create Event
              </button>
            )}

          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-8">
          Events
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {events.map((event) => (
            <div
              key={event.id}
              className="bg-zinc-900 rounded-2xl overflow-hidden"
            >

              <img
                src={event.image}
                className="w-full h-60 object-cover"
              />

              <div className="p-5">

                <h3 className="text-2xl font-bold mb-2">
                  {event.title}
                </h3>

                <p className="text-zinc-400 mb-2">
                  {event.description}
                </p>

                <p className="mb-4">
                  📍 {event.location}
                </p>

                <p className="text-2xl font-bold mb-6">
                  € {event.price}
                </p>

                <div className="flex flex-wrap gap-3">

                  <button
                    onClick={() =>
                      checkout(event)
                    }
                    className="bg-blue-600 px-4 py-2 rounded-xl font-bold"
                  >
                    Buy Ticket
                  </button>

                  <button
                    onClick={() =>
                      editEvent(event)
                    }
                    className="bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteEvent(event.id)
                    }
                    className="bg-red-600 px-4 py-2 rounded-xl font-bold"
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