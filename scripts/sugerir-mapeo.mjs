// scripts/sugerir-mapeo.mjs
//
// Para las imágenes que match-images.mjs NO pudo emparejar solo, este script
// busca candidatos probables (comparando números y palabras del nombre del
// archivo contra el nombre de cada producto) y arma un Excel:
// scripts/revisar-imagenes.xlsx
//
// Vos abrís ese Excel, mirás la columna "Sugerencia" para cada foto, y en la
// columna "CodigoConfirmado" escribís el código correcto (podés copiar el
// sugerido si está bien, corregirlo si está mal, o dejarlo vacío / poner SKIP
// para descartar esa imagen). Después corrés aplicar-mapeo.mjs.
//
// Cómo usarlo: node scripts/sugerir-mapeo.mjs

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import xlsx from "xlsx";
import { fileURLToPath } from "node:url";

config({ path: ".env.local" });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.join(__dirname, "product-images");
const OUTPUT_PATH = path.join(__dirname, "revisar-imagenes.xlsx");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

function tokenizar(texto) {
  return texto
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 0);
}

function normalizarCompleto(texto) {
  return tokenizar(texto).join("");
}

async function main() {
  console.log("Trayendo productos de Supabase...");
  const { data: products, error } = await supabase
    .from("products")
    .select("codigo, nombre");

  if (error) {
    console.error("Error trayendo productos:", error.message);
    return;
  }

  const codigosValidos = new Set(products.map((p) => p.codigo.trim()));
  const productosConTokens = products.map((p) => ({
    codigo: p.codigo,
    nombre: p.nombre,
    tokens: tokenizar(p.nombre),
    completo: normalizarCompleto(p.nombre),
  }));

  const archivos = fs
    .readdirSync(IMAGES_DIR)
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));

  const filasReporte = [];
  let saltadosPorYaEmparejados = 0;

  for (const archivo of archivos) {
    const nombreBase = path.parse(archivo).name;

    // si ya se empareja solo (código exacto o nombre exacto), no hace falta sugerir nada
    if (codigosValidos.has(nombreBase.trim())) {
      saltadosPorYaEmparejados++;
      continue;
    }
    if (productosConTokens.some((p) => p.completo === normalizarCompleto(nombreBase))) {
      saltadosPorYaEmparejados++;
      continue;
    }

    const tokensArchivo = tokenizar(nombreBase);

    // puntaje: coincidencia de número vale más que coincidencia de palabra
    // (un número compartido es mucha más señal que una palabra común)
    let mejores = productosConTokens.map((p) => {
      let score = 0;
      for (const token of tokensArchivo) {
        if (!p.tokens.includes(token)) continue;
        score += /^\d+$/.test(token) ? 2 : 1;
      }
      return { ...p, score };
    });

    mejores = mejores.filter((p) => p.score > 0).sort((a, b) => b.score - a.score);

    const top3 = mejores.slice(0, 3);

    filasReporte.push({
      Archivo: archivo,
      Sugerencia_Codigo: top3[0]?.codigo ?? "",
      Sugerencia_Nombre: top3[0]?.nombre ?? "(sin candidatos, revisar a mano)",
      Otras_opciones: top3
        .slice(1)
        .map((p) => `${p.codigo} - ${p.nombre}`)
        .join(" | "),
      CodigoConfirmado: "", // <-- acá completás vos antes de correr aplicar-mapeo.mjs
    });
  }

  const hoja = xlsx.utils.json_to_sheet(filasReporte);
  const libro = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(libro, hoja, "Revisar");
  xlsx.writeFile(libro, OUTPUT_PATH);

  console.log(`${saltadosPorYaEmparejados} imágenes ya se emparejan solas, no necesitan revisión.`);
  console.log(`${filasReporte.length} imágenes con sugerencias generadas en:`);
  console.log(OUTPUT_PATH);
  console.log("\nAbrí ese Excel, revisá la columna Sugerencia_Codigo y completá CodigoConfirmado.");
}

main();
