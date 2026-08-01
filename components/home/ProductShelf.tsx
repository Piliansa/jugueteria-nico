import Link from "next/link";
import type { Product } from "@/types/Product";
import SectionHeader from "@/components/common/SectionHeader";

type ProductShelfProps = {
  eyebrow: string;
  title: string;
  products: Product[];
};

export default function ProductShelf({
  eyebrow,
  title,
  products,
}: ProductShelfProps) {
  if (!products.length) return null;
  return (
    <section className="bg-zinc-50 py-16">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader eyebrow={eyebrow} title={title} />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((product) => (
            <Link
              key={product.id}
              href={`/producto/${product.slug}`}
              className="rounded-2xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex h-44 items-center justify-center rounded-xl bg-amber-50 text-5xl">
                ðŸ§¸
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-widest text-zinc-500">
                {product.marca}
              </p>
              <h3 className="mt-1 text-lg font-black text-zinc-900">
                {product.nombre}
              </h3>
              <p className="mt-2 text-sm text-zinc-600">{product.categoria}</p>
              <p className="mt-4 font-bold text-red-600">
                {product.precio > 0
                  ? `$${product.precio.toLocaleString("es-AR")}`
                  : "Consultar precio"}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

