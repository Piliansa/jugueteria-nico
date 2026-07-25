import type { Product } from "@/types/Product";

export const products: Product[] = [
  {
    id: 1,
    slug: "monopoly",
    nombre: "Monopoly",
    marca: "Hasbro",
    categoria: "Juegos de mesa",
    edad: "8+",
    precio: 0,
    imagen: "/products/monopoly.jpeg",
    destacado: true,
    stock: true,
    nuevo: false,
  },

  {
    id: 2,
    slug: "rummy-burako",
    nombre: "Rummy & Burako",
    marca: "Bisonte",
    categoria: "Juegos de mesa",
    edad: "8+",
    precio: 0,
    imagen: "/products/burako.jpeg",
    destacado: true,
    stock: true,
    nuevo: true,
  },

  {
    id: 3,
    slug: "ajedrez",
    nombre: "Ajedrez",
    marca: "Plastigal",
    categoria: "Juegos de mesa",
    edad: "4+",
    precio: 0,
    imagen: "/products/ajedrez.jpeg",
    destacado: true,
    stock: true,
    nuevo: false,
  },

  {
    id: 4,
    slug: "crazy-ice",
    nombre: "Crazy Ice",
    marca: "Faydi",
    categoria: "Juegos de mesa",
    edad: "4+",
    precio: 0,
    imagen: "/products/pinguinos.jpeg",
    destacado: false,
    stock: true,
    nuevo: false,
  },
];
