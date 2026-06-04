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

type Supplier = {
  id: string;
  companyName: string;
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

  const [editingId, setEditingId] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editSupplier, setEditSupplier] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [editUnitCost, setEditUnitCost] = useState('');
  const [editVat, setEditVat] = useState('');
const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [markup, setMarkup] = useState('30');
  const [generatingQuote, setGeneratingQuote] = useState(false);

  useEffect(() => {
    loadEvents();
    loadCosts();
  }, []);

  const selectedEvent = events.find((event) => event.id === eventId);

  const previewTotal = useMemo(() => {
    const q = Number(quantity || 1);
    const u = Number(unitCost || 0);
    const v = Number(vat || 0);

    const subtotal = q * u;
    const total = subtotal + subtotal * (v / 100);

    return Number(total.toFixed(2));
  }, [quantity, unitCost, vat]);

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

  function startEdit(cost: EventCost) {
    setEditingId(cost.id);
    setEditCategory(cost.category);
    setEditDescription(cost.description);
    setEditSupplier(cost.supplier || '');
    setEditQuantity(String(cost.quantity));
    setEditUnitCost(String(cost.unitCost));
    setEditVat(String(cost.vat));
  }

  async function saveEdit() {
    try {
      const res = await fetch(API_URL + '/event-costs/' + editingId, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: editCategory,
          description: editDescription,
          supplier: editSupplier,
          quantity: Number(editQuantity || 1),
          unitCost: Number(editUnitCost || 0),
          vat: Number(editVat || 0),
        }),
      });

      if (!res.ok) {
        setMessage('Errore aggiornamento costo');
        return;
      }

      setEditingId('');
      setMessage('Costo aggiornato');
      loadCosts();
    } catch {
      setMessage('Errore aggiornamento costo');
    }
  }

  async function generateQuote() {
    if (!eventId) {
      setMessage('Seleziona un evento prima di generare il preventivo');
      return;
    }

    try {
      setGeneratingQuote(true);

      const res = await fetch(API_URL + '/quotes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          markup: Number(markup || 0),
        }),
      });

      if (!res.ok) {
        setMessage('Errore generazione preventivo');
        return;
      }

      const quote = await res.json();

      setMessage(`Preventivo ${quote.quoteNumber} creato con successo`);
    } catch {
      setMessage('Errore connessione backend');
    } finally {
      setGeneratingQuote(false);
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

  const estimatedQuote = filteredTotal * (1 + Number(markup || 0) / 100);

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
            <p className="text-zinc-500">
              Ricavo previsto
            </p>

            <h3 className="mt-2 text-3xl font-bold">
              € {filteredRevenue.toFixed(2)}
            </h3>
          </div>

          <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-zinc-500">
              Costi previsti
            </p>

            <h3 className="mt-2 text-3xl font-bold">
              € {filteredTotal.toFixed(2)}
            </h3>
          </div>

          <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-zinc-500">
              Margine
            </p>

            <h3
              className={`mt-2 text-3xl font-bold ${
                filteredMargin >= 0
                  ? 'text-emerald-600'
                  : 'text-red-600'
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

              <select
  value={supplier}
  onChange={(e) => setSupplier(e.target.value)}
  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
>
  <option value="">Seleziona fornitore</option>

  {suppliers.map((item) => (
    <option key={item.id} value={item.companyName}>
      {item.companyName}
    </option>
  ))}
</select>

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

              <div className="rounded-3xl border border-zinc-200 bg-white p-5">
                <h3 className="mb-4 text-lg font-bold">
                  Genera Preventivo
                </h3>

                <input
                  type="number"
                  placeholder="Markup %"
                  value={markup}
                  onChange={(e) => setMarkup(e.target.value)}
                  className="mb-4 w-full rounded-xl border border-zinc-200 px-4 py-3"
                />

                <div className="mb-4 rounded-2xl bg-zinc-50 p-4 text-sm">
                  <div className="mb-2 flex justify-between">
                    <span>Costi evento</span>
                    <span>
                      € {filteredTotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="mb-2 flex justify-between">
                    <span>Markup</span>
                    <span>{markup}%</span>
                  </div>

                  <div className="flex justify-between font-bold">
                    <span>Preventivo stimato</span>
                    <span>
                      € {estimatedQuote.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={generateQuote}
                  disabled={generatingQuote}
                  className="w-full rounded-2xl bg-emerald-600 px-5 py-4 font-semibold text-white disabled:opacity-60"
                >
                  {generatingQuote
                    ? 'Generazione...'
                    : 'Genera Preventivo'}
                </button>
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
                          {cost.supplier ||
                            'Non indicato'}
                        </p>

                        <p>
                          Quantità: {cost.quantity}
                        </p>

                        <p>
                          Costo unitario: €{' '}
                          {Number(cost.unitCost || 0).toFixed(2)}
                        </p>

                        <p>
                          IVA: {cost.vat}%
                        </p>

                        <p className="font-bold text-black">
                          Totale costo: €{' '}
                          {Number(cost.totalCost || 0).toFixed(2)}
                        </p>
                      </div>

                      <div className="mt-5 flex gap-3">
                        <button
                          onClick={() => startEdit(cost)}
                          className="rounded-xl bg-blue-100 px-4 py-2 text-blue-600"
                        >
                          Modifica
                        </button>

                        <button
                          onClick={() => deleteCost(cost.id)}
                          className="rounded-xl bg-red-100 px-4 py-2 text-red-600"
                        >
                          Elimina
                        </button>
                      </div>

                      {editingId === cost.id && (
                        <div className="mt-6 rounded-2xl bg-zinc-50 p-5">
                          <div className="grid gap-3">
                            <select
                              value={editCategory}
                              onChange={(e) =>
                                setEditCategory(e.target.value)
                              }
                              className="rounded-xl border border-zinc-200 px-4 py-3"
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
                              value={editDescription}
                              onChange={(e) =>
                                setEditDescription(e.target.value)
                              }
                              placeholder="Descrizione"
                              className="rounded-xl border border-zinc-200 px-4 py-3"
                            />

                            <input
                              value={editSupplier}
                              onChange={(e) =>
                                setEditSupplier(e.target.value)
                              }
                              placeholder="Fornitore"
                              className="rounded-xl border border-zinc-200 px-4 py-3"
                            />

                            <input
                              type="number"
                              value={editQuantity}
                              onChange={(e) =>
                                setEditQuantity(e.target.value)
                              }
                              placeholder="Quantità"
                              className="rounded-xl border border-zinc-200 px-4 py-3"
                            />

                            <input
                              type="number"
                              value={editUnitCost}
                              onChange={(e) =>
                                setEditUnitCost(e.target.value)
                              }
                              placeholder="Costo unitario"
                              className="rounded-xl border border-zinc-200 px-4 py-3"
                            />

                            <input
                              type="number"
                              value={editVat}
                              onChange={(e) =>
                                setEditVat(e.target.value)
                              }
                              placeholder="IVA"
                              className="rounded-xl border border-zinc-200 px-4 py-3"
                            />

                            <div className="flex gap-3">
                              <button
                                onClick={saveEdit}
                                className="rounded-xl bg-black px-5 py-3 text-white"
                              >
                                Salva modifiche
                              </button>

                              <button
                                onClick={() => setEditingId('')}
                                className="rounded-xl bg-zinc-200 px-5 py-3"
                              >
                                Annulla
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
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