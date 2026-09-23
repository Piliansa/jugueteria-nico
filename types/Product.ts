export type Product = {
  id: number;
  codigo: string;
  slug: string;
  imagen: string;
  nombre: string;
  marca: string;
  categoria: string;
  categoriaTienda?: string | null; // slug de la categoría de menú (ej: "vehiculos")
  descripcion: string;
  edad: string;
  precio: number;
  destacado: boolean;
  enOferta?: boolean;
  stock: number;
  nuevo: boolean;
  grupoVariante?: string | null;
};
