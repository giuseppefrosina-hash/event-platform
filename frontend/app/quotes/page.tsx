'use client';

import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../../components/Sidebar';

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
  paidAmount?: number;
  remainingAmount?: number;
  dueDate?: string | null;
  paidDate?: string | null;
  status: string;
  event?: EventItem;
  practice?: Practice | null;
practiceId?: string | null;
};

type Practice = {
  id: string;
  practiceNumber: string;
  title: string;
  clientName: string;
};

export default function QuotesPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
const [practices, setPractices] = useState<Practice[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [message, setMessage] = useState('');

  const [eventId, setEventId] = useState('');
  const [practiceId, setPracticeId] = useState('');
  const [quoteNumber, setQuoteNumber] = useState('');
  const [clientName, setClientName] = useState('');
  const [amount, setAmount] = useState('');
  const [vatRate, setVatRate] = useState('22');
  const [status, setStatus] = useState('draft');
  const [dueDate, setDueDate] = useState('');

const [paymentInputs, setPaymentInputs] =
  useState<Record<string, string>>({});

const [dueDateInputs, setDueDateInputs] =
  useState<Record<string, string>>({});

useEffect(() => {
  loadEvents();
  loadPractices();
  loadQuotes();
}, []);
async function loadPractices() {
  const res = await fetch(API_URL + '/practices');
  const data = await res.json();

  setPractices(Array.isArray(data) ? data : []);
}
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
function formatDate(value?: string | null) {
  if (!value) return 'Non indicata';
  return new Date(value).toLocaleDateString('it-IT');
}

function getDateInputValue(value?: string | null) {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
}

function getRemainingAmount(quote: Quote) {
  return Math.max(
    Number(quote.totalAmount || 0) -
      Number(quote.paidAmount || 0),
    0,
  );
}

function getPaymentStatus(quote: Quote) {
  const remainingAmount = getRemainingAmount(quote);

  if (quote.status === 'paid' || remainingAmount <= 0) {
    return {
      label: 'Pagato',
      className: 'bg-emerald-100 text-emerald-700',
    };
  }

  if (!quote.dueDate) {
    return {
      label: 'Senza scadenza',
      className: 'bg-zinc-100 text-zinc-600',
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(quote.dueDate);
  due.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil(
    (due.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24),
  );

  if (diffDays < 0) {
    return {
      label: 'Scaduto',
      className: 'bg-red-100 text-red-700',
    };
  }

  if (diffDays <= 7) {
    return {
      label: 'In scadenza',
      className: 'bg-amber-100 text-amber-700',
    };
  }

  return {
    label: 'Da incassare',
    className: 'bg-blue-100 text-blue-700',
  };
}

  function statusLabel(statusValue: string) {
    if (statusValue === 'draft') return 'Bozza';
    if (statusValue === 'sent') return 'Inviato';
    if (statusValue === 'accepted') return 'Accettato';
    if (statusValue === 'rejected') return 'Rifiutato';
    if (statusValue === 'invoiced') return 'Fatturato';
    if (statusValue === 'paid') return 'Pagato';

    return statusValue;
  }

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
      setMessage(
        'Evento, numero preventivo, cliente e importo sono obbligatori',
      );
      return;
    }

    const res = await fetch(API_URL + '/quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventId,
        practiceId: practiceId || undefined,
        quoteNumber,
        clientName,
        totalAmount: totals.totalAmount,
        vatAmount: totals.vatAmount,
        paidAmount: 0,
        dueDate: dueDate || undefined,
        status,
      }),
    });

    if (!res.ok) {
      setMessage('Errore creazione preventivo');
      return;
    }

    setEventId('');
    setPracticeId('');
    setQuoteNumber('');
    setClientName('');
    setAmount('');
    setVatRate('22');
    setStatus('draft');
    setDueDate('');

    setMessage('Preventivo creato con successo');
    loadQuotes();
  }

  async function updateQuotePayment(quote: Quote) {
    const paidAmount = Number(
      paymentInputs[quote.id] ??
        quote.paidAmount ??
        0,
    );

    const selectedDueDate =
      dueDateInputs[quote.id] ??
      getDateInputValue(quote.dueDate);

    const res = await fetch(
      API_URL + '/quotes/' + quote.id,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paidAmount,
          dueDate: selectedDueDate || null,
        }),
      },
    );

    if (!res.ok) {
      setMessage('Errore aggiornamento pagamento');
      return;
    }

    setMessage('Pagamento e scadenza aggiornati');
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
  <div className="flex min-h-screen">
    <Sidebar />

    <main className="flex-1 bg-[#f5f5f7] text-[#111]">
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
                onChange={(e) =>
                  setEventId(e.target.value)
                }
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              >
                <option value="">
                  Seleziona evento
                </option>

                {events.map((event) => (
                  <option
                    key={event.id}
                    value={event.id}
                  >
                    {event.title}
                  </option>
                ))}
              </select>

              <select
                value={practiceId}
                onChange={(e) => {
                  const selectedId = e.target.value;

                  setPracticeId(selectedId);

                  const practice = practices.find(
                    (item) =>
                      item.id === selectedId,
                  );

                  if (practice) {
                    setClientName(
                      practice.clientName,
                    );
                  }
                }}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              >
                <option value="">
                  Seleziona pratica
                </option>

                {practices.map((practice) => (
                  <option
                    key={practice.id}
                    value={practice.id}
                  >
                    {practice.practiceNumber} -{' '}
                    {practice.title}
                  </option>
                ))}
              </select>

              <input
                placeholder="Numero preventivo"
                value={quoteNumber}
                onChange={(e) =>
                  setQuoteNumber(e.target.value)
                }
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />
              <input
                placeholder="Cliente"
                value={clientName}
                onChange={(e) =>
                  setClientName(e.target.value)
                }
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <input
                type="number"
                placeholder="Imponibile"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <input
                type="number"
                placeholder="IVA %"
                value={vatRate}
                onChange={(e) =>
                  setVatRate(e.target.value)
                }
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <input
                type="date"
                value={dueDate}
                onChange={(e) =>
                  setDueDate(e.target.value)
                }
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              >
                <option value="draft">Bozza</option>
                <option value="sent">Inviato</option>
                <option value="accepted">
                  Accettato
                </option>
                <option value="invoiced">
                  Fatturato
                </option>
                <option value="paid">Pagato</option>
                <option value="rejected">
                  Rifiutato
                </option>
              </select>

              <div className="rounded-3xl bg-black p-6 text-white">
                <p>
                  IVA: €{' '}
                  {totals.vatAmount.toFixed(2)}
                </p>

                <p className="mt-2 text-2xl font-bold">
                  Totale: €{' '}
                  {totals.totalAmount.toFixed(2)}
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
                quotes.map((quote) => {
                  const remainingAmount =
                    getRemainingAmount(quote);

                  const paymentStatus =
                    getPaymentStatus(quote);

                  return (
                    <article
                      key={quote.id}
                      className="rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="mb-3 flex flex-wrap gap-2">
                            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-zinc-600">
                              {statusLabel(
                                quote.status,
                              )}
                            </span>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] ${paymentStatus.className}`}
                            >
                              {
                                paymentStatus.label
                              }
                            </span>
                          </div>

                          <h3 className="text-2xl font-bold">
                            Preventivo{' '}
                            {quote.quoteNumber}
                          </h3>

                          <div className="mt-4 grid gap-2 text-zinc-600">
                            <p>
                              Cliente:{' '}
                              {quote.clientName}
                            </p>

                            <p>
                              Evento:{' '}
                              {quote.event?.title ||
                                'Evento non disponibile'}
                            </p>

                            <p>
                              Pratica:{' '}
                              {quote.practice
                                ? `${quote.practice.practiceNumber} - ${quote.practice.title}`
                                : 'Non collegata'}
                            </p>

                            <p>
                              Scadenza incasso:{' '}
                              {formatDate(
                                quote.dueDate,
                              )}
                            </p>

                            <p>
                              Data pagamento:{' '}
                              {formatDate(
                                quote.paidDate,
                              )}
                            </p>

                            <p>
                              IVA: €{' '}
                              {Number(
                                quote.vatAmount ||
                                  0,
                              ).toFixed(2)}
                            </p>

                            <p className="font-bold text-black">
                              Totale: €{' '}
                              {Number(
                                quote.totalAmount ||
                                  0,
                              ).toFixed(2)}
                            </p>

                            <p className="text-emerald-700">
                              Incassato: €{' '}
                              {Number(
                                quote.paidAmount ||
                                  0,
                              ).toFixed(2)}
                            </p>

                            <p className="text-red-600">
                              Da incassare: €{' '}
                              {Number(
                                remainingAmount ||
                                  0,
                              ).toFixed(2)}
                            </p>
                          </div>

                          <div className="mt-5 rounded-2xl bg-zinc-50 p-4">
                            <p className="mb-3 text-sm font-semibold text-zinc-600">
                              Aggiorna pagamento
                            </p>

                            <div className="grid gap-3 md:grid-cols-3">
                              <input
                                type="number"
                                placeholder="Importo incassato"
                                value={
                                  paymentInputs[
                                    quote.id
                                  ] ??
                                  String(
                                    quote.paidAmount ||
                                      0,
                                  )
                                }
                                onChange={(e) =>
                                  setPaymentInputs(
                                    {
                                      ...paymentInputs,
                                      [quote.id]:
                                        e.target
                                          .value,
                                    },
                                  )
                                }
                                className="rounded-xl border border-zinc-200 bg-white px-4 py-3 outline-none"
                              />

                              <input
                                type="date"
                                value={
                                  dueDateInputs[
                                    quote.id
                                  ] ??
                                  getDateInputValue(
                                    quote.dueDate,
                                  )
                                }
                                onChange={(e) =>
                                  setDueDateInputs({
                                    ...dueDateInputs,
                                    [quote.id]:
                                      e.target.value,
                                  })
                                }
                                className="rounded-xl border border-zinc-200 bg-white px-4 py-3 outline-none"
                              />

                              <button
                                onClick={() =>
                                  updateQuotePayment(
                                    quote,
                                  )
                                }
                                className="rounded-xl bg-black px-4 py-3 text-white"
                              >
                                Salva
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          <a
                            href={`/quotes/${quote.id}`}
                            className="rounded-xl bg-black px-4 py-2 text-center text-white"
                          >
                            Scarica PDF
                          </a>

                          <button
                            onClick={() =>
                              deleteQuote(quote.id)
                            }
                            className="rounded-xl bg-red-100 px-4 py-2 text-red-600"
                          >
                            Elimina
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
</main>
</div>
);
}