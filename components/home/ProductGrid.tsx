import { products } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";

export default function ProductGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="mb-12 text-center text-5xl font-bold text-gray-900">
        Productos destacados
      </h2>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
