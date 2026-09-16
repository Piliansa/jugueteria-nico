// scripts/procesar-imagen.mjs
//
// Función compartida por match-images.mjs y aplicar-mapeo.mjs. Toma
// cualquier imagen (de cualquier tamaño o proporción, buscada en internet o
// fotografiada por vos) y la deja siempre igual: un cuadrado de 800x800px
// con fondo blanco, en formato .jpg liviano para web. Así el catálogo se ve
// prolijo y uniforme sin que tengas que editar nada a mano.

import sharp from "sharp";

const TAMANO = 800;
const CALIDAD_JPG = 82;

export async function estandarizarImagen(buffer) {
  return sharp(buffer)
    .resize(TAMANO, TAMANO, {
      fit: "contain", // achica/agranda manteniendo proporciones, sin deformar
      background: { r: 255, g: 255, b: 255, alpha: 1 }, // rellena el sobrante con blanco
    })
    .flatten({ background: "#ffffff" }) // por si la imagen tenía fondo transparente (PNG)
    .jpeg({ quality: CALIDAD_JPG })
    .toBuffer();
}
