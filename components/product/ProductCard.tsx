import type { Product } from "@/types/Product";
import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/producto/${product.slug}`}
      className="block overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="flex h-72 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
        <Image
          src={product.imagen}
          alt={product.nombre}
          width={350}
          height={350}
          className="max-h-64 w-auto object-contain transition duration-300 hover:scale-105"
        />
      </div>

      <div className="space-y-3 p-6">
        <p className="text-sm font-medium text-gray-500">{product.marca}</p>
        <h3 className="text-xl font-bold text-gray-900">{product.nombre}</h3>

        <p className="text-gray-600">{product.categoria}</p>

        <p className="text-sm text-gray-400">Edad: {product.edad}</p>

        {product.precio > 0 ? (
          <p className="pt-2 text-2xl font-bold text-red-600">
            ${product.precio.toLocaleString("es-AR")}
          </p>
        ) : (
          <p className="pt-3 text-3xl font-bold text-red-600">
            Consultar precio
          </p>
        )}

        <button className="mt-4 w-full rounded-xl bg-green-500 py-3 font-semibold text-white transition hover:bg-green-600">
          Consultar por WhatsApp
        </button>
      </div>
    </Link>
  );
}
