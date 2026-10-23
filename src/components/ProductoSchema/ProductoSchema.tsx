import type { Producto } from "../../types/Producto";

interface ProductoSchemaProps {
  producto: Producto;
  urlProducto: string;
}

function ProductoSchema({ producto, urlProducto }: ProductoSchemaProps) {
  const urlBase = import.meta.env.VITE_SITE_URL as string | undefined;

  const convertirUrlAbsoluta = (ruta: string): string => {
    if (!urlBase) return ruta;

    return new URL(ruta, urlBase).href;
  };

  const imagenes = [
    ...new Set([producto.imagen, ...producto.galeria].filter(Boolean)),
  ].map(convertirUrlAbsoluta);

  const datosEstructurados = {
    "@context": "https://schema.org",
    "@type": "Product",

    name: producto.nombre,
    description: producto.descripcion,

    ...(imagenes.length > 0 && {
      image: imagenes,
    }),

    // sku: String(producto.id),

    brand: {
      "@type": "Brand",
      name: producto.marca,
    },

    ...(producto.modelo && {
      model: producto.modelo,
    }),

    offers: {
      "@type": "Offer",

      url: convertirUrlAbsoluta(urlProducto),

      priceCurrency: "USD",
      price: producto.precioUSD,

      availability: producto.disponible
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  const json = JSON.stringify(datosEstructurados).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

export default ProductoSchema;
