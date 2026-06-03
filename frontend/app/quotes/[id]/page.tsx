'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const API_URL = 'https://api.uniquo.it';

type Quote = {
  id: string;
  quoteNumber: string;
  clientName: string;
  totalAmount: number;
  vatAmount: number;
  status: string;
  createdAt: string;
  event?: {
    title: string;
    description?: string;
    location?: string;
    date: string;
  };
};

export default function QuotePrintPage() {
  const params = useParams();
  const id = params.id as string;

  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    loadQuote();
  }, []);

  async function loadQuote() {
    const res = await fetch(API_URL + '/quotes');
    const data = await res.json();

    const found = Array.isArray(data)
      ? data.find((item) => item.id === id)
      : null;

    setQuote(found || null);
  }

  if (!quote) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        Preventivo non trovato
      </main>
    );
  }

  const taxable =
    Number(quote.totalAmount || 0) -
    Number(quote.vatAmount || 0);

  return (
    <main className="min-h-screen bg-white p-10 text-[#111] print:p-0">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-zinc-200 bg-white p-10 shadow-sm print:border-0 print:shadow-none">
        <div className="mb-10 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Uniquo
            </h1>
            <p className="mt-2 text-zinc-500">
              Event Management Platform
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="rounded-2xl bg-black px-5 py-3 font-semibold text-white print:hidden"
          >
            Scarica / Stampa PDF
          </button>
        </div>

        <div className="mb-10 border-b border-zinc-200 pb-8">
          <p className="mb-2 text-sm uppercase tracking-[0.3em] text-zinc-500">
            Preventivo
          </p>

          <h2 className="text-3xl font-bold">
            Preventivo {quote.quoteNumber}
          </h2>

          <p className="mt-2 text-zinc-500">
            Data:{' '}
            {new Date(quote.createdAt).toLocaleDateString(
              'it-IT',
            )}
          </p>
        </div>

        <div className="mb-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-zinc-50 p-6">
            <h3 className="mb-3 text-lg font-bold">
              Cliente
            </h3>
            <p>{quote.clientName}</p>
          </div>

          <div className="rounded-3xl bg-zinc-50 p-6">
            <h3 className="mb-3 text-lg font-bold">
              Stato
            </h3>
            <p>{quote.status}</p>
          </div>
        </div>

        <div className="mb-10 rounded-3xl bg-zinc-50 p-6">
          <h3 className="mb-4 text-xl font-bold">
            Evento
          </h3>

          <p className="text-lg font-semibold">
            {quote.event?.title || 'Evento'}
          </p>

          {quote.event?.description && (
            <p className="mt-2 text-zinc-600">
              {quote.event.description}
            </p>
          )}

          <div className="mt-4 grid gap-2 text-zinc-600">
            <p>
              Luogo:{' '}
              {quote.event?.location ||
                'Non indicato'}
            </p>

            <p>
              Data:{' '}
              {quote.event?.date
                ? new Date(
                    quote.event.date,
                  ).toLocaleString('it-IT')
                : 'Non indicata'}
            </p>
          </div>
        </div>

        <div className="mb-10 overflow-hidden rounded-3xl border border-zinc-200">
          <div className="grid grid-cols-2 bg-zinc-100 p-4 font-bold">
            <p>Voce</p>
            <p className="text-right">Importo</p>
          </div>

          <div className="grid grid-cols-2 p-4">
            <p>Imponibile</p>
            <p className="text-right">
              € {taxable.toFixed(2)}
            </p>
          </div>

          <div className="grid grid-cols-2 border-t border-zinc-200 p-4">
            <p>IVA</p>
            <p className="text-right">
              € {Number(quote.vatAmount || 0).toFixed(2)}
            </p>
          </div>

          <div className="grid grid-cols-2 border-t border-zinc-200 bg-black p-4 font-bold text-white">
            <p>Totale</p>
            <p className="text-right">
              € {Number(quote.totalAmount || 0).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-zinc-50 p-6 text-sm text-zinc-600">
          <h3 className="mb-3 font-bold text-black">
            Condizioni
          </h3>

          <p>
            Il presente preventivo è da considerarsi valido
            salvo diversa comunicazione scritta. Eventuali
            variazioni operative, tecniche o logistiche potranno
            comportare una revisione economica.
          </p>
        </div>

        <div className="mt-10 flex justify-between text-sm text-zinc-500">
          <p>Uniquo</p>
          <p>Preventivo generato automaticamente</p>
        </div>
      </div>
    </main>
  );
}