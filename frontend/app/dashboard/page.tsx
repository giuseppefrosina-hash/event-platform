'use client';

import { useEffect, useMemo, useState } from 'react';

const API_URL = 'https://api.uniquo.it';

type EventItem = {
  id: string;
  title: string;
  price?: number;
};

type EventCost = {
  id: string;
  totalCost: number;
};

type Quote = {
  id: string;
  totalAmount: number;
  vatAmount: number;
  status: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(value || 0);
}

export default function DashboardPage() {
  const [eventsCount, setEventsCount] = useState(0);
  const [companiesCount, setCompaniesCount] = useState(0);
  const [ticketsCount, setTicketsCount] = useState(0);
  const [costsCount, setCostsCount] = useState(0);
  const [quotesCount, setQuotesCount] = useState(0);
  const [acceptedQuotesCount, setAcceptedQuotesCount] = useState(0);

  const [eventRevenue, setEventRevenue] = useState(0);
  const [quotesRevenue, setQuotesRevenue] = useState(0);
  const [totalCosts, setTotalCosts] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const grossMargin = quotesRevenue - totalCosts;

  const marginPercent = useMemo(() => {
    if (!quotesRevenue) return 0;
    return (grossMargin / quotesRevenue) * 100;
  }, [grossMargin, quotesRevenue]);

  async function loadDashboard() {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        window.location.href = '/';
        return;
      }

      const [
        eventsRes,
        companiesRes,
        ticketsRes,
        costsRes,
        quotesRes,
      ] = await Promise.all([
        fetch(API_URL + '/events'),
        fetch(API_URL + '/companies', {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }),
        fetch(API_URL + '/tickets'),
        fetch(API_URL + '/event-costs'),
        fetch(API_URL + '/quotes'),
      ]);

      const events = await eventsRes.json();
      const companies = await companiesRes.json();
      const tickets = await ticketsRes.json();
      const costs = await costsRes.json();
      const quotes = await quotesRes.json();

      const safeEvents: EventItem[] = Array.isArray(events)
        ? events
        : [];

      const safeCosts: EventCost[] = Array.isArray(costs)
        ? costs
        : [];

      const safeQuotes: Quote[] = Array.isArray(quotes)
        ? quotes
        : [];

      setEventsCount(safeEvents.length);
      setCompaniesCount(Array.isArray(companies) ? companies.length : 0);
      setTicketsCount(Array.isArray(tickets) ? tickets.length : 0);
      setCostsCount(safeCosts.length);
      setQuotesCount(safeQuotes.length);
      setAcceptedQuotesCount(
        safeQuotes.filter(
          (quote) => quote.status === 'accepted',
        ).length,
      );

      const totalEventRevenue = safeEvents.reduce(
        (acc, event) => acc + Number(event.price || 0),
        0,
      );

      const totalQuoteRevenue = safeQuotes.reduce(
        (acc, quote) => acc + Number(quote.totalAmount || 0),
        0,
      );

      const totalEventCosts = safeCosts.reduce(
        (acc, cost) => acc + Number(cost.totalCost || 0),
        0,
      );

      setEventRevenue(totalEventRevenue);
      setQuotesRevenue(totalQuoteRevenue);
      setTotalCosts(totalEventCosts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#111]">
      <div className="flex min-h-screen">
        <aside className="w-72 border-r border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="mb-10 text-2xl font-bold">
            Uniquo
          </h1>

          <nav className="space-y-6 text-zinc-500">
            <div>
              <p className="mb-2 px-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
                Dashboard
              </p>

              <a
                className="block rounded-xl bg-black px-4 py-3 text-white"
                href="/dashboard"
              >
                Dashboard
              </a>
            </div>

            <div>
              <p className="mb-2 px-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
                Eventi
              </p>

              <a
                className="block rounded-xl px-4 py-3 hover:bg-zinc-100"
                href="/events"
              >
                Eventi
              </a>

              <a
                className="block rounded-xl px-4 py-3 hover:bg-zinc-100"
                href="/tickets"
              >
                Ticket
              </a>

              <a
                className="block rounded-xl px-4 py-3 hover:bg-zinc-100"
                href="/checkin"
              >
                Check-in QR
              </a>
            </div>

            <div>
              <p className="mb-2 px-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
                Operativo
              </p>

              <a
                className="block rounded-xl px-4 py-3 hover:bg-zinc-100"
                href="/staff"
              >
                Staff
              </a>

              <a
                className="block rounded-xl px-4 py-3 hover:bg-zinc-100"
                href="/suppliers"
              >
                Fornitori
              </a>
            </div>

            <div>
              <p className="mb-2 px-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
                Amministrazione
              </p>

              <a
                className="block rounded-xl px-4 py-3 hover:bg-zinc-100"
                href="/costing"
              >
                Costing
              </a>

              <a
                className="block rounded-xl px-4 py-3 hover:bg-zinc-100"
                href="/quotes"
              >
                Preventivi
              </a>
            </div>

            <div>
              <p className="mb-2 px-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
                Aziende
              </p>

              <a
                className="block rounded-xl px-4 py-3 hover:bg-zinc-100"
                href="/companies"
              >
                Aziende
              </a>
            </div>

            <button
              onClick={logout}
              className="mt-8 block w-full rounded-xl bg-red-500/10 px-4 py-3 text-left text-red-500 hover:bg-red-500/20"
            >
              Logout
            </button>
          </nav>
        </aside>

        <section className="flex-1 p-10">
          <p className="mb-2 text-sm uppercase tracking-[0.3em] text-zinc-500">
            Economic Control Center
          </p>

          <h2 className="mb-10 text-5xl font-bold">
            Dashboard Economica
          </h2>

          <div className="grid gap-6 md:grid-cols-4">
            {[
              [
                'Ricavi Preventivi',
                loading
                  ? '...'
                  : formatCurrency(quotesRevenue),
              ],
              [
                'Costi Totali',
                loading
                  ? '...'
                  : formatCurrency(totalCosts),
              ],
              [
                'Margine Lordo',
                loading
                  ? '...'
                  : formatCurrency(grossMargin),
              ],
              [
                'Margine %',
                loading
                  ? '...'
                  : marginPercent.toFixed(1) + '%',
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm"
              >
                <p className="mb-3 text-zinc-500">
                  {label}
                </p>

                <h3 className="text-4xl font-bold">
                  {value}
                </h3>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-4">
            {[
              ['Eventi', String(eventsCount)],
              ['Aziende', String(companiesCount)],
              ['Ticket', String(ticketsCount)],
              ['Preventivi', String(quotesCount)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm"
              >
                <p className="mb-3 text-zinc-500">
                  {label}
                </p>

                <h3 className="text-4xl font-bold">
                  {loading ? '...' : value}
                </h3>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
              <h3 className="mb-6 text-2xl font-bold">
                Riepilogo economico
              </h3>

              <div className="grid gap-4">
                <div className="flex justify-between rounded-2xl bg-zinc-50 p-4">
                  <span className="text-zinc-500">
                    Ricavi da preventivi
                  </span>
                  <strong>
                    {formatCurrency(quotesRevenue)}
                  </strong>
                </div>

                <div className="flex justify-between rounded-2xl bg-zinc-50 p-4">
                  <span className="text-zinc-500">
                    Ricavi eventi/ticket
                  </span>
                  <strong>
                    {formatCurrency(eventRevenue)}
                  </strong>
                </div>

                <div className="flex justify-between rounded-2xl bg-zinc-50 p-4">
                  <span className="text-zinc-500">
                    Costi inseriti
                  </span>
                  <strong>
                    {formatCurrency(totalCosts)}
                  </strong>
                </div>

                <div className="flex justify-between rounded-2xl bg-black p-4 text-white">
                  <span>
                    Margine lordo
                  </span>
                  <strong>
                    {formatCurrency(grossMargin)}
                  </strong>
                </div>

                <div className="flex justify-between rounded-2xl bg-zinc-50 p-4">
                  <span className="text-zinc-500">
                    Margine percentuale
                  </span>
                  <strong>
                    {marginPercent.toFixed(1)}%
                  </strong>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
              <h3 className="mb-6 text-2xl font-bold">
                Stato commerciale
              </h3>

              <div className="grid gap-4">
                <div className="flex justify-between rounded-2xl bg-zinc-50 p-4">
                  <span className="text-zinc-500">
                    Preventivi totali
                  </span>
                  <strong>{quotesCount}</strong>
                </div>

                <div className="flex justify-between rounded-2xl bg-zinc-50 p-4">
                  <span className="text-zinc-500">
                    Preventivi accettati
                  </span>
                  <strong>{acceptedQuotesCount}</strong>
                </div>

                <div className="flex justify-between rounded-2xl bg-zinc-50 p-4">
                  <span className="text-zinc-500">
                    Costi registrati
                  </span>
                  <strong>{costsCount}</strong>
                </div>

                <div className="flex justify-between rounded-2xl bg-zinc-50 p-4">
                  <span className="text-zinc-500">
                    Ticket emessi
                  </span>
                  <strong>{ticketsCount}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
            <h3 className="mb-4 text-2xl font-bold">
              Azioni rapide
            </h3>

            <div className="grid gap-4 md:grid-cols-4">
              <a
                href="/events"
                className="rounded-2xl bg-black px-5 py-4 text-center font-semibold text-white"
              >
                Eventi
              </a>

              <a
                href="/costing"
                className="rounded-2xl bg-zinc-100 px-5 py-4 text-center font-semibold text-black"
              >
                Costing
              </a>

              <a
                href="/quotes"
                className="rounded-2xl bg-zinc-100 px-5 py-4 text-center font-semibold text-black"
              >
                Preventivi
              </a>

              <a
                href="/staff"
                className="rounded-2xl bg-zinc-100 px-5 py-4 text-center font-semibold text-black"
              >
                Staff
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}