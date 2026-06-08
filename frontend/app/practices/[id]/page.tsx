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
};

function formatDate(value?: string | null) {
  if (!value) return 'Non indicata';
  return new Date(value).toLocaleDateString('it-IT');
}

export default function PracticeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [practice, setPractice] =
    useState<Practice | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadPractice();
  }, []);

  async function loadPractice() {
    try {
      const res = await fetch(
        API_URL + '/practices',
      );

      const data = await res.json();

      const found = data.find(
        (item: Practice) =>
          item.id === params.id,
      );

      setPractice(found || null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="p-10">
        Caricamento...
      </main>
    );
  }

  if (!practice) {
    return (
      <main className="p-10">
        Pratica non trovata
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] p-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
              Practice Detail
            </p>

            <h1 className="mt-2 text-5xl font-bold">
              {practice.practiceNumber}
            </h1>
          </div>

          <a
            href="/practices"
            className="rounded-2xl bg-black px-5 py-3 text-white"
          >
            Torna alle pratiche
          </a>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">

          <div className="rounded-[2rem] bg-white p-8 shadow-sm lg:col-span-2">

            <h2 className="mb-6 text-2xl font-bold">
              Dati pratica
            </h2>

            <div className="space-y-4">

              <div>
                <strong>Titolo</strong>
                <p>{practice.title}</p>
              </div>

              <div>
                <strong>Cliente</strong>
                <p>{practice.clientName}</p>
              </div>

              <div>
                <strong>Business</strong>
                <p>{practice.businessType}</p>
              </div>

              <div>
                <strong>Data inizio</strong>
                <p>
                  {formatDate(
                    practice.startDate,
                  )}
                </p>
              </div>

              <div>
                <strong>Data fine</strong>
                <p>
                  {formatDate(
                    practice.endDate,
                  )}
                </p>
              </div>

              <div>
                <strong>Partecipanti</strong>
                <p>
                  {practice.participants}
                </p>
              </div>

              <div>
                <strong>Stato</strong>
                <p>{practice.status}</p>
              </div>

              <div>
                <strong>Note</strong>
                <p>
                  {practice.notes ||
                    'Nessuna nota'}
                </p>
              </div>

            </div>
          </div>

          <div className="space-y-6">

            <div className="rounded-[2rem] bg-white p-8 shadow-sm">
              <h3 className="mb-4 text-xl font-bold">
                Economico
              </h3>

              <div className="space-y-3">

                <div className="flex justify-between">
                  <span>Venduto</span>
                  <strong>€ 0</strong>
                </div>

                <div className="flex justify-between">
                  <span>Costi</span>
                  <strong>€ 0</strong>
                </div>

                <div className="flex justify-between">
                  <span>Margine</span>
                  <strong>€ 0</strong>
                </div>

                <div className="flex justify-between">
                  <span>Incassato</span>
                  <strong>€ 0</strong>
                </div>

                <div className="flex justify-between">
                  <span>Da incassare</span>
                  <strong>€ 0</strong>
                </div>

              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-8 shadow-sm">
              <h3 className="mb-4 text-xl font-bold">
                Collegamenti
              </h3>

              <div className="space-y-3">

                <a
                  href="/quotes"
                  className="block rounded-xl bg-black px-4 py-3 text-center text-white"
                >
                  Preventivi
                </a>

                <a
                  href="/costing"
                  className="block rounded-xl bg-zinc-100 px-4 py-3 text-center"
                >
                  Costing
                </a>

                <a
                  href="/staff"
                  className="block rounded-xl bg-zinc-100 px-4 py-3 text-center"
                >
                  Staff
                </a>

              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}