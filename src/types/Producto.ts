export interface Producto {
  id: number;
  nombre: string;
  marca: string;
  modelo?: string;
  descripcion: string;
  categoriaId: number;
  imagen: string;
  galeria: string[];
  disponible: boolean | null;
  destacado?: boolean;
  especificaciones?: Record<string, string>;
}
