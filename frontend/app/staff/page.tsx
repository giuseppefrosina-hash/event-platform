'use client';

import { useEffect, useMemo, useState } from 'react';

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
  vatNumber?: string;
  taxRegime?: string;
  withholdingTax?: boolean;
  agreedAmount?: number;
  withholdingRate?: number;
  taxRate?: number;
  grossAmount?: number;
  taxAmount?: number;
  netAmount?: number;
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
  const [vatNumber, setVatNumber] = useState('');
  const [iban, setIban] = useState('');

  const [taxRegime, setTaxRegime] = useState('ritenuta_acconto');
  const [withholdingTax, setWithholdingTax] = useState(true);
  const [agreedAmount, setAgreedAmount] = useState('');
  const [withholdingRate, setWithholdingRate] = useState('20');
  const [taxRate, setTaxRate] = useState('0');

  const [acceptedConditions, setAcceptedConditions] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedDressCode, setAcceptedDressCode] = useState(false);
  const [acceptedConfidentiality, setAcceptedConfidentiality] = useState(false);

  useEffect(() => {
    loadStaff();
  }, []);

  const calculation = useMemo(() => {
    const net = Number(agreedAmount || 0);
    const withholding = Number(withholdingRate || 0);
    const extraTax = Number(taxRate || 0);

    let gross = net;
    let withholdingAmount = 0;
    let extraTaxAmount = 0;

    if (withholdingTax && withholding > 0) {
      gross = net / (1 - withholding / 100);
      withholdingAmount = gross - net;
    }

    if (extraTax > 0) {
      extraTaxAmount = gross * (extraTax / 100);
    }

    const companyCost = gross + extraTaxAmount;

    return {
      netAmount: Number(net.toFixed(2)),
      grossAmount: Number(companyCost.toFixed(2)),
      taxAmount: Number((withholdingAmount + extraTaxAmount).toFixed(2)),
    };
  }, [agreedAmount, withholdingRate, taxRate, withholdingTax]);

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

    if (
      !acceptedConditions ||
      !acceptedPrivacy ||
      !acceptedDressCode ||
      !acceptedConfidentiality
    ) {
      setMessage('Devi accettare tutte le condizioni operative');
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
          vatNumber,
          iban,
          taxRegime,
          withholdingTax,
          agreedAmount: Number(agreedAmount || 0),
          withholdingRate: Number(withholdingRate || 0),
          taxRate: Number(taxRate || 0),
          grossAmount: calculation.grossAmount,
          taxAmount: calculation.taxAmount,
          netAmount: calculation.netAmount,
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
      setVatNumber('');
      setIban('');
      setAgreedAmount('');
      setWithholdingRate('20');
      setTaxRate('0');
      setAcceptedConditions(false);
      setAcceptedPrivacy(false);
      setAcceptedDressCode(false);
      setAcceptedConfidentiality(false);

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
            <h1 className="text-5xl font-bold">Staff</h1>
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

        <div className="grid gap-8 lg:grid-cols-[460px_1fr]">
          <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">Nuovo membro staff</h2>

            <div className="space-y-4">
              <input placeholder="Nome" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none" />
              <input placeholder="Cognome" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none" />
              <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none" />
              <input placeholder="Telefono" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none" />
              <input placeholder="Ruolo" value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none" />
              <input placeholder="Codice fiscale" value={fiscalCode} onChange={(e) => setFiscalCode(e.target.value)} className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none" />
              <input placeholder="Partita IVA" value={vatNumber} onChange={(e) => setVatNumber(e.target.value)} className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none" />
              <input placeholder="IBAN" value={iban} onChange={(e) => setIban(e.target.value)} className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none" />

              <select
                value={taxRegime}
                onChange={(e) => setTaxRegime(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              >
                <option value="ritenuta_acconto">Ritenuta d’acconto</option>
                <option value="collaborazione_occasionale">Collaborazione occasionale</option>
                <option value="piva_forfettaria">Partita IVA forfettaria</option>
                <option value="piva_ordinaria">Partita IVA ordinaria</option>
                <option value="cooperativa">Cooperativa</option>
                <option value="agenzia">Agenzia esterna</option>
                <option value="enpals">Prestazione artistica / ENPALS</option>
                <option value="altro">Altro</option>
              </select>

              <label className="flex items-center gap-3 rounded-2xl bg-zinc-50 p-4 text-sm">
                <input
                  type="checkbox"
                  checked={withholdingTax}
                  onChange={(e) => setWithholdingTax(e.target.checked)}
                />
                Applica ritenuta d’acconto
              </label>

              <input
                type="number"
                placeholder="Netto concordato"
                value={agreedAmount}
                onChange={(e) => setAgreedAmount(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <input
                type="number"
                placeholder="Aliquota ritenuta %"
                value={withholdingRate}
                onChange={(e) => setWithholdingRate(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <input
                type="number"
                placeholder="Altre tasse / contributi %"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <div className="rounded-3xl bg-black p-6 text-white">
                <p>Netto collaboratore: € {calculation.netAmount}</p>
                <p>Trattenute / tasse: € {calculation.taxAmount}</p>
                <p className="mt-2 text-xl font-bold">
                  Costo azienda: € {calculation.grossAmount}
                </p>
              </div>

              <div className="space-y-3 rounded-3xl bg-zinc-50 p-5 text-sm">
                <label className="flex gap-3">
                  <input type="checkbox" checked={acceptedConditions} onChange={(e) => setAcceptedConditions(e.target.checked)} />
                  Accetto condizioni economiche e operative
                </label>

                <label className="flex gap-3">
                  <input type="checkbox" checked={acceptedPrivacy} onChange={(e) => setAcceptedPrivacy(e.target.checked)} />
                  Accetto trattamento dati personali
                </label>

                <label className="flex gap-3">
                  <input type="checkbox" checked={acceptedDressCode} onChange={(e) => setAcceptedDressCode(e.target.checked)} />
                  Accetto puntualità, dress code e policy aziendale
                </label>

                <label className="flex gap-3">
                  <input type="checkbox" checked={acceptedConfidentiality} onChange={(e) => setAcceptedConfidentiality(e.target.checked)} />
                  Accetto riservatezza, social policy e comportamento professionale
                </label>
              </div>

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
              <h2 className="text-2xl font-bold">Lista staff</h2>

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
                          <p>💼 P.IVA: {person.vatNumber || 'Non indicata'}</p>
                          <p>🏦 IBAN: {person.iban || 'Non indicato'}</p>
                          <p>📌 Regime: {person.taxRegime || 'Non indicato'}</p>
                          <p>💶 Netto: € {person.netAmount || 0}</p>
                          <p>🧮 Tasse: € {person.taxAmount || 0}</p>
                          <p className="font-bold text-black">
                            🏢 Costo azienda: € {person.grossAmount || 0}
                          </p>
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