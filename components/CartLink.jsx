"use client";

// Ícono de carrito para el header. Muestra la cantidad total de productos
// (sumando cantidades, no solo productos distintos) y lleva a /carrito.
//
// Ejemplo de uso, dentro de tu Header/Nav:
//   import CartLink from "@/components/CartLink";
//   ...
//   <CartLink />

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartLink() {
  const { itemCount } = useCart();

  return (
    <Link href="/carrito" className="carrito-link">
      🛒
      {itemCount > 0 && <span className="carrito-badge">{itemCount}</span>}
    </Link>
  );
}
