'use client';

import { useEffect, useState } from 'react';

const API_URL = 'https://api.uniquo.it';

type Staff = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role?: string;
  fiscalCode?: string;
  iban?: string;
};

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [message, setMessage] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [fiscalCode, setFiscalCode] = useState('');
  const [iban, setIban] = useState('');

  useEffect(() => {
    loadStaff();
  }, []);

  async function loadStaff() {
    try {
      const res = await fetch(API_URL + '/staff');
      const data = await res.json();
      setStaff(Array.isArray(data) ? data : []);
    } catch {
      setMessage('Errore caricamento staff');
    }
  }

  async function createStaff() {
    if (!firstName || !lastName) {
      setMessage('Nome e cognome sono obbligatori');
      return;
    }

    try {
      const res = await fetch(API_URL + '/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          role,
          fiscalCode,
          iban,
        }),
      });

      if (!res.ok) {
        setMessage('Errore creazione staff');
        return;
      }

      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setRole('');
      setFiscalCode('');
      setIban('');

      setMessage('Staff creato con successo');
      loadStaff();
    } catch {
      setMessage('Errore connessione backend');
    }
  }

  async function deleteStaff(id: string) {
    try {
      await fetch(API_URL + '/staff/' + id, {
        method: 'DELETE',
      });

      setMessage('Staff eliminato');
      loadStaff();
    } catch {
      setMessage('Errore eliminazione staff');
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#111]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-zinc-500">
              Staff Management
            </p>
            <h1 className="text-5xl font-bold">
              Staff
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
              Nuovo membro staff
            </h2>

            <div className="space-y-4">
              <input
                placeholder="Nome"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <input
                placeholder="Cognome"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <input
                placeholder="Telefono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <input
                placeholder="Ruolo"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <input
                placeholder="Codice fiscale"
                value={fiscalCode}
                onChange={(e) => setFiscalCode(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <input
                placeholder="IBAN"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <button
                onClick={createStaff}
                className="w-full rounded-2xl bg-black px-6 py-4 font-semibold text-white"
              >
                Crea staff
              </button>
            </div>
          </section>

          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                Lista staff
              </h2>

              <button
                onClick={loadStaff}
                className="rounded-2xl bg-black px-5 py-3 text-white"
              >
                Refresh
              </button>
            </div>

            <div className="grid gap-5">
              {staff.length === 0 ? (
                <div className="rounded-[2rem] border border-zinc-200 bg-white p-10 text-center text-zinc-500 shadow-sm">
                  Nessun membro staff trovato.
                </div>
              ) : (
                staff.map((person) => (
                  <article
                    key={person.id}
                    className="rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-bold">
                          {person.firstName} {person.lastName}
                        </h3>

                        <div className="mt-4 grid gap-2 text-zinc-600">
                          <p>🎭 Ruolo: {person.role || 'Non indicato'}</p>
                          <p>📧 Email: {person.email || 'Non indicata'}</p>
                          <p>📞 Telefono: {person.phone || 'Non indicato'}</p>
                          <p>🧾 CF: {person.fiscalCode || 'Non indicato'}</p>
                          <p>🏦 IBAN: {person.iban || 'Non indicato'}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteStaff(person.id)}
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
  );
}