import { brands } from "@/data/brands";
import SectionHeader from "@/components/common/SectionHeader";

export default function Brands() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <SectionHeader
        eyebrow="Primeras marcas"
        title="Marcas que acompaÃ±an cada juego"
      />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {brands.map((brand) => (
          <div
            key={brand}
            className="flex min-h-24 items-center justify-center rounded-2xl border border-zinc-200 bg-white p-4 text-center text-sm font-black text-zinc-700"
          >
            {brand}
          </div>
        ))}
      </div>
    </section>
  );
}

