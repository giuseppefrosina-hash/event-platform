'use client';

import { useEffect, useState } from 'react';

const API_URL = 'https://api.uniquo.it';

type Company = {
  id: string;
  name: string;
};

type EventItem = {
  id: string;
  title: string;
  description?: string;
  location?: string;
  date: string;
  price?: number;
  image?: string;
  company?: Company;
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [message, setMessage] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [price, setPrice] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadEvents();
    loadCompanies();
  }, []);

  async function loadEvents() {
    try {
      const res = await fetch(`${API_URL}/events`);
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch {
      setMessage('Errore caricamento eventi');
    }
  }

  async function loadCompanies() {
    try {
      const token = localStorage.getItem('token');

      if (!token) return;

      const res = await fetch(`${API_URL}/companies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setCompanies(Array.isArray(data) ? data : []);
    } catch {
      setCompanies([]);
    }
  }

  async function uploadCover(file: File) {
    try {
      setUploading(true);
      setMessage('Caricamento immagine...');

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_URL}/upload/image`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage('Errore upload immagine');
        return;
      }

      setImageUrl(data.url || data.secure_url);
      setMessage('Immagine caricata');
    } catch {
      setMessage('Errore upload immagine');
    } finally {
      setUploading(false);
    }
  }

  async function createEvent() {
    try {
      if (!title || !date) {
        setMessage('Titolo e data sono obbligatori');
        return;
      }

      const res = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          location,
          date,
          price: Number(price || 0),
          image: imageUrl,
          companyId: companyId || undefined,
        }),
      });

      if (!res.ok) {
        setMessage('Errore creazione evento');
        return;
      }

      setTitle('');
      setDescription('');
      setLocation('');
      setDate('');
      setPrice('');
      setCompanyId('');
      setImageUrl('');

      setMessage('Evento creato con successo');
      loadEvents();
    } catch {
      setMessage('Errore connessione backend');
    }
  }

  async function deleteEvent(id: string) {
    try {
      await fetch(`${API_URL}/events/${id}`, {
        method: 'DELETE',
      });

      setMessage('Evento eliminato');
      loadEvents();
    } catch {
      setMessage('Errore eliminazione evento');
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0b0f] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-zinc-500">
              Event Management
            </p>
            <h1 className="text-5xl font-bold">
              Eventi
            </h1>
          </div>

          <a
            href="/dashboard"
            className="rounded-2xl bg-white px-5 py-3 font-semibold text-black"
          >
            Dashboard
          </a>
        </div>

        {message && (
          <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.06] p-5">
            {message}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8">
            <h2 className="mb-6 text-2xl font-bold">
              Nuovo evento
            </h2>

            <div className="space-y-4">
              <div className="rounded-2xl border border-dashed border-white/20 bg-black/20 p-5 text-center">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Cover evento"
                    className="mb-4 h-44 w-full rounded-2xl object-cover"
                  />
                ) : (
                  <div className="mb-4 flex h-44 items-center justify-center rounded-2xl bg-white/10 text-zinc-500">
                    Cover evento
                  </div>
                )}

                <label className="cursor-pointer rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black">
                  {uploading
                    ? 'Caricamento...'
                    : 'Carica cover'}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadCover(file);
                    }}
                  />
                </label>
              </div>

              <input
                placeholder="Titolo evento"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
              />

              <textarea
                placeholder="Descrizione"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                className="min-h-28 w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
              />

              <input
                placeholder="Luogo"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
              />

              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
              />

              <input
                placeholder="Prezzo"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
              />

              <select
                value={companyId}
                onChange={(e) =>
                  setCompanyId(e.target.value)
                }
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
              >
                <option value="">
                  Nessuna azienda collegata
                </option>

                {companies.map((company) => (
                  <option
                    key={company.id}
                    value={company.id}
                  >
                    {company.name}
                  </option>
                ))}
              </select>

              <button
                onClick={createEvent}
                className="w-full rounded-2xl bg-white px-6 py-4 font-semibold text-black"
              >
                Crea evento
              </button>
            </div>
          </section>

          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                Lista eventi
              </h2>

              <button
                onClick={loadEvents}
                className="rounded-2xl bg-white px-5 py-3 text-black"
              >
                Refresh
              </button>
            </div>

            <div className="grid gap-6">
              {events.length === 0 ? (
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-10 text-center text-zinc-500">
                  Nessun evento trovato.
                </div>
              ) : (
                events.map((event) => (
                  <article
                    key={event.id}
                    className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06]"
                  >
                    {event.image && (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="h-64 w-full object-cover"
                      />
                    )}

                    <div className="p-7">
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-3xl font-bold">
                            {event.title}
                          </h3>

                          {event.company && (
                            <p className="mt-2 text-zinc-400">
                              Azienda:{' '}
                              {event.company.name}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() =>
                            deleteEvent(event.id)
                          }
                          className="rounded-xl bg-red-500/20 px-4 py-2 text-red-300"
                        >
                          Elimina
                        </button>
                      </div>

                      <p className="mb-4 text-zinc-400">
                        {event.description ||
                          'Nessuna descrizione'}
                      </p>

                      <div className="grid gap-2 text-zinc-300">
                        <p>
                          📍{' '}
                          {event.location ||
                            'Luogo non indicato'}
                        </p>
                        <p>
                          📅{' '}
                          {new Date(
                            event.date,
                          ).toLocaleString('it-IT')}
                        </p>
                        <p>
                          💶 € {event.price || 0}
                        </p>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}