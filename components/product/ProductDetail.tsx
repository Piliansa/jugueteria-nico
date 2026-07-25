import type { Product } from "@/types/Product";

type ProductDetailProps = {
  product: Product;
};

export default function ProductDetail({ product }: ProductDetailProps) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Imagen */}
          <div className="rounded-2xl border bg-white p-8">
            <img
              src={product.imagen}
              alt={product.nombre}
              className="mx-auto h-96 object-contain"
            />
          </div>

          {/* Información */}
          <div className="flex flex-col justify-center">
            <p className="text-sm uppercase tracking-widest text-gray-500">
              {product.marca}
            </p>

            <h1 className="mt-2 text-5xl font-bold">{product.nombre}</h1>

            <p className="mt-4 text-lg text-gray-600">{product.categoria}</p>

            <p className="mt-2 text-gray-600">
              Edad recomendada: {product.edad}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
