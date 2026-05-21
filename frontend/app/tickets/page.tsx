'use client';

import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

const API_URL = 'https://api.uniquo.it';

type EventItem = {
  id: string;
  title: string;
};

type Ticket = {
  id: string;
  fullName: string;
  email: string;
  qrCode: string;
  checkedIn: boolean;
  event?: EventItem;
};

export default function TicketsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const [eventId, setEventId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadEvents();
    loadTickets();
  }, []);

  async function loadEvents() {
    const res = await fetch(`${API_URL}/events`);
    const data = await res.json();
    setEvents(Array.isArray(data) ? data : []);
  }

  async function loadTickets() {
    const res = await fetch(`${API_URL}/tickets`);
    const data = await res.json();
    setTickets(Array.isArray(data) ? data : []);
  }

  async function createTicket() {
    if (!eventId || !fullName || !email) {
      setMessage('Compila tutti i campi');
      return;
    }

    const res = await fetch(`${API_URL}/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventId,
        fullName,
        email,
      }),
    });

    if (!res.ok) {
      setMessage('Errore creazione ticket');
      return;
    }

    setEventId('');
    setFullName('');
    setEmail('');
    setMessage('Ticket creato con successo');
    loadTickets();
  }

  return (
    <main className="min-h-screen bg-[#0b0b0f] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-zinc-500">
              Ticketing
            </p>
            <h1 className="text-5xl font-bold">
              Biglietti evento
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
              Crea ticket
            </h2>

            <div className="space-y-4">
              <select
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
              >
                <option value="">
                  Seleziona evento
                </option>

                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>

              <input
                placeholder="Nome partecipante"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
              />

              <input
                placeholder="Email partecipante"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
              />

              <button
                onClick={createTicket}
                className="w-full rounded-2xl bg-white px-6 py-4 font-semibold text-black"
              >
                Genera ticket
              </button>
            </div>
          </section>

          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                Lista ticket
              </h2>

              <button
                onClick={loadTickets}
                className="rounded-2xl bg-white px-5 py-3 text-black"
              >
                Refresh
              </button>
            </div>

            <div className="grid gap-5">
              {tickets.length === 0 ? (
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-10 text-center text-zinc-500">
                  Nessun ticket creato.
                </div>
              ) : (
                tickets.map((ticket) => (
                  <article
                    key={ticket.id}
                    className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 md:grid-cols-[160px_1fr]"
                  >
                    <div className="rounded-2xl bg-white p-4">
                      <QRCode
                        value={ticket.qrCode}
                        size={128}
                      />
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold">
                        {ticket.fullName}
                      </h3>

                      <div className="mt-4 grid gap-2 text-zinc-400">
                        <p>📧 {ticket.email}</p>
                        <p>
                          🎟️ Evento:{' '}
                          {ticket.event?.title ||
                            'Evento non disponibile'}
                        </p>
                        <p>
                          Stato:{' '}
                          {ticket.checkedIn
                            ? '✅ Check-in effettuato'
                            : '🟡 Da validare'}
                        </p>
                        <p className="break-all text-xs">
                          QR: {ticket.qrCode}
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