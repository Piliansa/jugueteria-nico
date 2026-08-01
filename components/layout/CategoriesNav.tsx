import Link from "next/link";
import { categories } from "@/data/categories";

export default function CategoriesNav() {
  return (
    <nav aria-label="Categorias" className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl gap-5 overflow-x-auto px-5 py-3 text-sm font-semibold whitespace-nowrap">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categoria/${category.slug}`}
            className="text-zinc-700 transition hover:text-red-600"
          >
            {category.emoji} {category.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}

