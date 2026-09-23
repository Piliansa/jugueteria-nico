import type { Metadata } from "next";
import Link from "next/link";
import ProductDetail from "@/components/product/ProductDetail";
import ProductCard from "@/components/product/ProductCard";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import CategoriesNav from "@/components/layout/CategoriesNav";
import Footer from "@/components/layout/Footer";
import { getProductBySlug, getProductsByCategory } from "@/lib/products";

export const revalidate = 300;

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Producto no encontrado | Juguetería Nico" };
  }

  const title = `${product.nombre} | Juguetería Nico`;
  const description = `${product.nombre} de ${product.marca}. $${product.precio}. Comprá en Concepción del Uruguay o consultá por el envío a tu localidad.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [product.imagen],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const producto = await getProductBySlug(slug);

  if (!producto) {
    return (
      <>
        <TopBar />
        <Header />
        <CategoriesNav />
        <main className="mx-auto max-w-6xl p-10">
          <h1 className="text-4xl font-bold">Producto no encontrado</h1>
          <Link
            href="/catalogo"
            className="mt-4 inline-block text-red-600 font-bold"
          >
            ← Volver al catálogo
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  // productos recomendados: misma categoría, sin incluir el que ya estás mirando
  const relacionados = producto.categoriaTienda
    ? (await getProductsByCategory(producto.categoriaTienda))
        .filter((p) => p.slug !== producto.slug)
        .slice(0, 4)
    : [];

  return (
    <>
      <TopBar />
      <Header />
      <CategoriesNav />

      <main className="flex-1 bg-zinc-50 dark:bg-zinc-900">
        <ProductDetail product={producto} />

        {relacionados.length > 0 && (
          <section className="mx-auto max-w-6xl px-6 pb-16">
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
              También te puede interesar
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relacionados.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
