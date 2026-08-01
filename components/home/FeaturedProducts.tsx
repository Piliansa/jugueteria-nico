import { products } from "@/data/products";
import ProductShelf from "@/components/home/ProductShelf";

export default function FeaturedProducts() {
  return (
    <ProductShelf
      eyebrow="Elegidos para vos"
      title="Productos destacados"
      products={products.filter((product) => product.destacado)}
    />
  );
}

