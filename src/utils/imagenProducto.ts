// import { rutaPublica } from "./rutaPublica";

// export function imagenProducto(categoria: string, archivo: string): string {
//   if (archivo === "categoria") {
//     return rutaPublica(`/images/Imagenes Catalogo/${categoria}.webp`);
//   }

//   return rutaPublica(`/images/productos/${categoria}/${archivo}`);
// }

import { rutaPublica } from "./rutaPublica";

export function imagenProducto(categoria: string, archivo: string): string {
  // Imágenes de las categorías del catálogo
  if (archivo === "categoria") {
    return rutaPublica(`/images/Imagenes Catalogo/${categoria}.webp`);
  }

  // Fotografías individuales de los productos
  return rutaPublica(`/images/Fotos click casa/${categoria}/${archivo}`);
}
