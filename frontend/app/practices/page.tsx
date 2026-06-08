'use client';

import { useEffect, useState } from 'react';

const API_URL = 'https://api.uniquo.it';

type Practice = {
  id: string;
  practiceNumber: string;
  title: string;
  businessType: string;
  clientName: string;
  startDate?: string | null;
  endDate?: string | null;
  participants: number;
  status: string;
  notes?: string | null;
  createdAt: string;
};

function formatDate(value?: string | null) {
  if (!value) return 'Non indicata';
  return new Date(value).toLocaleDateString('it-IT');
}

function statusLabel(value: string) {
  if (value === 'lead') return 'Lead';
  if (value === 'preventivo') return 'Preventivo';
  if (value === 'opzionata') return 'Opzionata';
  if (value === 'confermata') return 'Confermata';
  if (value === 'in_corso') return 'In corso';
  if (value === 'chiusa') return 'Chiusa';
  if (value === 'annullata') return 'Annullata';

  return value;
}

export default function PracticesPage() {
  const [practices, setPractices] = useState<Practice[]>([]);
  const [message, setMessage] = useState('');

  const [title, setTitle] = useState('');
  const [businessType, setBusinessType] = useState('Evento');
  const [clientName, setClientName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [participants, setParticipants] = useState('');
  const [status, setStatus] = useState('lead');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadPractices();
  }, []);

  async function loadPractices() {
    try {
      const res = await fetch(API_URL + '/practices');
      const data = await res.json();

      setPractices(Array.isArray(data) ? data : []);
    } catch {
      setMessage('Errore caricamento pratiche');
    }
  }

  async function createPractice() {
    if (!title || !clientName || !businessType) {
      setMessage('Titolo, cliente e business sono obbligatori');
      return;
    }

    try {
      const res = await fetch(API_URL + '/practices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          businessType,
          clientName,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          participants: Number(participants || 0),
          status,
          notes,
        }),
      });

      if (!res.ok) {
        setMessage('Errore creazione pratica');
        return;
      }

      setTitle('');
      setBusinessType('Evento');
      setClientName('');
      setStartDate('');
      setEndDate('');
      setParticipants('');
      setStatus('lead');
      setNotes('');

      setMessage('Pratica creata con successo');
      loadPractices();
    } catch {
      setMessage('Errore connessione backend');
    }
  }

  async function deletePractice(id: string) {
    try {
      const res = await fetch(API_URL + '/practices/' + id, {
        method: 'DELETE',
      });

      if (!res.ok) {
        setMessage('Errore eliminazione pratica');
        return;
      }

      setMessage('Pratica eliminata');
      loadPractices();
    } catch {
      setMessage('Errore eliminazione pratica');
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#111]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-zinc-500">
              Practice Management
            </p>

            <h1 className="text-5xl font-bold">
              Pratiche
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
              Nuova pratica
            </h2>

            <div className="space-y-4">
              <input
                placeholder="Titolo pratica"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <input
                placeholder="Cliente"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              >
                <option value="Evento">Evento</option>
                <option value="Incentive">Incentive</option>
                <option value="Team Building">Team Building</option>
                <option value="Viaggio Leisure">Viaggio Leisure</option>
                <option value="Travel Voucher">Travel Voucher</option>
                <option value="Servizi">Servizi</option>
                <option value="Altro">Altro</option>
              </select>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
                />

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
                />
              </div>

              <input
                type="number"
                placeholder="Numero partecipanti"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              >
                <option value="lead">Lead</option>
                <option value="preventivo">Preventivo</option>
                <option value="opzionata">Opzionata</option>
                <option value="confermata">Confermata</option>
                <option value="in_corso">In corso</option>
                <option value="chiusa">Chiusa</option>
                <option value="annullata">Annullata</option>
              </select>

              <textarea
                placeholder="Note pratica"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-32 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <button
                onClick={createPractice}
                className="w-full rounded-2xl bg-black px-6 py-4 font-semibold text-white"
              >
                Crea pratica
              </button>
            </div>
          </section>

          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                Lista pratiche
              </h2>

              <button
                onClick={loadPractices}
                className="rounded-2xl bg-black px-5 py-3 text-white"
              >
                Refresh
              </button>
            </div>

            <div className="grid gap-5">
              {practices.length === 0 ? (
                <div className="rounded-[2rem] border border-zinc-200 bg-white p-10 text-center text-zinc-500 shadow-sm">
                  Nessuna pratica creata.
                </div>
              ) : (
                practices.map((practice) => (
                  <article
                    key={practice.id}
                    className="rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-zinc-400">
                          {practice.practiceNumber}
                        </p>

                        <h3 className="text-2xl font-bold">
                          {practice.title}
                        </h3>

                        <div className="mt-4 grid gap-2 text-zinc-600">
                          <p>
                            Cliente: {practice.clientName}
                          </p>

                          <p>
                            Business: {practice.businessType}
                          </p>

                          <p>
                            Date: {formatDate(practice.startDate)} -{' '}
                            {formatDate(practice.endDate)}
                          </p>

                          <p>
                            Partecipanti: {practice.participants || 0}
                          </p>

                          <p>
                            Stato: {statusLabel(practice.status)}
                          </p>

                          {practice.notes && (
                            <p>
                              Note: {practice.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <a
                          href={`/practices/${practice.id}`}
                          className="rounded-xl bg-black px-4 py-2 text-center text-white"
                        >
                          Apri
                        </a>

                        <button
                          onClick={() => deletePractice(practice.id)}
                          className="rounded-xl bg-red-100 px-4 py-2 text-red-600"
                        >
                          Elimina
                        </button>
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