import type { Product } from "@/types/Product";

export const products: Product[] = [
  {
    id: 1,
    slug: "monopoly",
    nombre: "Monopoly",
    marca: "Hasbro",
    categoria: "Juegos de mesa",
    descripcion: "Juego de mesa clÃ¡sico para toda la familia.",
    edad: "8+",
    precio: 0,
    destacado: true,
    stock: 1,
    nuevo: false,
  },

  {
    id: 2,
    slug: "rummy-burako",
    nombre: "Rummy & Burako",
    marca: "Bisonte",
    categoria: "Juegos de mesa",
    descripcion: "Juego de mesa para 2 a 4 jugadores.",
    edad: "8+",
    precio: 0,
    destacado: true,
    stock: 1,
    nuevo: true,
  },

  {
    id: 3,
    slug: "ajedrez",
    nombre: "Ajedrez",
    marca: "Plastigal",
    categoria: "Juegos de mesa",
    descripcion: "Juego de mesa clÃ¡sico para toda la familia.",
    edad: "4+",
    precio: 0,
    destacado: true,
    stock: 1,
    nuevo: false,
  },

  {
    id: 4,
    slug: "crazy-ice",
    nombre: "Crazy Ice",
    marca: "Faydi",
    categoria: "Juegos de mesa",
    descripcion: "Juego de mesa para 2 a 4 jugadores.",
    edad: "4+",
    precio: 0,
    destacado: false,
    enOferta: false,
    stock: 1,
    nuevo: false,
  },
];

