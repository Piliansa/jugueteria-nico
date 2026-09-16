// scripts/generar-preview.mjs
//
// Lee scripts/revisar-imagenes.xlsx (con lo que ya completaste en
// CodigoConfirmado) y genera scripts/preview-imagenes.html: una página que
// podés abrir con doble click en el navegador para ver la miniatura de cada
// imagen junto al nombre REAL del producto (buscado en Supabase con el
// código que confirmaste, no la sugerencia original).
//
// Así detectás errores de tipeo o matches equivocados ANTES de subir nada.
// Habría que agregarle un botón para abrir la carpeta de imágenes desde el navegador, pero por ahora abrilo con el explorador de archivos y compará visualmente.
// También un buscador. Porque son muchos productos.
//
// Cómo usarlo: node scripts/generar-preview.mjs

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import xlsx from "xlsx";
import { fileURLToPath } from "node:url";

config({ path: ".env.local" });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MAPEO_PATH = path.join(__dirname, "revisar-imagenes.xlsx");
const OUTPUT_PATH = path.join(__dirname, "preview-imagenes.html");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

function escapeHtml(texto) {
  return texto.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
}

async function main() {
  if (!fs.existsSync(MAPEO_PATH)) {
    console.log(
      "No encontré revisar-imagenes.xlsx. Corré primero sugerir-mapeo.mjs.",
    );
    return;
  }

  const workbook = xlsx.readFile(MAPEO_PATH);
  const hoja = workbook.Sheets[workbook.SheetNames[0]];
  const filas = xlsx.utils.sheet_to_json(hoja, { defval: "" });

  const confirmadas = filas.filter((f) => {
    const codigo = f["CodigoConfirmado"]?.toString().trim();
    return codigo && codigo.toUpperCase() !== "SKIP";
  });

  console.log(
    `Buscando en Supabase los ${confirmadas.length} códigos confirmados...`,
  );
  const { data: products, error } = await supabase
    .from("products")
    .select("codigo, nombre");

  if (error) {
    console.error("Error trayendo productos:", error.message);
    return;
  }

  const nombrePorCodigo = new Map(
    products.map((p) => [p.codigo.trim(), p.nombre]),
  );

  const tarjetas = confirmadas
    .map((fila) => {
      const archivo = fila["Archivo"].toString().trim();
      const codigo = fila["CodigoConfirmado"].toString().trim();
      const nombreReal = nombrePorCodigo.get(codigo);
      const existe = Boolean(nombreReal);

      return `
        <div class="tarjeta ${existe ? "" : "error"}">
          <img src="product-images/${encodeURIComponent(archivo)}" alt="${escapeHtml(archivo)}" />
          <p class="archivo">${escapeHtml(archivo)}</p>
          <p class="codigo">Código: ${escapeHtml(codigo)}</p>
          <p class="nombre">${existe ? escapeHtml(nombreReal) : "⚠ CÓDIGO NO ENCONTRADO EN LA BASE"}</p>
        </div>`;
    })
    .join("\n");

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Vista previa de imágenes</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #f4f4f5; padding: 24px; }
    h1 { margin-bottom: 4px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-top: 20px; }
    .tarjeta { background: white; border-radius: 12px; padding: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
    .tarjeta img { width: 100%; height: 160px; object-fit: contain; background: #fafafa; border-radius: 8px; }
    .tarjeta.error { outline: 3px solid #dc2626; }
    .archivo { font-size: 11px; color: #888; margin: 6px 0 0; word-break: break-all; }
    .codigo { font-size: 12px; color: #555; margin: 2px 0; }
    .nombre { font-weight: 600; margin: 2px 0 0; }
  </style>
</head>
<body>
  <h1>Vista previa: ${confirmadas.length} imágenes confirmadas</h1>
  <p>Los recuadros en rojo tienen un código que no existe en la base — revisalos antes de subir.</p>
  <div class="grid">
    ${tarjetas}
  </div>
</body>
</html>`;

  fs.writeFileSync(OUTPUT_PATH, html, "utf-8");
  console.log(
    `Listo. Abrí este archivo con doble click en tu explorador de archivos:`,
  );
  console.log(OUTPUT_PATH);
}

main();
