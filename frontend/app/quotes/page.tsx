'use client';

import { useEffect, useMemo, useState } from 'react';

const API_URL = 'https://api.uniquo.it';

type EventItem = {
  id: string;
  title: string;
};

type Quote = {
  id: string;
  quoteNumber: string;
  clientName: string;
  totalAmount: number;
  vatAmount: number;
  status: string;
  event?: EventItem;
};

export default function QuotesPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [message, setMessage] = useState('');

  const [eventId, setEventId] = useState('');
  const [quoteNumber, setQuoteNumber] = useState('');
  const [clientName, setClientName] = useState('');
  const [amount, setAmount] = useState('');
  const [vatRate, setVatRate] = useState('22');
  const [status, setStatus] = useState('draft');

  useEffect(() => {
    loadEvents();
    loadQuotes();
  }, []);

  const totals = useMemo(() => {
    const base = Number(amount || 0);
    const vat = Number(vatRate || 0);
    const vatAmount = base * (vat / 100);
    const totalAmount = base + vatAmount;

    return {
      vatAmount: Number(vatAmount.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2)),
    };
  }, [amount, vatRate]);

  async function loadEvents() {
    const res = await fetch(API_URL + '/events');
    const data = await res.json();
    setEvents(Array.isArray(data) ? data : []);
  }

  async function loadQuotes() {
    const res = await fetch(API_URL + '/quotes');
    const data = await res.json();
    setQuotes(Array.isArray(data) ? data : []);
  }

  async function createQuote() {
    if (!eventId || !quoteNumber || !clientName || !amount) {
      setMessage('Evento, numero preventivo, cliente e importo sono obbligatori');
      return;
    }

    const res = await fetch(API_URL + '/quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventId,
        quoteNumber,
        clientName,
        totalAmount: totals.totalAmount,
        vatAmount: totals.vatAmount,
        status,
      }),
    });

    if (!res.ok) {
      setMessage('Errore creazione preventivo');
      return;
    }

    setEventId('');
    setQuoteNumber('');
    setClientName('');
    setAmount('');
    setVatRate('22');
    setStatus('draft');

    setMessage('Preventivo creato con successo');
    loadQuotes();
  }

  async function deleteQuote(id: string) {
    await fetch(API_URL + '/quotes/' + id, {
      method: 'DELETE',
    });

    setMessage('Preventivo eliminato');
    loadQuotes();
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#111]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-zinc-500">
              Quote Management
            </p>

            <h1 className="text-5xl font-bold">
              Preventivi
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
              Nuovo preventivo
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
                placeholder="Numero preventivo"
                value={quoteNumber}
                onChange={(e) => setQuoteNumber(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <input
                placeholder="Cliente"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <input
                type="number"
                placeholder="Imponibile"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <input
                type="number"
                placeholder="IVA %"
                value={vatRate}
                onChange={(e) => setVatRate(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              >
                <option value="draft">Bozza</option>
                <option value="sent">Inviato</option>
                <option value="accepted">Accettato</option>
                <option value="rejected">Rifiutato</option>
              </select>

              <div className="rounded-3xl bg-black p-6 text-white">
                <p>IVA: € {totals.vatAmount.toFixed(2)}</p>
                <p className="mt-2 text-2xl font-bold">
                  Totale: € {totals.totalAmount.toFixed(2)}
                </p>
              </div>

              <button
                onClick={createQuote}
                className="w-full rounded-2xl bg-black px-6 py-4 font-semibold text-white"
              >
                Crea preventivo
              </button>
            </div>
          </section>

          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                Lista preventivi
              </h2>

              <button
                onClick={loadQuotes}
                className="rounded-2xl bg-black px-5 py-3 text-white"
              >
                Refresh
              </button>
            </div>

            <div className="grid gap-5">
              {quotes.length === 0 ? (
                <div className="rounded-[2rem] border border-zinc-200 bg-white p-10 text-center text-zinc-500 shadow-sm">
                  Nessun preventivo creato.
                </div>
              ) : (
                quotes.map((quote) => (
                  <article
                    key={quote.id}
                    className="rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-zinc-400">
                          {quote.status}
                        </p>

                        <h3 className="text-2xl font-bold">
                          Preventivo {quote.quoteNumber}
                        </h3>

                        <div className="mt-4 grid gap-2 text-zinc-600">
                          <p>Cliente: {quote.clientName}</p>
                          <p>
                            Evento:{' '}
                            {quote.event?.title ||
                              'Evento non disponibile'}
                          </p>
                          <p>IVA: € {Number(quote.vatAmount || 0).toFixed(2)}</p>
                          <p className="font-bold text-black">
                            Totale: € {Number(quote.totalAmount || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteQuote(quote.id)}
                        className="rounded-xl bg-red-100 px-4 py-2 text-red-600"
                      >
                        Elimina
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