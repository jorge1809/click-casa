import { useParams } from "react-router";

import { categoriasProducto } from "../../data/categoriasProducto";
import { productos } from "../../data/productos";
import { rutaPublica } from "../../utils/rutaPublica";
import CategoriaProductos from "./CategoriaProductos";
import PaginaNoEncontrada from "../../components/PaginaNoEncontrada/PaginaNoEncontrada";
import SEO from "../../components/SEO/SEO";

function CategoriaProductosRuta() {
  const { slug } = useParams();

  const categoria = categoriasProducto.find(
    (categoria) => categoria.slug === slug,
  );

  if (!categoria) {
    return (
      <PaginaNoEncontrada
        tipo="CATÁLOGO"
        titulo="No encontramos esta categoría"
        descripcion="La categoría que buscas no está disponible. Explora nuestro catálogo de electrodomésticos y artículos para el hogar en Click Casa."
      />
    );
  }

  const productosCategoria = productos.filter(
    (producto) => producto.categoriaId === categoria.id,
  );

  const tituloSEO = `${categoria.nombre} | Click Casa`;

  const descripcionSEO =
    `Explora nuestra selección de ${categoria.nombre.toLowerCase()} ` +
    `en Click Casa Nicaragua. Descubre electrodomésticos y artículos ` +
    `para el hogar, consulta precios y solicita información por WhatsApp.`;

  return (
    <>
      <SEO titulo={tituloSEO} descripcion={descripcionSEO} />

      <CategoriaProductos
        titulo={categoria.nombre}
        descripcion={categoria.descripcion}
        etiqueta="Nuestro catálogo"
        productos={productosCategoria}
        nombreCategoria={() => categoria.nombre}
        tituloEditorial={categoria.tituloEditorial}
        imagenPortada={rutaPublica(
          `/images/encabezados/${categoria.slug}.webp`,
        )}
      />
    </>
  );
}

export default CategoriaProductosRuta;
