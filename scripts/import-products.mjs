// scripts/import-products.mjs
//
// Lee el Excel exportado de Apollo GesCom y actualiza la tabla "products" en Supabase.
//
// Cómo lo corrés (cada vez que cambian precios/stock):
//   1) Exportá el Excel desde Apollo GesCom, guardalo como productos.xlsx en scripts/.
//   2) node scripts/import-products.mjs
//
// Instalación (una sola vez): npm install xlsx @supabase/supabase-js dotenv

import xlsx from "xlsx";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config({ path: ".env.local" });
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXCEL_PATH = path.join(__dirname, "productos.xlsx");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);
function limpiarClaves(row) {
  const limpio = {};
  for (const [key, value] of Object.entries(row)) {
    limpio[key.trim()] = value;
  }
  return limpio;
}

function normalizeSlugPart(text) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// "9 PISTAS 117   ***   " -> "9 Pistas 117"
function limpiarNombre(nombreCrudo) {
  return nombreCrudo
    .toString()
    .replace(/\*+/g, "") // saca los ***
    .trim()
    .replace(/\s+/g, " ") // colapsa espacios dobles
    .toLowerCase()
    .replace(/(^|\s)\S/g, (letra) => letra.toUpperCase()); // Título Case
}

function readExcelRows() {
  const workbook = xlsx.readFile(EXCEL_PATH);
  // el archivo tiene una fila de fecha/hora arriba antes del encabezado real,
  // por eso arrancamos a leer desde la fila 2 (index 1)
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  return xlsx.utils.sheet_to_json(firstSheet, { defval: "", range: 1 });
}

function mapRowToProduct(rowCrudo) {
  const row = limpiarClaves(rowCrudo);
  // filtro por las dudas: solo entran los que están habilitados (ML = "S")
  const valorML = (row["ML"] ?? "").toString().trim().toUpperCase();
  if (valorML !== "S") return null;

  const codigo = row["Código"]?.toString().trim();
  const nombreCrudo = row["Artículo"];
  if (!codigo || !nombreCrudo) return null;

  const nombre = limpiarNombre(nombreCrudo);

  return {
    codigo,
    nombre,
    slug: normalizeSlugPart(nombre) + "-" + normalizeSlugPart(codigo),
    marca: (row["Marca"] || "").toString().trim(),
    categoria: (row["Rubro"] || "Sin categoría").toString().trim(),
    descripcion: "", // Apollo no la trae; se completa a mano después para los que quieras destacar
    edad: "Consultar", // idem, se ajusta a mano cuando haga falta
    precio: Number(row["Final $"]) || 0,
    stock: Number(row["Existencia"]) || 0,
    codigo_barras: row["Cod. Barras"]
      ? row["Cod. Barras"].toString().trim()
      : null,
  };
}

async function main() {
  console.log("Leyendo Excel...");
  const rows = readExcelRows();
  console.log(`  ${rows.length} filas encontradas.`);

  const products = rows.map(mapRowToProduct).filter(Boolean);
  console.log(
    `  ${products.length} productos habilitados (ML = "S") para importar.`,
  );

  if (products.length === 0) {
    console.log(
      "No hay nada para importar. Encabezados detectados en la primera fila de datos:",
    );
    console.log(Object.keys(rows[0] ?? {}));
    console.log(
      "Valor de ML en las primeras 3 filas:",
      rows.slice(0, 3).map((r) => JSON.stringify(r["ML"])),
    );
    return;
  }

  const { data, error } = await supabase
    .from("products")
    .upsert(products, { onConflict: "codigo" })
    .select("codigo, nombre");

  if (error) {
    console.error("Error al importar:", error.message);
    process.exit(1);
  }

  console.log(
    `Listo. ${data.length} productos actualizados/creados en Supabase.`,
  );
}

main();
