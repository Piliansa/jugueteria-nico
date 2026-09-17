// lib/products.ts
//
// Capa de datos: reemplaza a data/products.ts. Trae los productos desde
// Supabase en vez de un array fijo escrito en el código.
//
// Importante: este archivo NO lo usa ninguno de los scripts de la carpeta
// scripts/ (ellos hablan directo con Supabase) — así que la limpieza del
// nombre de acá abajo es solo para lo que se MUESTRA en la web, y no afecta
// en absoluto al importador, al matching de imágenes ni a nada de eso.

import { createClient } from "@supabase/supabase-js";
import type { Product } from "@/types/Product";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const REVALIDATE_SECONDS = 300; // 5 minutos

type ProductRow = {
  codigo: string;
  slug: string;
  nombre: string;
  marca: string;
  categoria: string;
  categoria_tienda: string | null;
  descripcion: string;
  edad: string;
  precio: number;
  destacado: boolean;
  en_oferta: boolean;
  stock: number;
  nuevo: boolean;
  imagen: string | null;
  grupo_variante: string | null;
};

// Apollo suele agregar el código propio del fabricante como última palabra
// del nombre (ej: "Nerf Nanofire E0121", "9 Pistas 117"). Esta función lo
// detecta (una palabra final con letras/números/guiones, con al menos un
// número) y la saca, dejando el resto del nombre sin tocar.
function limpiarNombreParaMostrar(nombre: string): string {
  const palabras = nombre.trim().split(/\s+/);
  if (palabras.length <= 1) return nombre;

  const ultima = palabras[palabras.length - 1];
  const pareceCodigoDeFabricante =
    /^[A-Za-z0-9-]{2,12}$/.test(ultima) && /\d/.test(ultima);

  if (pareceCodigoDeFabricante) {
    return palabras.slice(0, -1).join(" ");
  }

  return nombre;
}

function toProduct(row: ProductRow, index: number): Product {
  return {
    id: index,
    codigo: row.codigo,
    slug: row.slug,
    imagen: row.imagen || "/products/placeholder.png",
    nombre: limpiarNombreParaMostrar(row.nombre),
    marca: row.marca,
    categoria: row.categoria,
    descripcion: row.descripcion,
    edad: row.edad || "Consultar",
    precio: row.precio,
    destacado: row.destacado,
    enOferta: row.en_oferta,
    stock: row.stock,
    nuevo: row.nuevo,
    grupoVariante: row.grupo_variante,
  };
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .gt("stock", 0)
    .order("nombre");

  if (error) {
    console.error("Error trayendo productos:", error.message);
    return [];
  }
  return data.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return toProduct(data, 0);
}

// "categoriaSlug" es el slug del menú (ej: "vehiculos"), no el Rubro de Apollo
export async function getProductsByCategory(
  categoriaSlug: string,
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("categoria_tienda", categoriaSlug)
    .gt("stock", 0)
    .order("nombre");

  if (error) {
    console.error("Error trayendo productos por categoría:", error.message);
    return [];
  }
  return data.map(toProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("destacado", true)
    .gt("stock", 0)
    .limit(8);

  if (error) return [];
  return data.map(toProduct);
}

export async function getNewProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("nuevo", true)
    .gt("stock", 0)
    .limit(8);
  if (error) return [];
  return data.map(toProduct);
}

export async function getProductVariants(
  grupoVariante: string,
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("grupo_variante", grupoVariante)
    .order("precio");

  if (error) return [];
  return data.map(toProduct);
}

export const revalidate = REVALIDATE_SECONDS;
