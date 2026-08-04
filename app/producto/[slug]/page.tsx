import type { Metadata } from "next";
import ProductDetail from "@/components/product/ProductDetail";
import { products } from "@/data/products";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return { title: "${product.cateroria} " };
  }

  const title = `${product.nombre} | Juguetería Nico`;
  const description = `${product.nombre} de ${product.marca}. $${product.precio}. Comprá en Concepción del Uruguay o consultá por el envío a tu localidad.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [product.imagen], // así se ve la foto al compartir el link
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const producto = products.find((p) => p.slug === slug);

  if (!producto) {
    return (
      <main className="mx-auto max-w-6xl p-10">
        <h1 className="text-4xl font-bold">Producto no encontrado</h1>
      </main>
    );
  }

  return <ProductDetail product={producto} />;
}
