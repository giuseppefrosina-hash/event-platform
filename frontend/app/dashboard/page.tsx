'use client';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0f] text-white">
      <div className="flex min-h-screen">
        <aside className="w-72 border-r border-white/10 bg-black/30 p-6">
          <h1 className="mb-10 text-2xl font-bold">
            Event Platform
          </h1>

          <nav className="space-y-3 text-zinc-400">
            <a className="block rounded-xl bg-white/10 px-4 py-3 text-white" href="/dashboard">
              Dashboard
            </a>
            <a className="block rounded-xl px-4 py-3 hover:bg-white/10" href="/">
              Events
            </a>
            <a className="block rounded-xl px-4 py-3 hover:bg-white/10" href="/companies">
              Companies
            </a>
            <a className="block rounded-xl px-4 py-3 hover:bg-white/10" href="/staff">
              Staff
            </a>
            <a className="block rounded-xl px-4 py-3 hover:bg-white/10" href="/suppliers">
              Suppliers
            </a>
          </nav>
        </aside>

        <section className="flex-1 p-10">
          <div className="mb-10">
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-zinc-500">
              SaaS Control Center
            </p>
            <h2 className="text-5xl font-bold">
              Dashboard
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {[
              ['Events', '12'],
              ['Companies', '8'],
              ['Staff', '5'],
              ['Revenue', '€0'],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6"
              >
                <p className="mb-3 text-zinc-400">{label}</p>
                <h3 className="text-4xl font-bold">{value}</h3>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8">
              <h3 className="mb-4 text-2xl font-bold">
                Quick Actions
              </h3>

              <div className="grid gap-4">
                <a href="/companies" className="rounded-2xl bg-white px-5 py-4 font-semibold text-black">
                  Manage Companies
                </a>
                <a href="/" className="rounded-2xl bg-white/10 px-5 py-4 font-semibold text-white">
                  Manage Events
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8">
              <h3 className="mb-4 text-2xl font-bold">
                System Status
              </h3>

              <div className="space-y-4 text-zinc-300">
                <p>✅ Frontend online</p>
                <p>✅ Backend API connected</p>
                <p>✅ Database connected</p>
                <p>✅ Custom domain configured</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}