"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { products } from "@/data/products";

function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function ProductSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const normalizedQuery = normalizeText(query.trim());

  const suggestions = products
    .filter((product) => {
      const searchableText = normalizeText(
        `${product.nombre} ${product.marca} ${product.categoria}`,
      );

      return searchableText.includes(normalizedQuery);
    })
    .slice(0, 5);

  const showSuggestions = isOpen && normalizedQuery.length > 0;

  return (
    <form action="/catalogo" className="relative flex flex-1" role="search">
      <label className="sr-only" htmlFor="search">
        Buscar productos
      </label>

      <input
        id="search"
        name="q"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => window.setTimeout(() => setIsOpen(false), 150)}
        placeholder="Buscá juguetes, marcas o librería..."
        autoComplete="off"
        className="h-11 min-w-0 flex-1 rounded-l-xl border border-zinc-300 px-4 outline-none ring-red-500 focus:ring-2"
      />

      <button
        className="rounded-r-xl bg-red-600 px-5 font-bold text-white transition hover:bg-red-700"
        type="submit"
      >
        Buscar
      </button>

      {showSuggestions && (
        <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl">
          {suggestions.length > 0 ? (
            <>
              <p className="px-4 pt-3 text-xs font-bold uppercase tracking-wider text-zinc-500">
                Productos sugeridos
              </p>

              <ul className="mt-2">
                {suggestions.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/producto/${product.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 transition hover:bg-zinc-50"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                        <Image
                          src={product.imagen}
                          alt=""
                          width={44}
                          height={44}
                          className="max-h-9 w-auto object-contain"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-bold text-zinc-900">
                          {product.nombre}
                        </p>

                        <p className="text-sm text-zinc-500">{product.marca}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                href={`/catalogo?q=${encodeURIComponent(query)}`}
                onClick={() => setIsOpen(false)}
                className="block border-t border-zinc-200 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
              >
                Ver todos los resultados para “{query}”
              </Link>
            </>
          ) : (
            <p className="px-4 py-4 text-sm text-zinc-600">
              No encontramos productos para “{query}”.
            </p>
          )}
        </div>
      )}
    </form>
  );
}
