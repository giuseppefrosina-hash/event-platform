'use client';

import { useEffect, useState } from 'react';

const API_URL = "https://api.uniquo.it";

type Company = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  vatNumber?: string;
  address?: string;
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [address, setAddress] = useState('');

  async function login() {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Login failed');
        return;
      }

      const jwtToken = data.access_token || data.token;

      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);
      setMessage('Login effettuato');

      loadCompanies(jwtToken);
    } catch {
      setMessage('Errore login');
    }
  }

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
          phone,
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

      setMessage('Azienda creata');
      loadCompanies(jwtToken);
    } catch {
      setMessage('Errore connessione backend');
    }
  }

  useEffect(() => {
    const savedToken = localStorage.getItem('token');

    if (savedToken) {
      setToken(savedToken);
      loadCompanies(savedToken);
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#111]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="mb-4 text-6xl font-bold">
          Companies CRM
        </h1>

        <p className="mb-8 text-zinc-500">
          Gestione aziende collegate alla piattaforma eventi.
        </p>

        {message && (
          <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm">
            {message}
          </div>
        )}

        {!token && (
          <section className="mb-10 rounded-[2rem] bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              Login
            </h2>

            <div className="grid gap-4 md:grid-cols-3">
              <input
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <input
                placeholder="Password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <button
                onClick={login}
                className="rounded-2xl bg-black px-6 py-4 font-semibold text-white"
              >
                Login
              </button>
            </div>
          </section>
        )}

        {token && (
          <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
            <section className="rounded-[2rem] bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-2xl font-bold">
                Nuova azienda
              </h2>

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

                <input
                  placeholder="Telefono"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
                />

                <input
                  placeholder="Partita IVA"
                  value={vatNumber}
                  onChange={(e) => setVatNumber(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
                />

                <input
                  placeholder="Indirizzo"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
                />

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
                <h2 className="text-2xl font-bold">
                  Lista aziende
                </h2>

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
                      <h3 className="text-2xl font-bold">
                        {company.name}
                      </h3>

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
        )}
      </div>
    </main>
  );
}