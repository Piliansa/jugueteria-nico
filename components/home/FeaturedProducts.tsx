import { getFeaturedProducts } from "@/lib/products";
import ProductShelf from "@/components/home/ProductShelf";

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return (
    <ProductShelf
      eyebrow="Elegidos para vos"
      title="Productos destacados"
      products={products}
    />
  );
}
