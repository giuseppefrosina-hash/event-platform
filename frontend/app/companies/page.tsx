'use client';

import { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';

const API_URL = 'https://api.uniquo.it';

type Company = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  vatNumber?: string;
  address?: string;
};

type AddressSuggestion = {
  place_id: number;
  display_name: string;
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');

    if (savedToken) {
      setToken(savedToken);
      loadCompanies(savedToken);
    }
  }, []);

  useEffect(() => {
    if (address.length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(address)}`,
        );

        const data = await res.json();
        setSuggestions(data || []);
      } catch {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [address]);

  async function loadCompanies(currentToken?: string) {
    try {
      const jwtToken = currentToken || token || localStorage.getItem('token');

      if (!jwtToken) {
        setMessage('Effettua il login per vedere le aziende');
        return;
      }

      const response = await fetch(`${API_URL}/companies`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Errore caricamento aziende');
        return;
      }

      setCompanies(Array.isArray(data) ? data : []);
    } catch {
      setMessage('Errore connessione backend');
    }
  }

  async function createCompany() {
    try {
      const jwtToken = token || localStorage.getItem('token');

      if (!jwtToken) {
        setMessage('Effettua il login prima');
        return;
      }

      const response = await fetch(`${API_URL}/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          name,
          email,
          phone: phone ? `+${phone}` : '',
          vatNumber,
          address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Errore creazione azienda');
        return;
      }

      setName('');
      setEmail('');
      setPhone('');
      setVatNumber('');
      setAddress('');
      setSuggestions([]);

      setMessage('Azienda creata');
      loadCompanies(jwtToken);
    } catch {
      setMessage('Errore connessione backend');
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#111]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="mb-4 text-6xl font-bold">Companies CRM</h1>

        <p className="mb-8 text-zinc-500">
          Gestione aziende collegate alla piattaforma eventi.
        </p>

        {message && (
          <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm">
            {message}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <section className="rounded-[2rem] bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">Nuova azienda</h2>

            <div className="space-y-4">
              <input
                placeholder="Nome azienda"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <PhoneInput
                country="it"
                value={phone}
                onChange={(value) => setPhone(value)}
                inputClass="!w-full !h-[58px] !rounded-2xl !border !border-zinc-200 !bg-zinc-50 !pl-14 !text-base"
                buttonClass="!rounded-l-2xl !border-zinc-200"
                containerClass="!w-full"
                placeholder="Telefono"
              />

              <input
                placeholder="Partita IVA"
                value={vatNumber}
                onChange={(e) => setVatNumber(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <div className="relative">
                <input
                  placeholder="Indirizzo"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
                />

                {suggestions.length > 0 && (
                  <div className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-2xl border border-zinc-200 bg-white shadow-lg">
                    {suggestions.map((item) => (
                      <button
                        key={item.place_id}
                        type="button"
                        onClick={() => {
                          setAddress(item.display_name);
                          setSuggestions([]);
                        }}
                        className="block w-full px-5 py-3 text-left text-sm hover:bg-zinc-100"
                      >
                        {item.display_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={createCompany}
                className="w-full rounded-2xl bg-black px-6 py-4 font-semibold text-white"
              >
                Crea azienda
              </button>
            </div>
          </section>

          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Lista aziende</h2>

              <button
                onClick={() => loadCompanies()}
                className="rounded-2xl bg-black px-5 py-3 text-white"
              >
                Refresh
              </button>
            </div>

            <div className="grid gap-5">
              {companies.length === 0 ? (
                <div className="rounded-[2rem] bg-white p-10 text-center text-zinc-500 shadow-sm">
                  Nessuna azienda trovata.
                </div>
              ) : (
                companies.map((company) => (
                  <article
                    key={company.id}
                    className="rounded-[2rem] bg-white p-7 shadow-sm"
                  >
                    <h3 className="text-2xl font-bold">{company.name}</h3>

                    <div className="mt-4 grid gap-2 text-zinc-500">
                      <p>📧 {company.email || 'Email non inserita'}</p>
                      <p>📞 {company.phone || 'Telefono non inserito'}</p>
                      <p>🧾 {company.vatNumber || 'P.IVA non inserita'}</p>
                      <p>📍 {company.address || 'Indirizzo non inserito'}</p>
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