'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const API_URL = 'https://api.uniquo.it';

export default function CheckInPage() {
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const [qrCode, setQrCode] = useState('');
  const [message, setMessage] = useState('');
  const [scanning, setScanning] = useState(false);

  async function checkIn(code?: string) {
    const finalCode = code || qrCode;

    if (!finalCode) {
      setMessage('Inserisci o scansiona un QR code');
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/tickets/checkin/${finalCode}`,
        {
          method: 'PATCH',
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(
          data.message ||
            'Ticket non valido o già usato',
        );
        return;
      }

      setMessage(
        `Check-in completato per ${data.fullName}`,
      );

      setQrCode('');
    } catch {
      setMessage('Errore durante il check-in');
    }
  }

  async function startScanner() {
    try {
      setMessage('');

      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      setScanning(true);

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
        },
        async (decodedText) => {
          await stopScanner();
          setQrCode(decodedText);
          checkIn(decodedText);
        },
        () => {},
      );
    } catch {
      setScanning(false);
      setMessage(
        'Impossibile avviare la fotocamera',
      );
    }
  }

  async function stopScanner() {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch {}

      scannerRef.current = null;
    }

    setScanning(false);
  }

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#0b0b0f] text-white">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-zinc-500">
              QR Check-in
            </p>
            <h1 className="text-5xl font-bold">
              Validazione ticket
            </h1>
          </div>

          <a
            href="/dashboard"
            className="rounded-2xl bg-white px-5 py-3 font-semibold text-black"
          >
            Dashboard
          </a>
        </div>

        {message && (
          <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.06] p-5">
            {message}
          </div>
        )}

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8">
          <div className="mb-8 rounded-2xl bg-black/30 p-4">
            <div
              id="qr-reader"
              className="overflow-hidden rounded-2xl"
            />
          </div>

          <div className="grid gap-4">
            <input
              placeholder="Inserisci QR code manualmente"
              value={qrCode}
              onChange={(e) =>
                setQrCode(e.target.value)
              }
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
            />

            <button
              onClick={() => checkIn()}
              className="rounded-2xl bg-white px-6 py-4 font-semibold text-black"
            >
              Valida ticket
            </button>

            {!scanning ? (
              <button
                onClick={startScanner}
                className="rounded-2xl bg-emerald-500 px-6 py-4 font-semibold text-white"
              >
                Avvia scanner QR
              </button>
            ) : (
              <button
                onClick={stopScanner}
                className="rounded-2xl bg-red-500 px-6 py-4 font-semibold text-white"
              >
                Ferma scanner
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
