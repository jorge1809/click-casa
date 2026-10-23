export interface Producto {
  id: number;
  nombre: string;
  marca: string;
  modelo?: string;
  descripcion: string;
  categoriaId: number;
  precioUSD: number;
  imagen: string;
  galeria: string[];
  disponible: boolean;
  destacado?: boolean;
  especificaciones?: Record<string, string>;
}
