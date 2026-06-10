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

type Company = {
  id: string;
  name: string;
};
type PracticeCost = {
  id: string;
  practiceId: string;
  category: string;
  serviceName: string;
  supplierName?: string | null;
  totalCost: number;
  sellingPrice?: number | null;
  marginAmount?: number | null;
  marginPercent?: number | null;
  status: string;
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
  const [companies, setCompanies] = useState<Company[]>([]);
  const [message, setMessage] = useState('');
const [costs, setCosts] = useState<PracticeCost[]>([]);
const [expandedPracticeId, setExpandedPracticeId] =
  useState('');
  const [title, setTitle] = useState('');
  const [businessType, setBusinessType] = useState('Evento');
  const [companyId, setCompanyId] = useState('');
  const [clientName, setClientName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [participants, setParticipants] = useState('');
  const [status, setStatus] = useState('lead');
  const [notes, setNotes] = useState('');

useEffect(() => {
  loadPractices();
  loadCompanies();
  loadCosts();
}, []);

  async function loadCompanies() {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setMessage('Effettua il login per caricare i clienti');
        return;
      }

      const res = await fetch(API_URL + '/companies', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(
          data.message ||
            'Errore caricamento clienti',
        );
        return;
      }

      setCompanies(Array.isArray(data) ? data : []);
    } catch {
      setMessage('Errore caricamento clienti');
    }
  }

  async function loadPractices() {
    try {
      const res = await fetch(API_URL + '/practices');
      const data = await res.json();

      setPractices(Array.isArray(data) ? data : []);
    } catch {
      setMessage('Errore caricamento pratiche');
    }
  }
async function loadCosts() {
  try {
    const res = await fetch(
      API_URL + '/practice-costs',
    );

    const data = await res.json();

    setCosts(Array.isArray(data) ? data : []);
  } catch {
    setMessage(
      'Errore caricamento costi pratiche',
    );
  }
}
  async function createPractice() {
    if (!title || !companyId || !businessType) {
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

      const data = await res.json();

      if (!res.ok) {
        setMessage(
          data.message ||
            'Errore creazione pratica',
        );
        return;
      }

      setTitle('');
      setBusinessType('Evento');
      setCompanyId('');
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
function getPracticeCosts(practiceId: string) {
  return costs.filter(
    (cost) => cost.practiceId === practiceId,
  );
}

function getPracticeTotals(practiceId: string) {
  const practiceCosts =
    getPracticeCosts(practiceId);

  const totalCosts = practiceCosts.reduce(
    (sum, cost) =>
      sum + Number(cost.totalCost || 0),
    0,
  );

  const totalSales = practiceCosts.reduce(
    (sum, cost) =>
      sum + Number(cost.sellingPrice || 0),
    0,
  );

  const margin = totalSales - totalCosts;

  const marginPercent =
    totalSales > 0
      ? (margin / totalSales) * 100
      : 0;

  return {
    totalCosts,
    totalSales,
    margin,
    marginPercent,
  };
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
                placeholder="Titolo pratica *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <select
                value={companyId}
                onChange={(e) => {
                  const selectedId = e.target.value;

                  setCompanyId(selectedId);

                  const company = companies.find(
                    (item) => item.id === selectedId,
                  );

                  setClientName(company?.name || '');
                }}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              >
                <option value="">
                  Seleziona cliente *
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
                practices.map((practice) => {
  const totals = getPracticeTotals(practice.id);
  const practiceCosts = getPracticeCosts(practice.id);
  const isExpanded = expandedPracticeId === practice.id;

  return (
    <article
      key={practice.id}
      className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm"
    >
<div className="min-w-0 flex-1">
  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
    {practice.practiceNumber}
  </p>

  <h3 className="mt-1 break-words text-xl font-bold text-black">
    {practice.title}
  </h3>

  <p className="mt-2 break-words text-zinc-600">
    {practice.clientName}
  </p>

  <p className="mt-1 text-sm text-zinc-500">
    {practice.businessType} · {formatDate(practice.startDate)}
  </p>
</div>

<div className="flex flex-wrap gap-3 xl:justify-end">
  <span className="rounded-full bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-700">
    {statusLabel(practice.status)}
  </span>

  <div className="rounded-2xl bg-zinc-50 px-4 py-3">
    <p className="text-xs text-zinc-500">Costi</p>
    <p className="font-bold">
      {new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR',
      }).format(totals.totalCosts)}
    </p>
  </div>

  <div className="rounded-2xl bg-zinc-50 px-4 py-3">
    <p className="text-xs text-zinc-500">Venduto</p>
    <p className="font-bold">
      {new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR',
      }).format(totals.totalSales)}
    </p>
  </div>

  <div className="rounded-2xl bg-emerald-50 px-4 py-3">
    <p className="text-xs text-emerald-700">Margine</p>
    <p className="font-bold text-emerald-700">
      {new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR',
      }).format(totals.margin)}
    </p>
  </div>

  <button
    onClick={() =>
      setExpandedPracticeId(
        isExpanded ? '' : practice.id,
      )
    }
    className="min-w-14 rounded-2xl bg-black px-5 py-3 font-bold text-white"
  >
    {isExpanded ? '-' : '+'}
  </button>
</div>

      {isExpanded && (
        <div className="mt-6 rounded-2xl bg-zinc-50 p-5">
          {practiceCosts.length === 0 ? (
            <p className="text-zinc-500">
              Nessun costo collegato.
            </p>
          ) : (
            <div className="grid gap-3">
             {practiceCosts.map((cost) => (
  <div
    key={cost.id}
    className="grid gap-3 rounded-xl bg-white p-4 md:grid-cols-[120px_1fr] xl:grid-cols-[120px_1fr_120px_120px_120px]"
  >
  <div className="font-semibold">
                    {cost.category || 'Altro'}
                  </div>

                  <div>
                    <p className="font-bold">
                      {cost.serviceName}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {cost.supplierName || 'Fornitore non indicato'}
                    </p>
                  </div>

                  <div>
                    Costo:{' '}
                    {new Intl.NumberFormat('it-IT', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(Number(cost.totalCost || 0))}
                  </div>

                  <div>
                    Vendita:{' '}
                    {new Intl.NumberFormat('it-IT', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(Number(cost.sellingPrice || 0))}
                  </div>

                  <div className="font-bold text-emerald-700">
                    {new Intl.NumberFormat('it-IT', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(Number(cost.marginAmount || 0))}
                                   </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 flex gap-3">
            <a
              href={`/practices/${practice.id}`}
              className="rounded-xl bg-black px-4 py-2 text-white"
            >
              Apri dettaglio
            </a>

            <button
              onClick={() => deletePractice(practice.id)}
              className="rounded-xl bg-red-100 px-4 py-2 text-red-600"
            >
              Elimina pratica
            </button>
          </div>
        </div>
      )}
    </article>
  );
})
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}