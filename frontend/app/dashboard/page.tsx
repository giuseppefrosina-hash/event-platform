'use client';

import { useEffect, useState } from 'react';

const API_URL = 'https://api.uniquo.it';

export default function DashboardPage() {
  const [eventsCount, setEventsCount] = useState(0);
  const [companiesCount, setCompaniesCount] = useState(0);
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

      const [eventsRes, companiesRes] = await Promise.all([
        fetch(`${API_URL}/events`),
        fetch(`${API_URL}/companies`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const events = await eventsRes.json();
      const companies = await companiesRes.json();

      setEventsCount(Array.isArray(events) ? events.length : 0);
      setCompaniesCount(Array.isArray(companies) ? companies.length : 0);
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
    <main className="min-h-screen bg-[#0b0b0f] text-white">
      <div className="flex min-h-screen">
        <aside className="w-72 border-r border-white/10 bg-black/30 p-6">
          <h1 className="mb-10 text-2xl font-bold">
            Uniquo
          </h1>

          <nav className="space-y-3 text-zinc-400">
            <a className="block rounded-xl bg-white/10 px-4 py-3 text-white" href="/dashboard">
              Dashboard
            </a>
            <a className="block rounded-xl px-4 py-3 hover:bg-white/10" href="/events">
              Eventi
            </a>
            <a className="block rounded-xl px-4 py-3 hover:bg-white/10" href="/companies">
              Aziende
            </a>
            <a className="block rounded-xl px-4 py-3 hover:bg-white/10" href="/staff">
              Staff
            </a>
            <a className="block rounded-xl px-4 py-3 hover:bg-white/10" href="/suppliers">
  Fornitori
</a>

<a className="block rounded-xl px-4 py-3 hover:bg-white/10" href="/tickets">
  Ticket
</a>

<a className="block rounded-xl px-4 py-3 hover:bg-white/10" href="/checkin">
  Check-in QR
</a>
            <button
              onClick={logout}
              className="mt-8 block w-full rounded-xl bg-red-500/20 px-4 py-3 text-left text-red-300 hover:bg-red-500/30"
            >
              Logout
            </button>
          </nav>
        </aside>

        <section className="flex-1 p-10">
          <div className="mb-10">
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-zinc-500">
              SaaS Control Center
            </p>
            <h2 className="text-5xl font-bold">
              Dashboard
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {[
              ['Eventi', loading ? '...' : String(eventsCount)],
              ['Aziende', loading ? '...' : String(companiesCount)],
              ['Staff', '0'],
              ['Ricavi', '€0'],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6"
              >
                <p className="mb-3 text-zinc-400">{label}</p>
                <h3 className="text-4xl font-bold">{value}</h3>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8">
              <h3 className="mb-4 text-2xl font-bold">
                Azioni rapide
              </h3>

              <div className="grid gap-4">
                <a href="/companies" className="rounded-2xl bg-white px-5 py-4 font-semibold text-black">
                  Gestisci aziende
                </a>
                <a href="/events" className="rounded-2xl bg-white/10 px-5 py-4 font-semibold text-white">
                  Gestisci eventi
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8">
              <h3 className="mb-4 text-2xl font-bold">
                Stato sistema
              </h3>

              <div className="space-y-4 text-zinc-300">
                <p>✅ Frontend online</p>
                <p>✅ Backend API collegato</p>
                <p>✅ Database collegato</p>
                <p>✅ Dominio personalizzato attivo</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}