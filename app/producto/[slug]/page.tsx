import type { Metadata } from "next";
import ProductDetail from "@/components/product/ProductDetail";
import { getProductBySlug } from "@/lib/products";

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
      <main className="mx-auto max-w-6xl p-10">
        <h1 className="text-4xl font-bold">Producto no encontrado</h1>
      </main>
    );
  }

  return <ProductDetail product={producto} />;
}
