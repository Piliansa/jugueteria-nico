"use client";

// Botón de "Agregar al carrito". Se usa en la tarjeta o página de cada
// producto. Recibe el producto con la misma forma que ya tenés en Supabase.
//
// Ejemplo de uso:
//   <AddToCartButton producto={{ codigo: p.codigo, nombre: p.nombre, precio: p.precio }} />

import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ producto }) {
  const { agregarProducto } = useCart();
  const [agregado, setAgregado] = useState(false);

  function handleClick() {
    agregarProducto(producto, 1);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1500);
  }

  return (
    <button onClick={handleClick} className="boton-agregar-carrito">
      {agregado ? "¡Agregado! ✓" : "Agregar al carrito"}
    </button>
  );
}
