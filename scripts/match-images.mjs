// scripts/match-images.mjs
//
// Qué hace:
//   1) Mira todas las imágenes que pusiste en scripts/product-images/
//   2) Busca a qué producto corresponde cada una (por código o por nombre)
//   3) Las que emparejó con confianza: las convierte a .jpg y las sube a
//      Supabase Storage, y actualiza el campo "imagen" del producto.
//   4) Las que NO pudo emparejar con confianza: las lista al final para que
//      las revises vos a mano (nunca "adivina" para evitar poner la foto
//      de un producto en otro).
//
// Cómo usarlo:
//   1) Poné todas tus imágenes (las que tengan código o nombre en el archivo)
//      dentro de la carpeta scripts/product-images/
//   2) node scripts/match-images.mjs

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { fileURLToPath } from "node:url";

config({ path: ".env.local" });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.join(__dirname, "product-images");
const BUCKET = "products";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

function normalizar(texto) {
  return texto
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ""); // saca espacios, guiones, todo lo que no sea letra/número
}

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.log(`No encontré la carpeta ${IMAGES_DIR}`);
    console.log("Creala y poné ahí tus imágenes antes de correr este script.");
    return;
  }

  console.log("Trayendo productos de Supabase...");
  const { data: products, error } = await supabase
    .from("products")
    .select("codigo, nombre");

  if (error) {
    console.error("Error trayendo productos:", error.message);
    return;
  }

  // preparamos un diccionario para buscar por nombre normalizado
  const porNombre = new Map();
  for (const p of products) {
    porNombre.set(normalizar(p.nombre), p.codigo);
  }
  const codigosValidos = new Set(products.map((p) => p.codigo));

  const archivos = fs
    .readdirSync(IMAGES_DIR)
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));

  console.log(`${archivos.length} imágenes encontradas en la carpeta.\n`);

  const subidas = [];
  const sinCoincidencia = [];

  for (const archivo of archivos) {
    const nombreBase = path.parse(archivo).name; // sin extensión
    let codigo = null;

    // intento 1: el nombre del archivo ES un código válido
    if (codigosValidos.has(nombreBase.trim())) {
      codigo = nombreBase.trim();
    } else {
      // intento 2: coincide con el nombre normalizado de algún producto
      const posible = porNombre.get(normalizar(nombreBase));
      if (posible) codigo = posible;
    }

    if (!codigo) {
      sinCoincidencia.push(archivo);
      continue;
    }

    try {
      const buffer = fs.readFileSync(path.join(IMAGES_DIR, archivo));
      const jpgBuffer = await sharp(buffer).jpeg({ quality: 82 }).toBuffer();
      const rutaEnStorage = `${codigo}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(rutaEnStorage, jpgBuffer, {
          contentType: "image/jpeg",
          upsert: true, // si ya existía una imagen para ese código, la reemplaza
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(rutaEnStorage);

      const { error: updateError } = await supabase
        .from("products")
        .update({ imagen: publicUrlData.publicUrl })
        .eq("codigo", codigo);

      if (updateError) throw updateError;

      subidas.push(`${archivo} -> producto ${codigo}`);
      console.log(`✓ ${archivo} -> código ${codigo}`);
    } catch (err) {
      console.log(`✗ Error subiendo ${archivo}: ${err.message}`);
    }
  }

  console.log(`\n${subidas.length} imágenes emparejadas y subidas correctamente.`);

  if (sinCoincidencia.length > 0) {
    console.log(`\n${sinCoincidencia.length} imágenes SIN coincidencia (revisar a mano):`);
    sinCoincidencia.forEach((f) => console.log(`  - ${f}`));
    console.log(
      "\nSugerencia: renombralas con el código exacto del producto y volvé a correr el script.",
    );
  }
}

main();
