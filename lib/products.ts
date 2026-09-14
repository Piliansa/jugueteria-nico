// lib/products.ts
//
// Capa de datos: reemplaza a data/products.ts. Trae los productos desde
// Supabase en vez de un array fijo escrito en el código.

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

function toProduct(row: ProductRow, index: number): Product {
  return {
    id: index,
    codigo: row.codigo,
    slug: row.slug,
    imagen: row.imagen || "/products/placeholder.png",
    nombre: row.nombre,
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
  // sin filtro de stock a propósito: si alguien ya tenía el link guardado,
  // mejor mostrarle la página con aviso de "sin stock" que un 404
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return toProduct(data, 0);
}

export async function getProductsByCategory(
  categoria: string,
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .ilike("categoria", categoria)
    .gt("stock", 0)
    .order("nombre");

  if (error) return [];
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

export const revalidate = REVALIDATE_SECONDS;
