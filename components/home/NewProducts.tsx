import { getNewProducts } from "@/lib/products";
import ProductShelf from "@/components/home/ProductShelf";

export default async function NewProducts() {
  const products = await getNewProducts();

  return (
    <ProductShelf
      eyebrow="Recien llegados"
      title="Novedades"
      products={products}
    />
  );
}
