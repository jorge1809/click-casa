import type { Producto } from "../../types/Producto";
import { urlSitio } from "../../utils/urlSitio";
export default function ProductoSchema({
  producto,
  urlProducto,
}: {
  producto: Producto;
  urlProducto: string;
}) {
  const datos = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: producto.nombre,
    description: producto.descripcion,
    url: urlSitio(urlProducto),
    image: [...new Set([producto.imagen, ...producto.galeria])]
      .filter(Boolean)
      .map(urlSitio),
    ...(producto.marca !== "Sin especificar" && {
      brand: { "@type": "Brand", name: producto.marca },
    }),
    ...(producto.modelo && { model: producto.modelo }),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(datos).replace(/</g, "\\u003c"),
      }}
    />
  );
}
