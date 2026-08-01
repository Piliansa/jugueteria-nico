import { products } from "@/data/products";
import ProductShelf from "@/components/home/ProductShelf";

export default function NewProducts() {
  return (
    <ProductShelf
      eyebrow="Recien llegados"
      title="Novedades"
      products={products.filter((product) => product.nuevo)}
    />
  );
}

