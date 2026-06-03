'use client';

import { useEffect, useState } from 'react';

const API_URL = 'https://api.uniquo.it';

export default function DashboardPage() {
  const [eventsCount, setEventsCount] = useState(0);
  const [companiesCount, setCompaniesCount] = useState(0);
  const [ticketsCount, setTicketsCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        window.location.href = '/';
        return;
      }

      const [eventsRes, companiesRes, ticketsRes] =
        await Promise.all([
          fetch(API_URL + '/events'),
          fetch(API_URL + '/companies', {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }),
          fetch(API_URL + '/tickets'),
        ]);

      const events = await eventsRes.json();
      const companies = await companiesRes.json();
      const tickets = await ticketsRes.json();

      setEventsCount(Array.isArray(events) ? events.length : 0);
      setCompaniesCount(Array.isArray(companies) ? companies.length : 0);
      setTicketsCount(Array.isArray(tickets) ? tickets.length : 0);

      const totalRevenue = Array.isArray(events)
        ? events.reduce(
            (acc: number, event: any) =>
              acc + Number(event.price || 0),
            0,
          )
        : 0;

      setRevenue(totalRevenue);
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

  const menuItems = [
    ['Dashboard', '/dashboard'],
    ['Eventi', '/events'],
    ['Aziende', '/companies'],
    ['Ticket', '/tickets'],
    ['Check-in QR', '/checkin'],
    ['Staff', '/staff'],
    ['Fornitori', '/suppliers'],
    ['Costing', '/costing'],
    ['Preventivi', '/quotes'],
  ];

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#111]">
      <div className="flex min-h-screen">
        <aside className="w-72 border-r border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="mb-10 text-2xl font-bold">Uniquo</h1>

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
            SaaS Control Center
          </p>

          <h2 className="mb-10 text-5xl font-bold">Dashboard</h2>

          <div className="grid gap-6 md:grid-cols-4">
            {[
              ['Eventi', loading ? '...' : String(eventsCount)],
              ['Aziende', loading ? '...' : String(companiesCount)],
              ['Ticket', loading ? '...' : String(ticketsCount)],
              ['Revenue', loading ? '...' : '€' + revenue],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm"
              >
                <p className="mb-3 text-zinc-500">{label}</p>
                <h3 className="text-4xl font-bold">{value}</h3>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
              <h3 className="mb-4 text-2xl font-bold">Azioni rapide</h3>

              <div className="grid gap-4">
                <a
                  href="/events"
                  className="rounded-2xl bg-black px-5 py-4 font-semibold text-white"
                >
                  Gestisci eventi
                </a>

                <a
                  href="/costing"
                  className="rounded-2xl bg-zinc-100 px-5 py-4 font-semibold text-black"
                >
                  Costing evento
                </a>

                <a
                  href="/staff"
                  className="rounded-2xl bg-zinc-100 px-5 py-4 font-semibold text-black"
                >
                  Gestisci staff
                </a>

                <a
                  href="/suppliers"
                  className="rounded-2xl bg-zinc-100 px-5 py-4 font-semibold text-black"
                >
                  Gestisci fornitori
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
              <h3 className="mb-6 text-2xl font-bold">Analytics</h3>

              <p className="mb-3 text-zinc-500">
                Ticket venduti: {ticketsCount}
              </p>
              <p className="mb-3 text-zinc-500">
                Revenue: €{revenue}
              </p>
              <p className="text-zinc-500">
                Eventi attivi: {eventsCount}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}