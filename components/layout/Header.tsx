import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center">
        <Link href="/" className="shrink-0" aria-label="Ir al inicio">
          <Image src="/logo.png" alt="Jugueteria Nico" width={160} height={70} priority />
        </Link>

        <form action="/catalogo" className="flex flex-1">
          <label className="sr-only" htmlFor="search">Buscar productos</label>
          <input id="search" name="q" placeholder="Busca juguetes, marcas o libreria..." className="h-11 min-w-0 flex-1 rounded-l-xl border border-zinc-300 px-4 outline-none ring-red-500 focus:ring-2" />
          <button className="rounded-r-xl bg-red-600 px-5 font-bold text-white transition hover:bg-red-700" type="submit">Buscar</button>
        </form>

        <Link href="/catalogo" className="text-sm font-bold text-zinc-800 hover:text-red-600">Ver catalogo</Link>
      </div>
    </header>
  );
}

