// components/product/ProductCard.tsx
import type { Product } from "@/types/Product";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const whatsappMessage = encodeURIComponent(
    `Hola! Quisiera consultar por el producto ${product.nombre}.`,
  );
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${whatsappMessage}`;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900">
      {/* capa invisible: hace clickeable toda la card para ir al producto */}
      <Link
        href={`/producto/${product.slug}`}
        aria-label={`Ver ${product.nombre}`}
        className="absolute inset-0 z-10"
      />

      <div className="flex h-72 items-center justify-center overflow-hidden rounded-xl bg-gray-50 dark:bg-zinc-800">
        <Image
          src={product.imagen}
          alt={product.nombre}
          width={350}
          height={350}
          className="max-h-64 w-auto object-contain transition duration-300 group-hover:scale-105"
        />
      </div>

      {/* botón de WhatsApp: aparece con el hover, por encima de la capa invisible (z-20 > z-10) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-4 top-4 z-20 rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white opacity-100 shadow-lg transition-all duration-300 hover:bg-green-700 sm:opacity-0 sm:group-hover:opacity-100"
      >
        Consultar
      </a>

      <div className="space-y-3 p-6">
        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">
          {product.marca}
        </p>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {product.nombre}
        </h3>
        <p className="text-gray-600 dark:text-zinc-300">{product.categoria}</p>
        <p className="text-sm text-gray-400 dark:text-zinc-500">
          Edad: {product.edad}
        </p>

        {product.precio > 0 ? (
          <p className="pt-2 text-2xl font-bold text-red-600 dark:text-red-400">
            ${product.precio.toLocaleString("es-AR")}
          </p>
        ) : (
          <p className="pt-3 text-3xl font-bold text-red-600 dark:text-red-400">
            Consultar precio
          </p>
        )}

        <p className="mt-4 font-semibold text-red-600 dark:text-red-400">
          Ver producto
        </p>
      </div>
    </div>
  );
}
