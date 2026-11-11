import { useSyncExternalStore } from "react";
import SEO from "../../components/SEO/SEO";
import { Link, useSearchParams } from "react-router";

import { productos } from "../../data/productos";
import { categoriasProducto } from "../../data/categoriasProducto";
import ProductoCard from "../../components/ProductoCard/ProductoCard";

import "./Buscar.css";

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

const suscribir = () => () => {};

function Buscar() {
  const [parametros] = useSearchParams();

  const consulta = useSyncExternalStore(
    suscribir,
    () => (parametros.get("q") ?? "").trim(),
    () => "",
  );
  const marcaSolicitada = useSyncExternalStore(
    suscribir,
    () => (parametros.get("marca") ?? "").trim().slice(0, 100),
    () => "",
  );
  const marca =
    productos.find((p) => normalizar(p.marca) === normalizar(marcaSolicitada))
      ?.marca ?? marcaSolicitada;

  const palabras = normalizar(consulta).split(/\s+/).filter(Boolean);

  const resultados =
    palabras.length === 0 && !marca
      ? []
      : productos.filter((producto) => {
          if (marca && normalizar(producto.marca) !== normalizar(marca))
            return false;
          const categoria = categoriasProducto.find(
            (categoria) => categoria.id === producto.categoriaId,
          );

          const contenido = normalizar(
            [
              producto.nombre,
              producto.marca,
              producto.modelo ?? "",
              producto.descripcion,
              categoria?.nombre ?? "",
            ].join(" "),
          );

          return palabras.every((palabra) => contenido.includes(palabra));
        });

  return (
    <main className="buscar" id="contenido-principal" tabIndex={-1}>
      <SEO
        titulo={
          marca
            ? `Productos de ${marca}`
            : consulta
              ? `Resultados para ${consulta}`
              : "Buscar productos"
        }
        descripcion="Busca productos por marca, modelo o categoría en Click Casa."
        noIndex
      />
      <nav className="buscar__ruta" aria-label="Ruta de navegación">
        <Link to="/">Inicio</Link>
        <span aria-hidden="true">/</span>
        {marca && (
          <>
            <Link to="/#marcas">Marcas</Link>
            <span aria-hidden="true">/</span>
          </>
        )}
        <span aria-current="page">{marca || "Buscar productos"}</span>
      </nav>

      <header className="buscar__encabezado">
        <h1>
          {marca
            ? `Productos de ${marca}`
            : consulta
              ? `Resultados para “${consulta}”`
              : "Buscar electrodomésticos"}
        </h1>

        <p>
          {marca
            ? `Explora los productos de ${marca} y consulta con nuestro equipo el precio y la disponibilidad.`
            : "Encuentra refrigeradoras, lavadoras, televisores, cocinas y más productos para tu hogar."}
        </p>
        {marca && (
          <p>
            <Link to="/#marcas">← Elegir otra marca</Link>
          </p>
        )}
      </header>

      {(consulta || marca) && (
        <p className="buscar__cantidad" role="status">
          {resultados.length}{" "}
          {resultados.length === 1
            ? "producto encontrado"
            : "productos encontrados"}
        </p>
      )}

      {resultados.length > 0 ? (
        <div className="buscar__grid">
          {resultados.map((producto) => {
            const categoria = categoriasProducto.find(
              (categoria) => categoria.id === producto.categoriaId,
            );

            return (
              <ProductoCard
                key={producto.id}
                producto={producto}
                nombreCategoria={categoria?.nombre ?? "Electrodomésticos"}
              />
            );
          })}
        </div>
      ) : (
        <section className="buscar__vacio">
          <h2>
            {marca
              ? "No hay productos para esta marca"
              : consulta
                ? "No encontramos productos con esa búsqueda"
                : "Explora nuestras categorías"}
          </h2>

          <p>
            {marca
              ? "Elige otra marca o explora las categorías disponibles."
              : consulta
                ? "Prueba con otra marca, modelo o tipo de electrodoméstico."
                : "También puedes explorar nuestro catálogo por categorías."}
          </p>

          <div className="buscar__categorias">
            {categoriasProducto.map((categoria) => (
              <Link key={categoria.id} to={`/catalogo/${categoria.slug}`}>
                {categoria.nombre} →
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default Buscar;
