// scripts/match-images.mjs
//
// Empareja imágenes de scripts/product-images/ con productos por código o
// nombre exacto, las estandariza (800x800, fondo blanco) y las sube a
// Supabase Storage. Lo que no matchea con confianza, lo lista para revisar
// a mano en vez de arriesgar una foto equivocada.
//
// Cómo usarlo: node scripts/match-images.mjs

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { estandarizarImagen } from "./procesar-imagen.mjs";

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
    .replace(/[^a-z0-9]/g, "");
}

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.log(`No encontré la carpeta ${IMAGES_DIR}`);
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

  const porNombre = new Map(
    products.map((p) => [normalizar(p.nombre), p.codigo]),
  );
  const codigosValidos = new Set(products.map((p) => p.codigo));

  const archivos = fs
    .readdirSync(IMAGES_DIR)
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));

  console.log(`${archivos.length} imágenes encontradas en la carpeta.\n`);

  const subidas = [];
  const sinCoincidencia = [];

  for (const archivo of archivos) {
    const nombreBase = path.parse(archivo).name;
    let codigo = null;

    if (codigosValidos.has(nombreBase.trim())) {
      codigo = nombreBase.trim();
    } else {
      const posible = porNombre.get(normalizar(nombreBase));
      if (posible) codigo = posible;
    }

    if (!codigo) {
      sinCoincidencia.push(archivo);
      continue;
    }

    try {
      const buffer = fs.readFileSync(path.join(IMAGES_DIR, archivo));
      const jpgBuffer = await estandarizarImagen(buffer);
      const rutaEnStorage = `${codigo}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(rutaEnStorage, jpgBuffer, {
          contentType: "image/jpeg",
          upsert: true,
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

  console.log(
    `\n${subidas.length} imágenes emparejadas y subidas correctamente.`,
  );

  if (sinCoincidencia.length > 0) {
    console.log(
      `\n${sinCoincidencia.length} imágenes SIN coincidencia (revisar a mano):`,
    );
    sinCoincidencia.forEach((f) => console.log(`  - ${f}`));
  }
}

main();
