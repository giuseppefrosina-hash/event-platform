'use client';

import axios from 'axios';

import { useEffect, useState } from 'react';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function EventPage({
  params,
}: Props) {
  const [event, setEvent] =
    useState<any>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      const resolvedParams =
        await params;

      try {
        const res = await axios.get(
          `http://localhost:3001/events/${resolvedParams.id}`,
        );

        setEvent(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchEvent();
  }, [params]);

  if (!event) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto bg-zinc-900 rounded-3xl p-10">

        <img
          src={
            event.image ||
            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'
          }
          alt={event.title}
          className="w-full h-[400px] object-cover rounded-3xl mb-8"
        />

        <h1 className="text-5xl font-bold mb-6">
          {event.title}
        </h1>

        <p className="text-zinc-300 text-2xl mb-6">
          {event.description}
        </p>

        <p className="text-zinc-400 text-xl mb-4">
          📍 {event.location}
        </p>

        <p className="text-zinc-500 text-lg mb-10">
          📅 {new Date(event.date).toLocaleDateString()}
        </p>

        <div className="bg-green-500 text-black text-3xl font-bold p-6 rounded-2xl text-center">
          🎟 BIGLIETTO VALIDO
        </div>
      </div>
    </main>
  );
}