'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const API_URL = 'https://api.uniquo.it';

type EventItem = {
  id: string;
  title: string;
  description?: string;
  location?: string;
  date: string;
  price?: number;
  image?: string;
};

export default function EventDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [event, setEvent] =
    useState<EventItem | null>(null);

  useEffect(() => {
    loadEvent();
  }, []);

  async function loadEvent() {
    try {
      const res = await fetch(
        API_URL + '/events/' + id,
      );

      const data = await res.json();
      setEvent(data);
    } catch (error) {
      console.error(error);
    }
  }

  if (!event) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f5f7] text-[#111]">
        Caricamento...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#111]">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <a
            href="/events"
            className="rounded-2xl bg-black px-5 py-3 font-semibold text-white"
          >
            ← Torna agli eventi
          </a>

          <a
            href="/dashboard"
            className="rounded-2xl border border-zinc-300 bg-white px-5 py-3 font-semibold"
          >
            Dashboard
          </a>
        </div>

        <article className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
          {event.image && (
            <img
              src={event.image}
              alt={event.title}
              className="h-[420px] w-full object-cover"
            />
          )}

          <div className="p-10">
            <h1 className="mb-6 text-5xl font-bold">
              {event.title}
            </h1>

            <div className="mb-8 grid gap-3 text-lg text-zinc-600">
              <p>
                📍{' '}
                {event.location ||
                  'Location non indicata'}
              </p>

              <p>
                📅{' '}
                {new Date(
                  event.date,
                ).toLocaleString('it-IT')}
              </p>

              <p>
                💶 € {event.price || 0}
              </p>
            </div>

            <button
              onClick={async () => {
                const res = await fetch(
                  'https://api.uniquo.it/stripe/create-checkout-session',
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type':
                        'application/json',
                    },
                    body: JSON.stringify({
                      title: event.title,
                      price:
                        event.price || 0,
                    }),
                  },
                );

                const data =
                  await res.json();

                if (data.url) {
                  window.location.href =
                    data.url;
                }
              }}
              className="mb-8 rounded-2xl bg-black px-6 py-4 font-semibold text-white"
            >
              Acquista ticket
            </button>

            <div className="rounded-3xl bg-zinc-50 p-8 text-zinc-700">
              {event.description ||
                'Nessuna descrizione disponibile'}
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}