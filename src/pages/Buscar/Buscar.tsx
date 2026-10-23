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

function Buscar() {
  const [parametros] = useSearchParams();

  const consulta = (parametros.get("q") ?? "").trim();

  const palabras = normalizar(consulta).split(/\s+/).filter(Boolean);

  const resultados =
    palabras.length === 0
      ? []
      : productos.filter((producto) => {
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
    <main className="buscar">
      <nav className="buscar__ruta" aria-label="Ruta de navegación">
        <Link to="/">Inicio</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Buscar productos</span>
      </nav>

      <header className="buscar__encabezado">
        <h1>
          {consulta
            ? `Resultados para “${consulta}”`
            : "Buscar electrodomésticos"}
        </h1>

        <p>
          Encuentra refrigeradoras, lavadoras, televisores, cocinas y más
          productos para tu hogar.
        </p>
      </header>

      {consulta && (
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
            {consulta
              ? "No encontramos productos con esa búsqueda"
              : "Explora nuestras categorías"}
          </h2>

          <p>
            {consulta
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
