// lib/precios.ts
//
// El precio que traemos de Apollo (product.precio) es el precio de contado.
// Apollo calcula el precio de lista aplicando un 15% de RECARGO sobre el
// precio de contado (no un 12% de descuento sobre el precio de lista, que
// era el supuesto inicial y no coincidía con los datos reales del sistema:
// 19.500 x 1.15 = 22.425, que es exactamente lo que muestra Apollo).
//
// A partir del precio de contado, calculamos el precio de lista para
// mostrar los dos precios en la web.
//
// Función pura (mismo input -> mismo output, sin tocar nada externo),
// así que es fácil de testear con Vitest.
 
export const RECARGO_LISTA = 0.15; // 15% de recargo sobre el precio de contado
 
/**
 * A partir del precio de contado, calcula el precio de lista
 * aplicando el recargo del 15% que usa Apollo.
 */
export function calcularPrecioLista(precioContado: number): number {
  return precioContado * (1 + RECARGO_LISTA);
}
 
export function formatearPrecio(precio: number): string {
  return precio.toLocaleString("es-AR", {
    maximumFractionDigits: 0,
  });
}
 
/**
 * Calcula el valor de cada cuota sin interés a partir del precio de lista.
 * Las cuotas sin interés se calculan sobre el precio de lista, no sobre
 * el precio de contado.
 */
export function calcularCuotaSinInteres(
  precioLista: number,
  cantidadCuotas: number = 3,
): number {
  return precioLista / cantidadCuotas;
}