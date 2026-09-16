// scripts/import-products.mjs
//
// Lee el Excel exportado de Apollo GesCom y actualiza la tabla "products" en
// Supabase. Categoriza cada producto para el menú de la web en este orden:
//   1) Si el Rubro es LIBRERIA -> "Librería comercial", directo.
//   2) Si la marca es Ruibal o Implas (100% seguras, "solo" hacen esa
//      categoría) -> "Juegos de mesa", sin mirar nada más.
//   3) Buscamos palabras clave en el nombre del producto.
//   4) Si el nombre no dio ninguna pista, usamos la marca como respaldo
//      (ej: Dimare hace bloques Y sonajeros, así que su nombre manda primero;
//      la marca solo decide cuando el nombre no dice nada).
//   5) Si nada de lo anterior matchea, cae en "Juegos de mesa" por defecto.
//
// Cómo lo corrés (cada vez que cambian precios/stock):
//   1) Exportá el Excel desde Apollo GesCom, guardalo como productos.xlsx en scripts/.
//   2) node scripts/import-products.mjs
//
// Instalación (una sola vez): npm install xlsx @supabase/supabase-js dotenv

import xlsx from "xlsx";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

config({ path: ".env.local" });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXCEL_PATH = path.join(__dirname, "productos.xlsx");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// --- Categorización -----------------------------------------------------

// Marcas 100% seguras de una sola categoría, SIN excepciones. Se chequean
// ANTES que el nombre porque no hay ningún caso donde se equivoquen.
const MARCAS_ABSOLUTAS = {
  RUIBAL: "juegos-de-mesa",
  IMPLAS: "juegos-de-mesa", //a chequear 90% segura. Ideas de subcategorias: puzzles. A futuro.
  PLASTIGAL: "juegos-de-mesa",
  BONTUS: "juegos-de-mesa", //otra subcategoría: juegos-de-cartas
  "TOP TOYS": "juegos-de-mesa",
  TOYCO: "juegos-de-mesa",
  HABANO: "juegos-de-mesa", //puede entrar en arte
  YETEM: "juegos-de-mesa",
};

// Palabras clave en el nombre del producto. Se evalúa de arriba hacia abajo,
// gana la PRIMERA que coincida. Esto corre ANTES que las marcas de respaldo,
// porque hay marcas mixtas (ej: Dimare hace bloques y también sonajeros) y
// el nombre puntual del producto es más confiable que la marca en esos casos.
const REGLAS_CATEGORIA = [
  {
    slug: "vehiculos",
    palabras: [
      "auto",
      "moto",
      "camion",
      "camioneta",
      "tren",
      "avion",
      "barco",
      "pista",
      "carrera",
      "grua",
      "tractor",
    ],
  },
  {
    slug: "munecas",
    palabras: ["muneca", "bebota", "doll", "barbie"],
  },
  {
    slug: "bebes",
    palabras: [
      "bebe",
      "sonajero",
      "mordillo",
      "andador",
      "cuna",
      "mamadera",
      "chupete",
    ],
  },
  {
    slug: "construccion",
    palabras: [
      "bloques",
      "rasti",
      "ladrillo",
      "construccion",
      "encastre",
      "lego",
    ],
  },
  {
    slug: "arte",
    palabras: [
      "pintura",
      "plastilina",
      "manualidad",
      "dibujo",
      "crayon",
      "marcador",
      "masa",
    ],
  },
  {
    slug: "aire-libre",
    palabras: [
      "pelota",
      "bicicleta",
      "triciclo",
      "piscina",
      "arco",
      "patineta",
      "patines",
      "futbol",
      "sunca",
    ],
  },
  {
    slug: "juegos-de-mesa",
    palabras: [
      "ludo",
      "cartas",
      "ajedrez",
      "domino",
      "uno",
      "oca",
      "juego de mesa",
      "rompecabezas",
      "puzzle",
    ],
  },
];

