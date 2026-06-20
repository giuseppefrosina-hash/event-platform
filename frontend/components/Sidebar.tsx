'use client';

export default function Sidebar() {
  function logout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  const links = [
    ['Dashboard', '/dashboard'],
    ['Pratiche', '/practices'],
    ['Aziende', '/companies'],
    ['Fornitori', '/suppliers'],
    ['Staff', '/staff'],
    ['Costing', '/costing'],
    ['Preventivi', '/quotes'],
  ];

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-zinc-200 bg-white p-6 lg:block">
      <div className="mb-10">
        <h1 className="text-2xl font-black tracking-tight text-black">
          Uniquo
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Event Platform
        </p>
      </div>

      <nav className="space-y-2">
        {links.map(([label, href]) => (
          <a
            key={href}
            href={href}
            className="block rounded-2xl px-4 py-3 font-semibold text-zinc-600 hover:bg-zinc-100 hover:text-black"
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        onClick={logout}
        className="mt-10 w-full rounded-2xl bg-zinc-100 px-4 py-3 font-semibold text-zinc-700 hover:bg-red-100 hover:text-red-700"
      >
        Logout
      </button>
    </aside>
  );
}