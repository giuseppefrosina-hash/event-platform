'use client';

import { useEffect, useState } from 'react';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [address, setAddress] = useState('');

  async function loadCompanies() {
    try {
      const response = await fetch(`${API_URL}/companies`);

      if (!response.ok) {
        throw new Error('Errore caricamento aziende');
      }

      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error('Error loading companies:', error);
    }
  }

  async function createCompany() {
    try {
      const response = await fetch(`${API_URL}/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          vatNumber,
          address,
        }),
      });

      if (!response.ok) {
        throw new Error('Errore creazione azienda');
      }

      setName('');
      setEmail('');
      setPhone('');
      setVatNumber('');
      setAddress('');

      loadCompanies();
    } catch (error) {
      console.error('Error creating company:', error);
    }
  }

  useEffect(() => {
    loadCompanies();
  }, []);

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">
        Companies CRM
      </h1>

      <div className="border rounded-2xl p-6 mb-10 space-y-4">
        <input
          placeholder="Company Name"
          className="border p-3 w-full rounded-xl"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          className="border p-3 w-full rounded-xl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Phone"
          className="border p-3 w-full rounded-xl"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          placeholder="VAT Number"
          className="border p-3 w-full rounded-xl"
          value={vatNumber}
          onChange={(e) => setVatNumber(e.target.value)}
        />

        <input
          placeholder="Address"
          className="border p-3 w-full rounded-xl"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <button
          onClick={createCompany}
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          Create Company
        </button>
      </div>

      <div className="space-y-4">
        {companies.map((company) => (
          <div
            key={company.id}
            className="border rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold">
              {company.name}
            </h2>
            <p>{company.email}</p>
            <p>{company.phone}</p>
            <p>{company.vatNumber}</p>
            <p>{company.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
}