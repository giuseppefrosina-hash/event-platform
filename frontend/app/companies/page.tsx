'use client';

import { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import Sidebar from '../../components/Sidebar';

const API_URL = 'https://api.uniquo.it';

const GEOAPIFY_KEY =
  process.env.NEXT_PUBLIC_GEOAPIFY_KEY;

type Company = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  vatNumber?: string;
  address?: string;
  logo?: string;
};

type AddressSuggestion = {
  place_id: string;
  display_name: string;
};

export default function CompaniesPage() {
  const [companies, setCompanies] =
    useState<Company[]>([]);

  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [address, setAddress] = useState('');

  const [logoUrl, setLogoUrl] = useState('');
  const [uploadingLogo, setUploadingLogo] =
    useState(false);

  const [suggestions, setSuggestions] =
    useState<AddressSuggestion[]>([]);

  useEffect(() => {
    const savedToken =
      localStorage.getItem('token');

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
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
            address,
          )}&limit=5&lang=it&apiKey=${GEOAPIFY_KEY}`,
        );

        const data = await res.json();

        const formatted =
          data.features?.map((item: any) => ({
            place_id:
              item.properties.place_id,
            display_name:
              item.properties.formatted,
          })) || [];

        setSuggestions(formatted);
      } catch {
        setSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [address]);

async function loadCompanies(
  currentToken?: string,
) {
  try {
    const jwtToken =
      currentToken ||
      token ||
      localStorage.getItem('token');

    if (!jwtToken) {
      setMessage('Effettua il login');
      return;
    }

    const response = await fetch(
      `${API_URL}/companies`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      setMessage(
        data.message ||
          'Errore caricamento aziende',
      );
      return;
    }

    setCompanies(
      Array.isArray(data) ? data : [],
    );
  } catch {
    setMessage(
      'Errore connessione backend',
    );
  }
}

async function createCompany() {
  try {
    const jwtToken =
      token ||
      localStorage.getItem('token');

    if (!jwtToken) {
      setMessage('Effettua il login prima');
      return;
    }

    const response = await fetch(
      `${API_URL}/companies`,
      {
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
          logo: logoUrl,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      setMessage(
        data.message ||
          'Errore creazione azienda',
      );
      return;
    }

    setName('');
    setEmail('');
    setPhone('');
    setVatNumber('');
    setAddress('');
    setLogoUrl('');
    setSuggestions([]);

    setMessage('Azienda creata con successo');
    loadCompanies(jwtToken);
  } catch {
    setMessage('Errore connessione backend');
  }
}
  async function uploadLogo(
    file: File,
  ) {
    try {
      setUploadingLogo(true);
      setMessage('Caricamento logo...');

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${API_URL}/upload/image`,
        {
          method: 'POST',
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            'Errore upload logo',
        );
        return;
      }

      setLogoUrl(
  data.secure_url || data.url,
);
      setMessage('Logo caricato');
    } catch {
      setMessage('Errore upload logo');
    } finally {
      setUploadingLogo(false);
    }
  }

  async function deleteCompany(id: string) {
    try {
      const jwtToken =
        token ||
        localStorage.getItem('token');

      if (!jwtToken) {
        setMessage('Effettua il login prima');
        return;
      }

      const res = await fetch(
        `${API_URL}/companies/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      );

      if (!res.ok) {
        setMessage('Errore eliminazione azienda');
        return;
      }

      setMessage('Azienda eliminata');
      loadCompanies(jwtToken);
    } catch {
      setMessage('Errore eliminazione azienda');
    }
  }

  async function editCompany(company: Company) {
    const newName = prompt(
      'Nome azienda',
      company.name,
    );

    if (!newName) return;

    try {
      const jwtToken =
        token ||
        localStorage.getItem('token');

      if (!jwtToken) {
        setMessage('Effettua il login prima');
        return;
      }

      const res = await fetch(
        `${API_URL}/companies/${company.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            name: newName,
          }),
        },
      );

      if (!res.ok) {
        setMessage('Errore modifica azienda');
        return;
      }

      setMessage('Azienda aggiornata');
      loadCompanies(jwtToken);
    } catch {
      setMessage('Errore modifica azienda');
    }
  }

  return (
  <div className="flex min-h-screen">
    <Sidebar />

    <main className="flex-1 bg-[#f5f5f7] text-[#111]">
      <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
  <div>
    <h1 className="mb-2 text-6xl font-bold">
      Companies CRM
    </h1>

    <p className="text-zinc-500">
      Gestione aziende professionale.
    </p>
  </div>

</div>

        {message && (
          <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm">
            {message}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <section className="rounded-[2rem] bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              Nuova azienda
            </h2>

            <div className="space-y-4">
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-5 text-center">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo azienda"
                    className="mx-auto mb-4 h-24 w-24 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-white text-zinc-400">
                    Logo
                  </div>
                )}

                <label className="cursor-pointer rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white">
                  {uploadingLogo
                    ? 'Caricamento...'
                    : 'Carica logo'}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file =
                        e.target.files?.[0];

                      if (file) {
                        uploadLogo(file);
                      }
                    }}
                  />
                </label>
              </div>

              <input
                placeholder="Nome azienda"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
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

              <PhoneInput
                country="it"
                value={phone}
                onChange={(value) =>
                  setPhone(value)
                }
                inputClass="!w-full !h-[58px] !rounded-2xl !border !border-zinc-200 !bg-zinc-50 !pl-14 !text-base"
                buttonClass="!rounded-l-2xl !border-zinc-200"
                containerClass="!w-full"
                placeholder="Telefono"
              />

              <input
                placeholder="Partita IVA"
                value={vatNumber}
                onChange={(e) =>
                  setVatNumber(
                    e.target.value,
                  )
                }
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
              />

              <div className="relative">
                <input
                  placeholder="Indirizzo"
                  value={address}
                  onChange={(e) =>
                    setAddress(
                      e.target.value,
                    )
                  }
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 outline-none"
                />

                {suggestions.length > 0 && (
                  <div className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-2xl border border-zinc-200 bg-white shadow-lg">
                    {suggestions.map(
                      (item) => (
                        <button
                          key={
                            item.place_id
                          }
                          type="button"
                          onClick={() => {
                            setAddress(
                              item.display_name,
                            );
                            setSuggestions(
                              [],
                            );
                          }}
                          className="block w-full px-5 py-3 text-left text-sm hover:bg-zinc-100"
                        >
                          {
                            item.display_name
                          }
                        </button>
                      ),
                    )}
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
              <h2 className="text-2xl font-bold">
                Lista aziende
              </h2>

              <button
                onClick={() =>
                  loadCompanies()
                }
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
                companies.map(
                  (company) => (
                    <article
                      key={company.id}
                      className="flex gap-5 rounded-[2rem] bg-white p-7 shadow-sm"
                    >
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="h-20 w-20 rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
                          Logo
                        </div>
                      )}

                      <div className="flex-1">
  <div className="flex items-start justify-between">
    <h3 className="text-2xl font-bold">
      {company.name}
    </h3>

    <div className="flex gap-2">
      <button
        onClick={() =>
          editCompany(company)
        }
        className="rounded-xl bg-blue-100 px-4 py-2 text-blue-600"
      >
        Modifica
      </button>

      <button
        onClick={() =>
          deleteCompany(company.id)
        }
        className="rounded-xl bg-red-100 px-4 py-2 text-red-600"
      >
        Elimina
      </button>
    </div>
  </div>

                        <div className="mt-4 grid gap-2 text-zinc-500">
                          <p>
                            📧{' '}
                            {company.email ||
                              'Non disponibile'}
                          </p>

                          <p>
                            📞{' '}
                            {company.phone ||
                              'Non disponibile'}
                          </p>

                          <p>
                            🧾{' '}
                            {company.vatNumber ||
                              'Non disponibile'}
                          </p>

                          <p>
                            📍{' '}
                            {company.address ||
                              'Non disponibile'}
                          </p>
                        </div>
                      </div>
                    </article>
                  ),
                )
              )}
            </div>
          </section>
        </div>
      </div>
      </main>
  </div>
  );
}