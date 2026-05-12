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

  const [editingId, setEditingId] = useState<number | null>(null);

  async function loadEvents() {
    try {
      const res = await axios.get(`${API_URL}/events`);
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
      await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
      });

      alert('Utente registrato');
    } catch (err) {
      console.error(err);
      alert('Errore registrazione');
    }
  }

  async function login() {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      localStorage.setItem('token', res.data.access_token);

      alert('Login effettuato');
    } catch (err) {
      console.error(err);
      alert('Errore login');
    }
  }

  async function createEvent() {
    try {
      const token = localStorage.getItem('token');

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

      alert('Evento creato');

      resetForm();

      loadEvents();
    } catch (err) {
      console.error(err);
      alert('Errore creazione evento');
    }
  }

  async function deleteEvent(id: number) {
    try {
      const token = localStorage.getItem('token');

      await axios.delete(`${API_URL}/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Evento eliminato');

      loadEvents();
    } catch (err) {
      console.error(err);
      alert('Errore eliminazione');
    }
  }

  async function updateEvent() {
    try {
      const token = localStorage.getItem('token');

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

      alert('Evento aggiornato');

      setEditingId(null);

      resetForm();

      loadEvents();
    } catch (err) {
      console.error(err);
      alert('Errore update');
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
      alert('Errore Stripe');
    }
  }

  return (
    <main style={{ padding: 40 }}>

      <h1>Event Platform</h1>

      <hr />

      <h2>Auth</h2>

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <button onClick={register}>
        Register
      </button>

      <button
        onClick={login}
        style={{ marginLeft: 10 }}
      >
        Login
      </button>

      <hr />

      <h2>
        {editingId ? 'Update Event' : 'Create Event'}
      </h2>

      <input
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br />
      <br />

      <input
        placeholder="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br />
      <br />

      <input
        placeholder="location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <br />
      <br />

      {editingId ? (
        <button onClick={updateEvent}>
          Update Event
        </button>
      ) : (
        <button onClick={createEvent}>
          Create Event
        </button>
      )}

      <hr />

      <h2>All Events</h2>

      {events.map((event) => (
        <div
          key={event.id}
          style={{
            border: '1px solid #ccc',
            padding: 20,
            marginBottom: 20,
          }}
        >
          <img
            src={event.image}
            width="300"
          />

          <h3>{event.title}</h3>

          <p>{event.description}</p>

          <p>{event.location}</p>

          <p>€ {event.price}</p>

          <button
            onClick={() => checkout(event)}
          >
            Buy Ticket
          </button>

          <button
            onClick={() => editEvent(event)}
            style={{ marginLeft: 10 }}
          >
            Edit
          </button>

          <button
            onClick={() => deleteEvent(event.id)}
            style={{ marginLeft: 10 }}
          >
            Delete
          </button>
        </div>
      ))}
    </main>
  );
}