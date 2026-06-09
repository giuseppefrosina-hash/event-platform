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
type PracticeCost = {
  id: string;
  serviceName: string;
  supplierName?: string | null;
  quantity: number;
  unitCost: number;
  totalCost: number;
  vat: number;
  notes?: string | null;
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

export default function PracticeDetailPage() {
  const [practice, setPractice] =
    useState<Practice | null>(null);
const [costs, setCosts] = useState<PracticeCost[]>([]);

const [serviceName, setServiceName] = useState('');
const [supplierName, setSupplierName] = useState('');
const [quantity, setQuantity] = useState('1');
const [unitCost, setUnitCost] = useState('');
const [vat, setVat] = useState('22');
const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPractice();
  }, []);
async function loadCosts() {
  try {
    const practiceId =
      window.location.pathname.split('/').pop();

    const res = await fetch(
      API_URL +
        '/practice-costs/practice/' +
        practiceId,
    );

    const data = await res.json();

    setCosts(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error(error);
  }
}

async function createCost() {
  const practiceId =
    window.location.pathname.split('/').pop();

  const res = await fetch(
    API_URL + '/practice-costs',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        practiceId,
        serviceName,
        supplierName,
        quantity: Number(quantity),
        unitCost: Number(unitCost),
        vat: Number(vat),
        notes,
      }),
    },
  );

  if (!res.ok) return;

  setServiceName('');
  setSupplierName('');
  setQuantity('1');
  setUnitCost('');
  setVat('22');
  setNotes('');

  loadCosts();
}

async function deleteCost(id: string) {
  await fetch(
    API_URL + '/practice-costs/' + id,
    {
      method: 'DELETE',
    },
  );

  loadCosts();
}
  async function loadPractice() {
    try {
      const practiceId =
        window.location.pathname.split('/').pop();

      const res = await fetch(API_URL + '/practices');
      const data = await res.json();

      const found = Array.isArray(data)
        ? data.find(
            (item: Practice) =>
              item.id === practiceId,
          )
        : null;

      setPractice(found || null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f5f7] p-10 text-[#111]">
        Caricamento...
      </main>
    );
  }

  if (!practice) {
    return (
      <main className="min-h-screen bg-[#f5f5f7] p-10 text-[#111]">
        Pratica non trovata
      </main>
    );
  }

  const detailRows = [
    ['Titolo', practice.title],
    ['Cliente', practice.clientName],
    ['Business', practice.businessType],
    ['Data inizio', formatDate(practice.startDate)],
    ['Data fine', formatDate(practice.endDate)],
    ['Partecipanti', String(practice.participants || 0)],
    ['Stato', statusLabel(practice.status)],
    ['Note', practice.notes || 'Nessuna nota'],
  ];

  return (
    <main className="min-h-screen bg-[#f5f5f7] p-10 text-[#111]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-zinc-500">
              Practice Detail
            </p>

            <h1 className="text-5xl font-bold text-black">
              {practice.practiceNumber}
            </h1>
          </div>

          <a
            href="/practices"
            className="rounded-2xl bg-black px-5 py-3 font-semibold text-white"
          >
            ← Torna alle pratiche
          </a>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 text-[#111] shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-black">
              Dati pratica
            </h2>

            <div className="divide-y divide-zinc-100">
              {detailRows.map(([label, value]) => (
                <div
                  key={label}
                  className="grid gap-3 py-5 md:grid-cols-[180px_1fr]"
                >
                  <div className="font-semibold text-zinc-500">
                    {label}
                  </div>

                  <div className="font-medium text-black">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 text-[#111] shadow-sm">
              <h3 className="mb-6 text-xl font-bold text-black">
                Riepilogo economico
              </h3>

              <div className="divide-y divide-zinc-100">
                {[
                  ['Venduto', '€ 0,00'],
                  ['Costi', '€ 0,00'],
                  ['Margine', '€ 0,00'],
                  ['Incassato', '€ 0,00'],
                  ['Da incassare', '€ 0,00'],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between py-4"
                  >
                    <span className="text-zinc-600">
                      {label}
                    </span>

                    <strong className="text-black">
                      {value}
                    </strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 text-[#111] shadow-sm">
              <h3 className="mb-6 text-xl font-bold text-black">
                Collegamenti
              </h3>

              <div className="space-y-3">
                <a
                  href="/quotes"
                  className="block rounded-xl bg-black px-4 py-3 text-center font-semibold text-white"
                >
                  Preventivi
                </a>

                <a
                  href="/costing"
                  className="block rounded-xl bg-zinc-100 px-4 py-3 text-center font-semibold text-black"
                >
                  Costing
                </a>

                <a
                  href="/staff"
                  className="block rounded-xl bg-zinc-100 px-4 py-3 text-center font-semibold text-black"
                >
                  Team & Partner
                </a>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}