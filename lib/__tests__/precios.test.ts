import { describe, it, expect } from "vitest";
import {
  calcularPrecioLista,
  formatearPrecio,
  calcularCuotaSinInteres,
} from "../precios";

describe("calcularPrecioLista", () => {
  it("calcula el precio de lista a partir del precio de contado (12% off)", () => {
    // Arrange: si el precio de lista fuera $10.000 y el descuento es 12%,
    // el precio de contado sería $8.800.
    const precioContado = 8800;

    // Act
    const precioLista = calcularPrecioLista(precioContado);

    // Assert
    expect(precioLista).toBeCloseTo(10000, 0);
  });

  it("con precio 0 devuelve 0 (no rompe con productos sin precio cargado)", () => {
    expect(calcularPrecioLista(0)).toBe(0);
  });

  it("el precio de lista siempre es mayor al de contado cuando el precio es positivo", () => {
    const precioContado = 5000;

    const precioLista = calcularPrecioLista(precioContado);

    expect(precioLista).toBeGreaterThan(precioContado);
  });
});

describe("formatearPrecio", () => {
  it("formatea con separador de miles en formato argentino", () => {
    expect(formatearPrecio(15000)).toBe("15.000");
  });
});

describe("calcularCuotaSinInteres", () => {
  it("divide el precio de lista en 3 cuotas por default", () => {
    const cuota = calcularCuotaSinInteres(9000);

    expect(cuota).toBe(3000);
  });

  it("permite calcular con otra cantidad de cuotas", () => {
    const cuota = calcularCuotaSinInteres(10000, 5);

    expect(cuota).toBe(2000);
  });
});
