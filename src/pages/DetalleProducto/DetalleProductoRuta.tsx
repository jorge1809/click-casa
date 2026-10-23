import { useParams } from "react-router";

import { productos } from "../../data/productos";
import { categoriasProducto } from "../../data/categoriasProducto";
import DetalleProducto from "./DetalleProducto";
import PaginaNoEncontrada from "../../components/PaginaNoEncontrada/PaginaNoEncontrada";
import SEO from "../../components/SEO/SEO";
import ProductoSchema from "../../components/ProductoSchema/ProductoSchema";

function DetalleProductoRuta() {
  const { id } = useParams();

  const producto = productos.find((producto) => String(producto.id) === id);

  const categoria = categoriasProducto.find(
    (categoria) => categoria.id === producto?.categoriaId,
  );

  if (!producto || !categoria) {
    return (
      <PaginaNoEncontrada
        tipo="PRODUCTOS"
        titulo="No encontramos este producto"
        descripcion="El producto que buscas no está disponible o su dirección ha cambiado. Explora el catálogo de Click Casa."
      />
    );
  }

  const descripcionSEO =
    `${producto.nombre} en Click Casa Nicaragua. ` +
    `${producto.descripcion} ` +
    "Consulta precios y disponibilidad por WhatsApp.";

  const urlBase = import.meta.env.VITE_SITE_URL as string | undefined;

  const urlProducto = urlBase
    ? new URL(`/productos/${producto.id}`, urlBase).href
    : `/productos/${producto.id}`;

  return (
    <>
      <SEO titulo={producto.nombre} descripcion={descripcionSEO} />
      <ProductoSchema producto={producto} urlProducto={urlProducto} />
      <DetalleProducto
        key={producto.id}
        producto={producto}
        categoria={categoria}
      />
    </>
  );
}

export default DetalleProductoRuta;
