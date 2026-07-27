export type Product = {
  id: number;
  slug: string;
  nombre: string;
  marca: string;
  categoria: string;
  //subcategoria: string;
  descripcion: string;
  edad: string;
  precio: number;
  //imagenes: string[];
  destacado: boolean;
  enOferta?: boolean;
  stock: boolean;
  nuevo: boolean;
  //activo: boolean;
};
