import ProductDetail from "@/components/product/ProductDetail";
import { products } from "@/data/products";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

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

