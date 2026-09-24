// lib/whatsapp.ts
//
// Función pura para construir el mensaje y el link de WhatsApp.
// Antes esta lógica estaba duplicada en WhatsAppButton.tsx y en
// ProductCard.tsx, cada uno armando su propio texto y su propia URL.
//
// La movemos acá por dos razones:
// 1. DRY: un solo lugar donde vive la lógica de "cómo armamos el mensaje".
//    Si mañana cambia el formato del mensaje, se edita en un solo archivo.
// 2. Testeable: es una función pura (mismo input -> mismo output, sin
//    tocar el DOM, sin fetch, sin nada externo), así que se puede probar
//    con Vitest sin necesidad de renderizar ningún componente.
//
// Lo que SÍ se puede testear acá: que el texto y la URL se arman bien.

export interface ProductoParaWhatsapp {
  nombre: string;
  precio?: number | null;
  slug?: string;
}

const NUMERO_WHATSAPP_DEFAULT = "5493442000000"; // TODO: reemplazar por el número real desde siteConfig

/**
 * Arma el texto del mensaje que se va a enviar por WhatsApp
 * para consultar por un producto puntual.
 */
export function construirMensajeWhatsapp(
  producto: ProductoParaWhatsapp,
): string {
  const partes = [
    `Hola! Quería consultar por este producto: ${producto.nombre}`,
  ];

  if (typeof producto.precio === "number") {
    partes.push(`Precio: $${producto.precio}`);
  }

  if (producto.slug) {
    partes.push(`https://jugueterianico.com/producto/${producto.slug}`);
  }

  return partes.join("\n");
}

/**
 * Arma la URL final de wa.me a partir de un número y un mensaje.
 * Separada de construirMensajeWhatsapp para poder testear cada
 * responsabilidad por separado (armar texto vs armar URL).
 */
export function construirUrlWhatsapp(
  mensaje: string,
  numero: string = NUMERO_WHATSAPP_DEFAULT,
): string {
  const mensajeCodificado = encodeURIComponent(mensaje);
  return `https://wa.me/${numero}?text=${mensajeCodificado}`;
}

/**
 * Atajo que combina las dos funciones de arriba: recibe un producto
 * y devuelve directamente el link de WhatsApp listo para usar en un <a href>.
 */
export function obtenerLinkWhatsappProducto(
  producto: ProductoParaWhatsapp,
  numero: string = NUMERO_WHATSAPP_DEFAULT,
): string {
  const mensaje = construirMensajeWhatsapp(producto);
  return construirUrlWhatsapp(mensaje, numero);
}
