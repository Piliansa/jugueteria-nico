// lib/precios.ts
//
// El precio que traemos de Apollo (product.precio) ya viene con el 12% de
// descuento por pago en efectivo aplicado. A partir de ese valor, calculamos
// el precio de lista original para mostrar los dos precios en la web.
//
// Función pura (mismo input -> mismo output, sin tocar nada externo),
// así que es fácil de testear con Vitest.

export const DESCUENTO_CONTADO = 0.12; // 12% off por pago en efectivo

/**
 * A partir del precio de contado (el que ya tiene el descuento aplicado),
 * calcula cuál era el precio de lista original.
 */
export function calcularPrecioLista(precioContado: number): number {
  return precioContado / (1 - DESCUENTO_CONTADO);
}

export function formatearPrecio(precio: number): string {
  return precio.toLocaleString("es-AR", {
    maximumFractionDigits: 0,
  });
}

/**
 * Calcula el valor de cada cuota sin interés a partir del precio de lista.
 * Las cuotas sin interés se calculan sobre el precio de lista, no sobre
 * el precio de contado (que ya tiene el descuento del 12% aplicado).
 */
export function calcularCuotaSinInteres(
  precioLista: number,
  cantidadCuotas: number = 3,
): number {
  return precioLista / cantidadCuotas;
}
