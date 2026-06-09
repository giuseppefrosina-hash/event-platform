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
  category: string;
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

export default function PracticeDetailPage() {
  const [practice, setPractice] =
    useState<Practice | null>(null);
const [costs, setCosts] = useState<PracticeCost[]>([]);

const [serviceName, setServiceName] = useState('');
const [supplierName, setSupplierName] = useState('');
const [quantity, setQuantity] = useState('1');
const [unitCost, setUnitCost] = useState('');
const [vat, setVat] = useState('22');
const [category, setCategory] = useState('Altro');
const [sellingPrice, setSellingPrice] = useState('');
const [costStatus, setCostStatus] = useState('draft');
const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

useEffect(() => {
  loadPractice();
  loadCosts();
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
        category,
sellingPrice: sellingPrice
  ? Number(sellingPrice)
  : null,
status: costStatus,
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
  setCategory('Altro');
  setSellingPrice('');
  setCostStatus('draft');

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
  <div className="space-y-6">
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
          <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 text-[#111] shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-black">
                  Costing pratica
                </h2>
                <p className="mt-1 text-zinc-500">
                  Servizi, fornitori e costi collegati alla pratica
                </p>
              </div>

              <div className="rounded-2xl bg-black px-5 py-3 text-white">
                Totale costi:{' '}
                {new Intl.NumberFormat('it-IT', {
                  style: 'currency',
                  currency: 'EUR',
                }).format(
                  costs.reduce(
                    (sum, cost) =>
                      sum + Number(cost.totalCost || 0),
                    0,
                  ),
                )}
              </div>
            </div>

            <div className="mb-8 grid gap-4 rounded-3xl bg-zinc-50 p-5 md:grid-cols-2">
             <select
  value={category}
  onChange={(e) =>
    setCategory(e.target.value)
  }
  className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 outline-none"
>
  <option value="Hotel">Hotel</option>
  <option value="Trasporti">Trasporti</option>
  <option value="Staff">Staff</option>
  <option value="Pratiche">Pratiche</option>
  <option value="Location">Location</option>
  <option value="Catering">Catering</option>
  <option value="Audio Video">Audio Video</option>
  <option value="Intrattenimento">Intrattenimento</option>
  <option value="Materiali">Materiali</option>
  <option value="Altro">Altro</option>
</select>
              <input
                placeholder="Servizio"
                value={serviceName}
                onChange={(e) =>
                  setServiceName(e.target.value)
                }
                className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 outline-none"
              />

              <input
                placeholder="Fornitore"
                value={supplierName}
                onChange={(e) =>
                  setSupplierName(e.target.value)
                }
                className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 outline-none"
              />

              <input
                type="number"
                placeholder="Quantità"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
                className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 outline-none"
              />

              <input
                type="number"
                placeholder="Costo unitario"
                value={unitCost}
                onChange={(e) =>
                  setUnitCost(e.target.value)
                }
                className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 outline-none"
              />
<input
  type="number"
  placeholder="Prezzo vendita"
  value={sellingPrice}
  onChange={(e) =>
    setSellingPrice(e.target.value)
  }
  className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 outline-none"
/>
              <input
                type="number"
                placeholder="IVA %"
                value={vat}
                onChange={(e) =>
                  setVat(e.target.value)
                }
                className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 outline-none"
              />
<select
  value={costStatus}
  onChange={(e) =>
    setCostStatus(e.target.value)
  }
  className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 outline-none"
>
  <option value="draft">Bozza</option>
  <option value="requested">
    Richiesto
  </option>
  <option value="confirmed">
    Confermato
  </option>
  <option value="cancelled">
    Annullato
  </option>
</select>
              <input
                placeholder="Note"
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 outline-none"
              />

              <button
                onClick={createCost}
                className="rounded-2xl bg-black px-6 py-4 font-semibold text-white md:col-span-2"
              >
                Aggiungi costo
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead>
               <tr className="border-b border-zinc-200 text-zinc-500">
  <th className="py-3 pr-4">Categoria</th>
  <th className="py-3 pr-4">Servizio</th>
  <th className="py-3 pr-4">Fornitore</th>
  <th className="py-3 pr-4">Costo</th>
  <th className="py-3 pr-4">Vendita</th>
  <th className="py-3 pr-4">Margine €</th>
  <th className="py-3 pr-4">Margine %</th>
  <th className="py-3 pr-4">Stato</th>
  <th className="py-3 pr-4"></th>
</tr>
                </thead>

                <tbody>
                  {costs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="py-8 text-center text-zinc-500"
                      >
                        Nessun costo inserito.
                      </td>
                    </tr>
                  ) : (
                    costs.map((cost) => (
                      <tr
                        key={cost.id}
                        className="border-b border-zinc-100"
                      >
                        <td className="py-4 pr-4">
                          {cost.category || 'Altro'}
                        </td>

                        <td className="py-4 pr-4 font-semibold text-black">
                          {cost.serviceName}
                        </td>

                        <td className="py-4 pr-4 text-zinc-600">
                          {cost.supplierName || '-'}
                        </td>

                        <td className="py-4 pr-4 font-semibold">
                          {new Intl.NumberFormat('it-IT', {
                            style: 'currency',
                            currency: 'EUR',
                          }).format(Number(cost.totalCost || 0))}
                        </td>

                        <td className="py-4 pr-4">
                          {new Intl.NumberFormat('it-IT', {
                            style: 'currency',
                            currency: 'EUR',
                          }).format(Number(cost.sellingPrice || 0))}
                        </td>

                        <td className="py-4 pr-4 font-semibold text-emerald-600">
                          {new Intl.NumberFormat('it-IT', {
                            style: 'currency',
                            currency: 'EUR',
                          }).format(Number(cost.marginAmount || 0))}
                        </td>

                        <td className="py-4 pr-4">
                          {Number(cost.marginPercent || 0).toFixed(1)}%
                        </td>

                        <td className="py-4 pr-4">
                          {cost.status || 'draft'}
                        </td>

                        <td className="py-4 pr-4">
                          <button
                            onClick={() => deleteCost(cost.id)}
                            className="rounded-xl bg-red-100 px-4 py-2 text-red-600"
                          >
                            Elimina
                          </button>
                        </td>
                      </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
  </div>
          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 text-[#111] shadow-sm">
              <h3 className="mb-6 text-xl font-bold text-black">
                Riepilogo economico
              </h3>

              <div className="divide-y divide-zinc-100">
               {[
  [
    'Venduto',
    new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(0),
  ],
  [
    'Costi',
    new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(
      costs.reduce(
        (sum, cost) =>
          sum + Number(cost.totalCost || 0),
        0,
      ),
    ),
  ],
  [
    'Margine',
    new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(
      0 -
        costs.reduce(
          (sum, cost) =>
            sum + Number(cost.totalCost || 0),
          0,
        ),
    ),
  ],
  [
    'Incassato',
    new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(0),
  ],
  [
    'Da incassare',
    new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(0),
  ],
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