'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';

const API_URL = 'https://api.uniquo.it';

type Supplier = {
  id: string;
  companyName: string;
  email?: string;
  phone?: string;
  vatNumber?: string;
  fiscalCode?: string;
  notes?: string;
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [message, setMessage] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [fiscalCode, setFiscalCode] = useState('');
  const [notes, setNotes] = useState('');


useEffect(() => {
  loadSuppliers();
}, []);

 async function loadSuppliers() {
  try {
    const res = await fetch(API_URL + '/suppliers');
    const data = await res.json();

    setSuppliers(Array.isArray(data) ? data : []);
  } catch {
    setMessage('Errore caricamento fornitori');
  }
}

  async function createSupplier() {
    if (!companyName) {
      setMessage('La ragione sociale è obbligatoria');
      return;
    }

    try {
      const res = await fetch(API_URL + '/suppliers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName,
          email,
          phone,
          vatNumber,
          fiscalCode,
          notes,
        }),
      });

      if (!res.ok) {
        setMessage('Errore creazione fornitore');
        return;
      }

      setCompanyName('');
      setEmail('');
      setPhone('');
      setVatNumber('');
      setFiscalCode('');
      setNotes('');

      setMessage('Fornitore creato con successo');
      loadSuppliers();
    } catch {
      setMessage('Errore connessione backend');
    }
  }

  async function deleteSupplier(id: string) {
    try {
      await fetch(API_URL + '/suppliers/' + id, {
        method: 'DELETE',
      });

      setMessage('Fornitore eliminato');
      loadSuppliers();
    } catch {
      setMessage('Errore eliminazione fornitore');
    }
  }

return (
  <div className="flex min-h-screen">
    <Sidebar />

    <main className="flex-1 bg-[#f5f5f7] text-[#111]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-zinc-500">
              Supplier Management
            </p>

            <h1 className="text-5xl font-bold">
              Fornitori
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
              Nuovo fornitore
            </h2>

            <div className="space-y-4">
              <input
                placeholder="Ragione sociale"
                value={companyName}
                onChange={(e) =>
                  setCompanyName(e.target.value)
                }
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <input
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <input
                placeholder="Telefono"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <input
                placeholder="Partita IVA"
                value={vatNumber}
                onChange={(e) =>
                  setVatNumber(e.target.value)
                }
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <input
                placeholder="Codice fiscale"
                value={fiscalCode}
                onChange={(e) =>
                  setFiscalCode(e.target.value)
                }
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <textarea
                placeholder="Note"
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                className="min-h-28 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <button
                onClick={createSupplier}
                className="w-full rounded-2xl bg-black px-6 py-4 font-semibold text-white"
              >
                Crea fornitore
              </button>
            </div>
          </section>

          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                Lista fornitori
              </h2>

              <button
                onClick={loadSuppliers}
                className="rounded-2xl bg-black px-5 py-3 text-white"
              >
                Refresh
              </button>
            </div>

            <div className="grid gap-5">
              {suppliers.length === 0 ? (
                <div className="rounded-[2rem] border border-zinc-200 bg-white p-10 text-center text-zinc-500 shadow-sm">
                  Nessun fornitore trovato.
                </div>
              ) : (
                suppliers.map((supplier) => (
                  <article
                    key={supplier.id}
                    className="rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-bold">
                          {supplier.companyName}
                        </h3>

                        <div className="mt-4 grid gap-2 text-zinc-600">
                          <p>
                            📧 Email:{' '}
                            {supplier.email ||
                              'Non indicata'}
                          </p>

                          <p>
                            📞 Telefono:{' '}
                            {supplier.phone ||
                              'Non indicato'}
                          </p>

                          <p>
                            🧾 P.IVA:{' '}
                            {supplier.vatNumber ||
                              'Non indicata'}
                          </p>

                          <p>
                            🧾 CF:{' '}
                            {supplier.fiscalCode ||
                              'Non indicato'}
                          </p>

                          <p>
                            📝 Note:{' '}
                            {supplier.notes ||
                              'Nessuna nota'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          deleteSupplier(supplier.id)
                        }
                        className="rounded-xl bg-red-100 px-4 py-2 text-red-600"
                      >
                        Elimina
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
</main>
</div>
);
}