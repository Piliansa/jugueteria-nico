// lib/__tests__/whatsapp.test.ts
//
// Tests de la lógica de WhatsApp. Seguimos el patrón AAA que ya vimos
// con categorizar(): Arrange (preparo los datos), Act (llamo a la
// función), Assert (verifico el resultado).
//
// Para correr esto: npm install -D vitest   y después   npx vitest

import { describe, it, expect } from "vitest";
import {
  construirMensajeWhatsapp,
  construirUrlWhatsapp,
  obtenerLinkWhatsappProducto,
} from "../whatsapp";

describe("construirMensajeWhatsapp", () => {
  it("incluye el nombre del producto", () => {
    // Arrange
    const producto = { nombre: "Muñeca Cry Babies" };

    // Act
    const mensaje = construirMensajeWhatsapp(producto);

    // Assert
    expect(mensaje).toContain("Muñeca Cry Babies");
  });

  it("incluye el precio cuando el producto lo tiene", () => {
    const producto = { nombre: "Muñeca Cry Babies", precio: 15000 };

    const mensaje = construirMensajeWhatsapp(producto);

    expect(mensaje).toContain("$15000");
  });

  it("no rompe ni agrega 'undefined' cuando el producto no tiene precio", () => {
    const producto = { nombre: "Muñeca Cry Babies" };

    const mensaje = construirMensajeWhatsapp(producto);

    expect(mensaje).not.toContain("undefined");
    expect(mensaje).not.toContain("Precio");
  });

  it("incluye el link al producto cuando hay slug", () => {
    const producto = { nombre: "Muñeca Cry Babies", slug: "muneca-cry-babies" };

    const mensaje = construirMensajeWhatsapp(producto);

    expect(mensaje).toContain("https://jugueterianico.com/producto/muneca-cry-babies");
  });
});

describe("construirUrlWhatsapp", () => {
  it("arma una URL de wa.me con el número correcto", () => {
    const url = construirUrlWhatsapp("Hola!", "5493442000000");

    expect(url).toContain("https://wa.me/5493442000000");
  });

  it("codifica correctamente espacios y saltos de línea en el mensaje", () => {
    // Este caso es justo el tipo de bug que aparece si uno arma la URL
    // a mano con template strings sin encodeURIComponent: los espacios
    // rompen el link o quedan mal formados.
    const url = construirUrlWhatsapp("Hola, quería consultar\nprecio", "5493442000000");

    expect(url).not.toContain(" ");
    expect(url).not.toContain("\n");
    expect(url).toContain("text=");
  });
});

describe("obtenerLinkWhatsappProducto", () => {
  it("combina mensaje y número en un solo link usable", () => {
    const producto = { nombre: "Pelota N°5", precio: 5000, slug: "pelota-n5" };

    const link = obtenerLinkWhatsappProducto(producto, "5493442000000");

    expect(link.startsWith("https://wa.me/5493442000000?text=")).toBe(true);
    expect(decodeURIComponent(link)).toContain("Pelota N°5");
    expect(decodeURIComponent(link)).toContain("5000");
  });
});
