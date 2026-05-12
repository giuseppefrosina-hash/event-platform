'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://event-platform-vr94.onrender.com';

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  async function loadEvents() {
    try {
      const res = await axios.get(`${API_URL}/events`);
      console.log('EVENTS:', res.data);
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
      const res = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
      });

      console.log('REGISTER RESPONSE:', res.data);
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

      console.log('LOGIN RESPONSE:', res.data);

      localStorage.setItem('token', res.data.access_token);

      console.log(
        'TOKEN SALVATO:',
        localStorage.getItem('token')
      );

      alert('Login effettuato');
    } catch (err) {
      console.error(err);
      alert('Errore login');
    }
  }

  async function createEvent() {
    try {
      const token = localStorage.getItem('token');

      console.log('TOKEN USATO:', token);

      const res = await axios.post(
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

      console.log('CREATE EVENT RESPONSE:', res.data);

      alert('Evento creato!');

      loadEvents();
    } catch (err) {
      console.error('CREATE EVENT ERROR:', err);
      alert('Errore creazione evento');
    }
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Event Platform</h1>

      <hr />

      <h2>Register / Login</h2>

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <button onClick={register}>Register</button>

      <button onClick={login} style={{ marginLeft: 10 }}>
        Login
      </button>

      <hr />

      <h2>Create Event</h2>

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

      <button onClick={createEvent}>
        Create Event
      </button>

      <hr />

      <h2>All Events</h2>

      {events.map((event: any) => (
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
        </div>
      ))}
    </main>
  );
}