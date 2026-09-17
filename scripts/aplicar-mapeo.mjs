// scripts/aplicar-mapeo.mjs
//
// Lee scripts/revisar-imagenes.xlsx (con la columna CodigoConfirmado ya
// completada) y sube cada imagen confirmada a Supabase Storage, ya
// estandarizada a 800x800 con fondo blanco.
//
// Cómo usarlo: node scripts/aplicar-mapeo.mjs

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import xlsx from "xlsx";
import { fileURLToPath } from "node:url";
import { estandarizarImagen } from "./procesar-imagen.mjs";

config({ path: ".env.local" });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.join(__dirname, "product-images");
const MAPEO_PATH = path.join(__dirname, "revisar-imagenes.xlsx");
const BUCKET = "products";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

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

  let subidas = 0;
  let saltadas = 0;

  for (const fila of filas) {
    const archivo = fila["Archivo"]?.toString().trim();
    const codigo = fila["CodigoConfirmado"]?.toString().trim();

    if (!archivo || !codigo || codigo.toUpperCase() === "SKIP") {
      saltadas++;
      continue;
    }

    const rutaLocal = path.join(IMAGES_DIR, archivo);
    if (!fs.existsSync(rutaLocal)) {
      console.log(`✗ No encontré el archivo ${archivo} en product-images/`);
      continue;
    }

    try {
      const buffer = fs.readFileSync(rutaLocal);
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

      console.log(`✓ ${archivo} -> código ${codigo}`);
      subidas++;
    } catch (err) {
      console.log(`✗ Error con ${archivo}: ${err.message}`);
    }
  }

  console.log(
    `\n${subidas} imágenes subidas. ${saltadas} filas sin confirmar (se ignoraron).`,
  );
}

main();
