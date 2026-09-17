"use client";

// Página del carrito. Guardala en tu proyecto como app/carrito/page.jsx.
//
// Necesita una variable de entorno con tu número de WhatsApp, en formato
// internacional sin espacios ni signos (ej: 5493442123456).
// Agregala en .env.local:
//   NEXT_PUBLIC_WHATSAPP_NUMERO=5493442123456

import { useCart } from "@/context/CartContext";

const NUMERO_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMERO;

function formatearPrecio(valor) {
  return valor.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
}

function armarMensajeWhatsApp(items, total) {
  const lineas = items.map(
    (item) =>
      `• ${item.cantidad} x ${item.nombre} (${formatearPrecio(item.precio)} c/u) = ${formatearPrecio(item.precio * item.cantidad)}`,
  );

  const mensaje = [
    "¡Hola! Quiero hacer este pedido:",
    "",
    ...lineas,
    "",
    `Total: ${formatearPrecio(total)}`,
    "",
    "Quedo atento/a para coordinar el pago y la entrega.",
  ].join("\n");

  return encodeURIComponent(mensaje);
}

export default function CarritoPage() {
  const { items, actualizarCantidad, quitarProducto, total, vaciarCarrito } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="carrito-vacio">
        <p>Tu carrito está vacío.</p>
      </div>
    );
  }

  const linkWhatsApp = `https://wa.me/${NUMERO_WHATSAPP}?text=${armarMensajeWhatsApp(items, total)}`;

  return (
    <div className="carrito">
      <h1>Tu carrito</h1>

      <ul className="carrito-lista">
        {items.map((item) => (
          <li key={item.codigo} className="carrito-item">
            <span className="carrito-item-nombre">{item.nombre}</span>
            <input
              type="number"
              min="1"
              value={item.cantidad}
              onChange={(e) =>
                actualizarCantidad(item.codigo, Number(e.target.value))
              }
              className="carrito-item-cantidad"
            />
            <span className="carrito-item-subtotal">
              {formatearPrecio(item.precio * item.cantidad)}
            </span>
            <button
              onClick={() => quitarProducto(item.codigo)}
              className="carrito-item-quitar"
            >
              Quitar
            </button>
          </li>
        ))}
      </ul>

      <p className="carrito-total">Total: {formatearPrecio(total)}</p>

      <a
        href={linkWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        className="boton-whatsapp"
      >
        Finalizar pedido por WhatsApp
      </a>

      <button onClick={vaciarCarrito} className="boton-vaciar">
        Vaciar carrito
      </button>
    </div>
  );
}
