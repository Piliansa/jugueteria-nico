import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import CategoriesNav from "@/components/layout/CategoriesNav";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import { categories } from "@/data/categories";
import { products } from "@/data/products";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter(
    (product) =>
      normalizeText(product.categoria) === normalizeText(category.name),
  );

  return (
    <>
      <TopBar />
      <Header />
      <CategoriesNav />

      <main className="flex-1 bg-zinc-50">
        <section className="mx-auto max-w-7xl px-5 py-12">
          <Link
            href="/catalogo"
            className="text-sm font-bold text-red-600 hover:text-red-700"
          >
            ← Volver al catálogo
          </Link>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-4xl">{category.emoji}</p>

              <h1 className="mt-3 text-4xl font-black tracking-tight text-zinc-900 sm:text-5xl">
                {category.name}
              </h1>

              <p className="mt-3 text-zinc-600">
                Productos disponibles en esta categoría.
              </p>
            </div>

            <p className="text-sm font-semibold text-zinc-500">
              {categoryProducts.length}{" "}
              {categoryProducts.length === 1 ? "producto" : "productos"}
            </p>
          </div>

          {categoryProducts.length > 0 ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center">
              <h2 className="text-xl font-bold text-zinc-900">
                Todavía no hay productos en esta categoría
              </h2>

              <p className="mt-2 text-zinc-600">
                Pronto vamos a cargar novedades.
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