// Marcas de respaldo: solo se usan si NINGUNA palabra clave del nombre
// matcheó. Sirven como "mejor apuesta" para esa marca en el caso general.
const MARCAS_RESPALDO = {
  DIMARE: "arte",
  ANTEX: "arte",
  DURAVIT: "vehiculos",
  "VEGHER PLAST": "vehiculos",
  "BRAVA KIDS": "aire-libre",
  RODALY: "aire-libre",
  MAPED: "libreria-comercial",
  HASBRO: "munecas",
  CAFFARO: "munecas",
  MATTEL: "munecas",
  "LIONELS ARGENTINA": "munecas",
  CALESITA: "bebes", // mayoría son juegos para menores de 4 años
};

const CATEGORIA_POR_DEFECTO = "juegos-de-mesa";

function normalizarParaBuscar(texto) {
  return texto
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function buscarMarcaEnDiccionario(marcaNormalizada, diccionario) {
  for (const [marcaConocida, categoria] of Object.entries(diccionario)) {
    if (marcaNormalizada === normalizarParaBuscar(marcaConocida)) {
      return categoria;
    }
  }
  return null;
}

function categorizar(nombre, rubro, marca) {
  const rubroNormalizado = normalizarParaBuscar(rubro || "");
  if (rubroNormalizado.includes("libreria")) {
    return "libreria-comercial";
  }

  const marcaNormalizada = normalizarParaBuscar(marca || "");

  const categoriaAbsoluta = buscarMarcaEnDiccionario(
    marcaNormalizada,
    MARCAS_ABSOLUTAS,
  );
  if (categoriaAbsoluta) return categoriaAbsoluta;

  const nombreNormalizado = normalizarParaBuscar(nombre);
  for (const regla of REGLAS_CATEGORIA) {
    if (regla.palabras.some((palabra) => nombreNormalizado.includes(palabra))) {
      return regla.slug;
    }
  }

  const categoriaRespaldo = buscarMarcaEnDiccionario(
    marcaNormalizada,
    MARCAS_RESPALDO,
  );
  if (categoriaRespaldo) return categoriaRespaldo;

  return CATEGORIA_POR_DEFECTO;
}
// -----------------------------------------------------------------------

function normalizeSlugPart(text) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function limpiarNombre(nombreCrudo) {
  return nombreCrudo
    .toString()
    .replace(/\*+/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/(^|\s)\S/g, (letra) => letra.toUpperCase());
}

function limpiarClaves(rowCrudo) {
  const limpio = {};
  for (const [key, value] of Object.entries(rowCrudo)) {
    limpio[key.trim()] = value;
  }
  return limpio;
}

function readExcelRows() {
  const workbook = xlsx.readFile(EXCEL_PATH);
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

  const filasCrudas = xlsx.utils.sheet_to_json(firstSheet, { header: 1 });
  const indiceEncabezado = filasCrudas.findIndex((fila) =>
    fila.some((celda) => celda?.toString().trim() === "Código"),
  );

  if (indiceEncabezado === -1) {
    throw new Error(
      'No encontré una fila con la columna "Código" en el Excel.',
    );
  }

  return xlsx.utils.sheet_to_json(firstSheet, {
    defval: "",
    range: indiceEncabezado,
  });
}

function mapRowToProduct(rowCrudo) {
  const row = limpiarClaves(rowCrudo);

  const valorML = (row["ML"] ?? "").toString().trim().toUpperCase();
  if (valorML !== "S") return null;

  const codigo = row["Código"]?.toString().trim();
  const nombreCrudo = row["Artículo"];
  if (!codigo || !nombreCrudo) return null;

  const nombre = limpiarNombre(nombreCrudo);
  const rubro = (row["Rubro"] || "Sin categoría").toString().trim();
  const marca = (row["Marca"] || "").toString().trim();

  return {
    codigo,
    nombre,
    slug: normalizeSlugPart(nombre) + "-" + normalizeSlugPart(codigo),
    marca,
    categoria: rubro,
    categoria_tienda: categorizar(nombre, rubro, marca),
    descripcion: "",
    edad: "Consultar",
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
