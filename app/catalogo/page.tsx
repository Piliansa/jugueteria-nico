import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import CategoriesNav from "@/components/layout/CategoriesNav";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import { products } from "@/data/products";

type CatalogPageProps = {
  searchParams: Promise<{
    q?: string | string[];
  }>;
};

function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;

  const rawQuery = typeof params.q === "string" ? params.q.trim() : "";
  const query = normalizeText(rawQuery);

  const filteredProducts = products.filter((product) => {
    const searchableText = normalizeText(
      `${product.nombre} ${product.marca} ${product.categoria} ${product.edad}`,
    );

    return searchableText.includes(query);
  });

  return (
    <>
      <TopBar />
      <Header />
      <CategoriesNav />

      <main className="flex-1 bg-zinc-50">
        <section className="mx-auto max-w-7xl px-5 py-12">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-600">
            Juguetería Nico
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-zinc-900 sm:text-5xl">
                Catálogo
              </h1>

              <p className="mt-3 text-zinc-600">
                {rawQuery
                  ? `Resultados para “${rawQuery}”`
                  : "Explorá todos nuestros productos."}
              </p>
            </div>

            <p className="text-sm font-semibold text-zinc-500">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "producto" : "productos"}
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center">
              <h2 className="text-xl font-bold text-zinc-900">
                No encontramos productos
              </h2>

              <p className="mt-2 text-zinc-600">
                Probá buscar por marca, categoría o nombre.
              </p>

              <Link
                href="/catalogo"
                className="mt-6 inline-block rounded-xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700"
              >
                Ver todo el catálogo
              </Link>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
