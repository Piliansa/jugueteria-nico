export type Product = {
  id: number;
  codigo: string;
  slug: string;
  imagen: string;
  nombre: string;
  marca: string;
  categoria: string;
  descripcion: string;
  edad: string;
  precio: number;
  destacado: boolean;
  enOferta?: boolean;
  stock: number;
  nuevo: boolean;
};
