import type { Product } from "@/types/Product";

// Datos temporales: reemplazalos por tu catalogo real o una fuente de base de datos.
export const products: Product[] = [
  {
    id: "monopoly",
    slug: "monopoly",
    nombre: "Monopoly",
    marca: "Hasbro",
    categoria: "Juegos de mesa",
    descripcion: "El clasico juego de compra y venta de propiedades para compartir en familia.",
    precio: 0,
    stock: 1,
    destacado: true,
    nuevo: false,
    enOferta: false,
  },
  {
    id: "rummy-burako",
    slug: "rummy-burako",
    nombre: "Rummy y Burako",
    marca: "Bisonte",
    categoria: "Juegos de mesa",
    descripcion: "Dos clasicos para disfrutar con amigos y familia.",
    precio: 0,
    stock: 1,
    destacado: true,
    nuevo: true,
    enOferta: false,
  },
  {
    id: "ajedrez",
    slug: "ajedrez",
    nombre: "Ajedrez",
    marca: "Plastigal",
    categoria: "Juegos de mesa",
    descripcion: "Juego de estrategia para desarrollar concentracion y pensamiento logico.",
    precio: 0,
    stock: 1,
    destacado: false,
    nuevo: true,
    enOferta: false,
  },
];
