'use client';

import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import jsPDF from 'jspdf';

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
    const res = await fetch(API_URL + '/events');
    const data = await res.json();
    setEvents(Array.isArray(data) ? data : []);
  }

  async function loadTickets() {
    const res = await fetch(API_URL + '/tickets');
    const data = await res.json();
    setTickets(Array.isArray(data) ? data : []);
  }

  async function createTicket() {
    if (!eventId || !fullName || !email) {
      setMessage('Compila tutti i campi');
      return;
    }

    const res = await fetch(API_URL + '/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, fullName, email }),
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

  function downloadTicketPdf(ticket: Ticket) {
    const doc = new jsPDF();

    doc.setFontSize(24);
    doc.text('Uniquo Ticket', 20, 25);

    doc.setFontSize(14);
    doc.text('Biglietto evento', 20, 38);

    doc.setFontSize(12);
    doc.text('Partecipante:', 20, 60);
    doc.text(ticket.fullName, 20, 68);

    doc.text('Email:', 20, 84);
    doc.text(ticket.email, 20, 92);

    doc.text('Evento:', 20, 108);
    doc.text(ticket.event?.title || 'Evento non disponibile', 20, 116);

    doc.text('Stato:', 20, 132);
    doc.text(
      ticket.checkedIn ? 'Check-in effettuato' : 'Da validare',
      20,
      140,
    );

    doc.text('QR Code:', 20, 156);
    doc.text(ticket.qrCode, 20, 164, {
      maxWidth: 170,
    });

    doc.setFontSize(10);
    doc.text(
      'Presenta questo QR code all’ingresso per effettuare il check-in.',
      20,
      280,
    );

    doc.save(`ticket-${ticket.fullName}.pdf`);
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#111]">
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
            className="rounded-2xl bg-black px-5 py-3 font-semibold text-white"
          >
            Dashboard
          </a>
        </div>

        {message && (
          <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            {message}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              Crea ticket
            </h2>

            <div className="space-y-4">
              <select
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              >
                <option value="">Seleziona evento</option>

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
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <input
                placeholder="Email partecipante"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <button
                onClick={createTicket}
                className="w-full rounded-2xl bg-black px-6 py-4 font-semibold text-white"
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
                className="rounded-2xl bg-black px-5 py-3 text-white"
              >
                Refresh
              </button>
            </div>

            <div className="grid gap-5">
              {tickets.length === 0 ? (
                <div className="rounded-[2rem] border border-zinc-200 bg-white p-10 text-center text-zinc-500 shadow-sm">
                  Nessun ticket creato.
                </div>
              ) : (
                tickets.map((ticket) => (
                  <article
                    key={ticket.id}
                    className="grid gap-6 rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-sm md:grid-cols-[160px_1fr]"
                  >
                    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                      <QRCode value={ticket.qrCode} size={128} />
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold">
                        {ticket.fullName}
                      </h3>

                      <div className="mt-4 grid gap-2 text-zinc-600">
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
                        <p className="break-all text-xs text-zinc-400">
                          QR: {ticket.qrCode}
                        </p>
                      </div>

                      <button
                        onClick={() => downloadTicketPdf(ticket)}
                        className="mt-5 rounded-2xl bg-black px-5 py-3 font-semibold text-white"
                      >
                        Scarica PDF
                      </button>
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