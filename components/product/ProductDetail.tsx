import Image from "next/image";
import type { Product } from "@/types/Product";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import Badge from "@/components/common/Badge";
import Attribute from "@/components/common/Attribute";
import Breadcrumb from "@/components/common/Breadcrumb";
import { categories } from "@/data/categories";

type ProductDetailProps = {
  product: Product;
};

export default function ProductDetail({ product }: ProductDetailProps) {
  const categoria = categories.find(
    (item) => item.slug === product.categoriaTienda,
  );

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/" },
            ...(categoria
              ? [
                  {
                    label: categoria.name,
                    href: `/categoria/${categoria.slug}`,
                  },
                ]
              : [{ label: "Catálogo", href: "/catalogo" }]),
            { label: product.nombre },
          ]}
        />

        <div className="grid items-start gap-16 md:grid-cols-2">
          {/* Imagen */}
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-lg">
            <Image
              src={product.imagen}
              alt={product.nombre}
              width={450}
              height={450}
              className="mx-auto h-80 w-auto object-contain"
            />
          </div>

          {/* Información */}
          <div className="flex flex-col justify-start pt-4">
            {/* Badges */}
            <div className="mb-5 flex flex-wrap gap-2">
              {product.nuevo && <Badge variant="new">Nuevo</Badge>}

              {product.destacado && <Badge variant="featured">Destacado</Badge>}

              {product.enOferta && <Badge variant="sale">Oferta</Badge>}
            </div>

            {/* Marca */}
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              {product.marca}
            </p>

            {/* Nombre */}
            <h1 className="mt-2 text-5xl font-bold text-gray-900  dark:text-zinc-500">
              {product.nombre}
            </h1>

            {/* Precio */}
            {product.precio > 0 ? (
              <div className="mt-6">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-4xl font-bold text-gray-900 dark:text-zinc-500">
                    ${product.precio.toLocaleString("es-AR")}
                  </p>
                  <span className="rounded-md bg-green-600 px-2 py-1 text-sm font-bold text-white">
                    12% OFF pagando en efectivo
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
                  Precio de lista $
                  {product.precioLista?.toLocaleString("es-AR", {
                    maximumFractionDigits: 0,
                  })}
                  {" · "}3 cuotas sin interés de $
                  {product.cuota3?.toLocaleString("es-AR", {
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            ) : (
              <p className="mt-6 text-3xl font-bold text-red-600">
                Consultar precio
              </p>
            )}

            {/* Descripción */}
            <p className="mt-8 leading-8 text-gray-600  dark:text-zinc-500">
              {product.descripcion}
            </p>

            {/* Características */}
            <div className="mt-10 grid grid-cols-2 gap-y-6 border-t border-gray-200  dark:text-zinc-600 pt-8 ">
              <Attribute label="Marca" value={product.marca} />

              <Attribute label="Categoría" value={product.categoria} />

              <Attribute label="Edad" value={product.edad} />

              <Attribute
                label="Stock"
                value={<span className="text-green-600">Disponible</span>}
              />
            </div>

            {/* Botón */}
            <div className="mt-10">
              <WhatsAppButton productName={product.nombre} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
