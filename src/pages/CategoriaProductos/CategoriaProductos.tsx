import { Link, useSearchParams } from "react-router";
import { Truck, Headphones, ShieldCheck } from "lucide-react";

import type { Producto } from "../../types/Producto";
import ProductoCard from "../../components/ProductoCard/ProductoCard";

import "./CategoriaProductos.css";

interface CategoriaProductosProps {
  titulo: string;
  descripcion: string;
  etiqueta: string;
  productos: Producto[];
  nombreCategoria: (producto: Producto) => string;
  tituloEditorial?: string;
  imagenPortada?: string;
}

const opcionesOrden = [
  { valor: "destacados", texto: "Orden original" },
  { valor: "precio-asc", texto: "Precio: menor a mayor" },
  { valor: "precio-desc", texto: "Precio: mayor a menor" },
  { valor: "nombre", texto: "Nombre: A–Z" },
];

function CategoriaProductos({
  titulo,
  descripcion,
  etiqueta,
  productos,
  nombreCategoria,
  tituloEditorial,
  imagenPortada,
}: CategoriaProductosProps) {
  const [parametros, setParametros] = useSearchParams();

  const ordenSolicitado = parametros.get("orden");

  const orden = opcionesOrden.some((opcion) => opcion.valor === ordenSolicitado)
    ? ordenSolicitado
    : "destacados";

  const productosVisibles = [...productos];

  if (orden === "precio-asc") {
    productosVisibles.sort((a, b) => a.precioUSD - b.precioUSD);
  } else if (orden === "precio-desc") {
    productosVisibles.sort((a, b) => b.precioUSD - a.precioUSD);
  } else if (orden === "nombre") {
    productosVisibles.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  }

  function actualizarOrden(valor: string) {
    setParametros(
      (actuales) => {
        const nuevos = new URLSearchParams(actuales);

        if (valor === "destacados") {
          nuevos.delete("orden");
        } else {
          nuevos.set("orden", valor);
        }

        return nuevos;
      },
      { replace: true },
    );
  }

  return (
    <main className="categoria-productos">
      <section
        className={`categoria-productos__hero ${
          imagenPortada
            ? "categoria-productos__hero--imagen"
            : "categoria-productos__hero--simple"
        }`}
        aria-labelledby="categoria-titulo"
      >
        {imagenPortada && (
          <div className="categoria-productos__portada" aria-hidden="true">
            <img src={imagenPortada} alt="" fetchPriority="high" />
          </div>
        )}

        <div className="categoria-productos__hero-interior">
          <nav
            className="categoria-productos__ruta"
            aria-label="Ruta de navegación"
          >
            <Link to="/">Inicio</Link>

            <span aria-hidden="true">/</span>

            <Link to="/#catalogo">Catálogo</Link>

            <span aria-hidden="true">/</span>

            <span aria-current="page">{titulo}</span>
          </nav>

          <div className="categoria-productos__presentacion">
            <span className="categoria-productos__etiqueta">{etiqueta}</span>

            <h1 id="categoria-titulo">{titulo}</h1>

            {tituloEditorial && (
              <p className="categoria-productos__titulo-editorial">
                {tituloEditorial}
              </p>
            )}

            <p className="categoria-productos__descripcion">{descripcion}</p>
          </div>

          <div
            className="categoria-productos__beneficios"
            aria-label="Beneficios de comprar en Click Casa"
          >
            <div className="categoria-productos__beneficio">
              <Truck size={22} strokeWidth={1.5} />
              <span>Envíos a todo el país</span>
            </div>

            <div className="categoria-productos__beneficio">
              <ShieldCheck size={22} strokeWidth={1.5} />
              <span>Productos de calidad</span>
            </div>

            <div className="categoria-productos__beneficio">
              <Headphones size={22} strokeWidth={1.5} />
              <span>Asesoría personalizada</span>
            </div>
          </div>
        </div>
      </section>

      <section
        className="categoria-productos__catalogo"
        aria-label={`Productos de ${titulo}`}
      >
        {productos.length > 0 && (
          <div className="categoria-productos__controles">
            <p className="categoria-productos__cantidad">
              {productos.length === 1
                ? "1 producto"
                : `${productos.length} productos`}
            </p>

            <div className="categoria-productos__orden">
              <label htmlFor="orden-productos">Ordenar por</label>

              <select
                id="orden-productos"
                value={orden ?? "destacados"}
                onChange={(event) => actualizarOrden(event.target.value)}
              >
                {opcionesOrden.map((opcion) => (
                  <option key={opcion.valor} value={opcion.valor}>
                    {opcion.texto}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {productosVisibles.length > 0 ? (
          <div className="categoria-productos__grid">
            {productosVisibles.map((producto) => (
              <div className="categoria-productos__item" key={producto.id}>
                <ProductoCard
                  producto={producto}
                  nombreCategoria={nombreCategoria(producto)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="categoria-productos__vacio">
            <p>Todavía no hay productos en esta colección.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default CategoriaProductos;
