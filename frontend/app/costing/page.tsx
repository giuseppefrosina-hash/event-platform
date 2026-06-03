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
  category: string;
  description: string;
  supplier?: string;
  quantity: number;
  unitCost: number;
  vat: number;
  totalCost: number;
  event?: EventItem;
};

export default function CostingPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [costs, setCosts] = useState<EventCost[]>([]);
  const [message, setMessage] = useState('');

  const [eventId, setEventId] = useState('');
  const [category, setCategory] = useState('Staff');
  const [description, setDescription] = useState('');
  const [supplier, setSupplier] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unitCost, setUnitCost] = useState('');
  const [vat, setVat] = useState('22');

  useEffect(() => {
    loadEvents();
    loadCosts();
  }, []);

  const selectedEvent = events.find(
    (event) => event.id === eventId,
  );

  const previewTotal = useMemo(() => {
    const q = Number(quantity || 1);
    const u = Number(unitCost || 0);
    const v = Number(vat || 0);

    const subtotal = q * u;
    const total = subtotal + subtotal * (v / 100);

    return Number(total.toFixed(2));
  }, [quantity, unitCost, vat]);

  const totalCosts = useMemo(() => {
    return costs.reduce(
      (sum, cost) => sum + Number(cost.totalCost || 0),
      0,
    );
  }, [costs]);

  const expectedRevenue = Number(selectedEvent?.price || 0);

  const margin = expectedRevenue - totalCosts;

  async function loadEvents() {
    try {
      const res = await fetch(API_URL + '/events');
      const data = await res.json();

      setEvents(Array.isArray(data) ? data : []);
    } catch {
      setMessage('Errore caricamento eventi');
    }
  }

  async function loadCosts() {
    try {
      const res = await fetch(API_URL + '/event-costs');
      const data = await res.json();

      setCosts(Array.isArray(data) ? data : []);
    } catch {
      setMessage('Errore caricamento costi');
    }
  }

  async function createCost() {
    if (!eventId || !description || !unitCost) {
      setMessage('Evento, descrizione e costo unitario sono obbligatori');
      return;
    }

    try {
      const res = await fetch(API_URL + '/event-costs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          category,
          description,
          supplier,
          quantity: Number(quantity || 1),
          unitCost: Number(unitCost || 0),
          vat: Number(vat || 0),
        }),
      });

      if (!res.ok) {
        setMessage('Errore creazione costo');
        return;
      }

      setDescription('');
      setSupplier('');
      setQuantity('1');
      setUnitCost('');
      setVat('22');

      setMessage('Costo aggiunto con successo');
      loadCosts();
    } catch {
      setMessage('Errore connessione backend');
    }
  }

  async function deleteCost(id: string) {
    try {
      await fetch(API_URL + '/event-costs/' + id, {
        method: 'DELETE',
      });

      setMessage('Costo eliminato');
      loadCosts();
    } catch {
      setMessage('Errore eliminazione costo');
    }
  }

  const filteredCosts = eventId
    ? costs.filter((cost) => cost.event?.id === eventId)
    : costs;

  const filteredTotal = filteredCosts.reduce(
    (sum, cost) => sum + Number(cost.totalCost || 0),
    0,
  );

  const filteredRevenue = Number(selectedEvent?.price || 0);
  const filteredMargin = filteredRevenue - filteredTotal;

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#111]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-zinc-500">
              Event Costing
            </p>

            <h1 className="text-5xl font-bold">
              Costing evento
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

        <div className="mb-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-zinc-500">Ricavo previsto</p>
            <h3 className="mt-2 text-3xl font-bold">
              € {filteredRevenue.toFixed(2)}
            </h3>
          </div>

          <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-zinc-500">Costi previsti</p>
            <h3 className="mt-2 text-3xl font-bold">
              € {filteredTotal.toFixed(2)}
            </h3>
          </div>

          <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-zinc-500">Margine</p>
            <h3
              className={`mt-2 text-3xl font-bold ${
                filteredMargin >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              € {filteredMargin.toFixed(2)}
            </h3>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              Nuovo costo
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

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              >
                <option value="Staff">Staff</option>
                <option value="Fornitori">Fornitori</option>
                <option value="Location">Location</option>
                <option value="Catering">Catering</option>
                <option value="Audio/Luci">Audio/Luci</option>
                <option value="Viaggi">Viaggi</option>
                <option value="Hotel">Hotel</option>
                <option value="Materiali">Materiali</option>
                <option value="Marketing">Marketing</option>
                <option value="Altro">Altro</option>
              </select>

              <input
                placeholder="Descrizione costo"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <input
                placeholder="Fornitore / riferimento"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <input
                type="number"
                placeholder="Quantità"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <input
                type="number"
                placeholder="Costo unitario"
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <input
                type="number"
                placeholder="IVA %"
                value={vat}
                onChange={(e) => setVat(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <div className="rounded-3xl bg-black p-6 text-white">
                <p className="text-sm text-zinc-400">
                  Totale costo previsto
                </p>

                <h3 className="mt-2 text-3xl font-bold">
                  € {previewTotal.toFixed(2)}
                </h3>
              </div>

              <button
                onClick={createCost}
                className="w-full rounded-2xl bg-black px-6 py-4 font-semibold text-white"
              >
                Aggiungi costo
              </button>
            </div>
          </section>

          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                Lista costi
              </h2>

              <button
                onClick={loadCosts}
                className="rounded-2xl bg-black px-5 py-3 text-white"
              >
                Refresh
              </button>
            </div>

            <div className="grid gap-5">
              {filteredCosts.length === 0 ? (
                <div className="rounded-[2rem] border border-zinc-200 bg-white p-10 text-center text-zinc-500 shadow-sm">
                  Nessun costo inserito.
                </div>
              ) : (
              filteredCosts.map((cost) => (
  <details
    key={cost.id}
    className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm"
  >
    <summary className="flex cursor-pointer items-center justify-between gap-4">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">
          {cost.category}
        </p>

        <h3 className="mt-1 text-xl font-bold">
          {cost.description}
        </h3>
      </div>

      <div className="text-right">
        <p className="text-sm text-zinc-500">
          Totale
        </p>

        <p className="text-xl font-bold">
          € {Number(cost.totalCost || 0).toFixed(2)}
        </p>
      </div>
    </summary>

    <div className="mt-6 border-t border-zinc-100 pt-5">
      <div className="grid gap-2 text-zinc-600">
        <p>
          Evento:{' '}
          {cost.event?.title ||
            'Evento non disponibile'}
        </p>

        <p>
          Fornitore:{' '}
          {cost.supplier || 'Non indicato'}
        </p>

        <p>Quantità: {cost.quantity}</p>

        <p>
          Costo unitario: €{' '}
          {Number(cost.unitCost || 0).toFixed(2)}
        </p>

        <p>IVA: {cost.vat}%</p>

        <p className="font-bold text-black">
          Totale costo: €{' '}
          {Number(cost.totalCost || 0).toFixed(2)}
        </p>
      </div>

      <button
        onClick={() => deleteCost(cost.id)}
        className="mt-5 rounded-xl bg-red-100 px-4 py-2 text-red-600"
      >
        Elimina
      </button>
    </div>
  </details>
))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}