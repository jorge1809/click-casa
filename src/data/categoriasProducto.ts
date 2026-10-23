import { imagenProducto } from "../utils/imagenProducto";
import type { CategoriaProducto } from "../types/CategoriaProducto";

const categorias = [
  [1, "Refrigeradoras", "refrigeradoras"],
  [2, "Lavadoras", "lavadoras"],
  [3, "Smart TV", "smart-tv"],
  [4, "Cocinas", "cocinas"],
  [5, "Aires acondicionados", "aires-acondicionados"],
  [6, "Freezer", "freezer"],
  [7, "Licuadoras", "licuadoras"],
  [8, "Abanicos", "abanicos"],
  [9, "Cafeteras", "cafeteras"],
  [10, "Arroceras", "arroceras"],
  [11, "Planchas", "planchas"],
  [12, "Sandwicheras", "sandwicheras"],
  [13, "Exhibidores", "exhibidores"],
  [14, "Camas", "camas"],
] as const;

export const categoriasProducto: CategoriaProducto[] = categorias.map(
  ([id, nombre, slug]) => ({
    id,
    nombre,
    slug,
    imagen: imagenProducto(slug, "categoria"),
    tituloEditorial: `Descubre nuestra selección de ${nombre.toLowerCase()}.`,
    descripcion:
      `Explora nuestro catálogo de ${nombre.toLowerCase()} en Click Casa. ` +
      "Compara opciones y consulta precios y disponibilidad.",
  }),
);
