"use client";

// Contexto del carrito de compras. Guarda los productos elegidos en
// localStorage para que no se pierdan si el cliente cierra la pestaña o
// recarga la página.
//
// Cómo usarlo:
//   1) Envolvé tu layout con <CartProvider> (ver instrucciones al final).
//   2) En cualquier componente: const { items, agregarProducto, total } = useCart();

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "carrito-jugueteria-nico";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [cargado, setCargado] = useState(false);

  // Al montar el componente, leemos lo que haya guardado de una visita anterior.
  useEffect(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      if (guardado) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(JSON.parse(guardado));
      }
    } catch (error) {
      console.error("No se pudo leer el carrito guardado:", error);
    } finally {
      setCargado(true);
    }
  }, []);

  // Cada vez que cambia el carrito, lo guardamos. El chequeo de "cargado"
  // evita que, en el primer render, pisemos lo guardado con un array vacío
  // antes de que termine de leerse.
  useEffect(() => {
    if (!cargado) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("No se pudo guardar el carrito:", error);
    }
  }, [items, cargado]);

  function agregarProducto(producto, cantidad = 1) {
    setItems((prev) => {
      const existente = prev.find((item) => item.codigo === producto.codigo);
      if (existente) {
        return prev.map((item) =>
          item.codigo === producto.codigo
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item,
        );
      }
      return [
        ...prev,
        {
          codigo: producto.codigo,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad,
        },
      ];
    });
  }

  function quitarProducto(codigo) {
    setItems((prev) => prev.filter((item) => item.codigo !== codigo));
  }

  function actualizarCantidad(codigo, cantidad) {
    if (cantidad <= 0) {
      quitarProducto(codigo);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.codigo === codigo ? { ...item, cantidad } : item,
      ),
    );
  }

  function vaciarCarrito() {
    setItems([]);
  }

  const total = items.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );
  const cantidadTotal = items.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        agregarProducto,
        quitarProducto,
        actualizarCantidad,
        vaciarCarrito,
        total,
        cantidadTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart tiene que usarse dentro de un <CartProvider>");
  }
  return context;
}
