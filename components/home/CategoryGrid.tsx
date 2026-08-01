import Link from "next/link";
import { categories } from "@/data/categories";
import SectionHeader from "@/components/common/SectionHeader";

export default function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <SectionHeader
        eyebrow="Explora"
        title="Encontra lo que estas buscando"
        description="Navega rapido por los rubros principales de la jugueteria."
      />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categoria/${category.slug}`}
            className="rounded-2xl border border-zinc-200 bg-white p-4 text-center transition hover:-translate-y-0.5 hover:border-red-300 hover:shadow-md"
          >
            <span className="text-3xl">{category.emoji}</span>
            <p className="mt-3 text-sm font-bold text-zinc-800">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

