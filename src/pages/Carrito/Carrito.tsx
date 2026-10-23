import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowUpRight,
  ImageOff,
  MessageCircle,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import { productos } from "../../data/productos";
import { useCarrito } from "../../hooks/useCarrito";
import { precioEnUSD, precioEnNIO } from "../../config/moneda";
import { crearEnlaceWhatsApp } from "../../config/contacto";

import "./Carrito.css";

function ImagenCarrito({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="carrito-item__sin-imagen" role="img" aria-label={alt}>
        <ImageOff size={26} aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      className="carrito-item__imagen"
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}

function Carrito() {
  const { items, eliminarItem, vaciarCarrito } = useCarrito();

  const [confirmarConsulta, setConfirmarConsulta] = useState(false);
  const [confirmarVaciado, setConfirmarVaciado] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const botonAnteriorRef = useRef<HTMLElement | null>(null);

  const modalAbierto = confirmarConsulta || confirmarVaciado;

  // Obtener los productos seleccionados.
  const lineas = items.flatMap((item) => {
    const producto = productos.find(
      (producto) => producto.id === item.productoId,
    );

    return producto ? [producto] : [];
  });

  // Calcular el total referencial.
  const subtotalUSD = lineas.reduce(
    (total, producto) => total + producto.precioUSD,
    0,
  );

  // Preparar el mensaje que recibirá Click Casa.
  const mensajeWhatsApp = [
    "🛒 *CONSULTA DE PRODUCTOS | CLICK CASA*",
    "",
    "¡Hola! Me gustaría consultar los siguientes productos:",
    "",
    ...lineas.map(
      (producto, indice) =>
        `*${indice + 1}. ${producto.nombre}*` +
        (producto.modelo ? `\nModelo: ${producto.modelo}` : "") +
        `\nPrecio referencial: ${precioEnUSD(producto.precioUSD)}` +
        "\n",
    ),
    "━━━━━━━━━━━━━━━━",
    `📦 *Productos seleccionados:* ${lineas.length}`,
    `💰 *Total referencial:* ${precioEnUSD(subtotalUSD)}`,
    `💵 *Equivalente aproximado:* ${precioEnNIO(subtotalUSD)}`,
    "",
    "¿Podrían confirmarme los precios actuales, la disponibilidad y las opciones de entrega?",
    "",
    "¡Muchas gracias!",
  ].join("\n");

  function abrirConfirmacion(tipo: "consulta" | "vaciado") {
    botonAnteriorRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    if (tipo === "consulta") {
      setConfirmarVaciado(false);
      setConfirmarConsulta(true);
    } else {
      setConfirmarConsulta(false);
      setConfirmarVaciado(true);
    }
  }

  function cerrarConfirmaciones() {
    setConfirmarConsulta(false);
    setConfirmarVaciado(false);
  }

  function confirmarVaciarCarrito() {
    vaciarCarrito();
    cerrarConfirmaciones();
  }

  // Accesibilidad y comportamiento de los modales.
  useEffect(() => {
    if (!modalAbierto) return;

    const modal = modalRef.current;
    if (!modal) return;

    const obtenerControles = () =>
      Array.from(
        modal.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      );

    const controles = obtenerControles();
    controles[0]?.focus();

    function manejarTeclado(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        evento.preventDefault();
        cerrarConfirmaciones();
        return;
      }

      if (evento.key !== "Tab") return;

      const elementos = obtenerControles();

      if (elementos.length === 0) {
        evento.preventDefault();
        return;
      }

      const primero = elementos[0];
      const ultimo = elementos[elementos.length - 1];

      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    }

    document.addEventListener("keydown", manejarTeclado);

    const desbordamientoAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", manejarTeclado);
      document.body.style.overflow = desbordamientoAnterior;

      if (botonAnteriorRef.current?.isConnected) {
        botonAnteriorRef.current.focus();
      }
    };
  }, [modalAbierto]);

  return (
    <main className="carrito">
      {/* RUTA DE NAVEGACIÓN */}

      <nav className="carrito__ruta" aria-label="Ruta de navegación">
        <Link to="/">Inicio</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Carrito</span>
      </nav>

      {/* ENCABEZADO */}

      <div className="carrito__encabezado">
        <span className="carrito__etiqueta">TU SELECCIÓN</span>

        <h1>Tu carrito</h1>

        <p>
          Revisa los productos que te interesan y consulta su disponibilidad
          directamente por WhatsApp.
        </p>
      </div>

      {/* CARRITO VACÍO */}

      {lineas.length === 0 ? (
        <section
          className="carrito__vacio"
          aria-labelledby="carrito-vacio-titulo"
        >
          <ShoppingCart size={48} aria-hidden="true" />

          <h2 id="carrito-vacio-titulo">Tu carrito está vacío</h2>

          <p>
            Explora nuestras categorías y encuentra electrodomésticos para tu
            hogar.
          </p>

          <Link className="carrito__boton" to="/#catalogo">
            Explorar catálogo
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </section>
      ) : (
        <div className="carrito__grid">
          {/* PRODUCTOS */}

          <section
            className="carrito__productos"
            aria-label="Productos del carrito"
          >
            <div className="carrito__productos-encabezado">
              <h2>Productos seleccionados</h2>

              <span>
                {lineas.length} {lineas.length === 1 ? "producto" : "productos"}
              </span>
            </div>

            {lineas.map((producto) => (
              <article className="carrito-item" key={producto.id}>
                <Link
                  className="carrito-item__imagen-enlace"
                  to={`/productos/${producto.id}`}
                  aria-label={`Ver ${producto.nombre}`}
                >
                  <ImagenCarrito src={producto.imagen} alt={producto.nombre} />
                </Link>

                <div className="carrito-item__contenido">
                  <span className="carrito-item__marca">{producto.marca}</span>

                  <h2>
                    <Link to={`/productos/${producto.id}`}>
                      {producto.nombre}
                    </Link>
                  </h2>

                  {producto.modelo && <p>Modelo: {producto.modelo}</p>}

                  <p className="carrito-item__precio-nio">
                    Aprox. {precioEnNIO(producto.precioUSD)}
                  </p>

                  <button
                    className="carrito-item__eliminar"
                    type="button"
                    aria-label={`Eliminar ${producto.nombre} del carrito`}
                    onClick={() => eliminarItem(producto.id)}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                    Eliminar
                  </button>
                </div>

                <p className="carrito-item__subtotal">
                  {precioEnUSD(producto.precioUSD)}
                </p>
              </article>
            ))}

            <Link className="carrito__continuar" to="/#catalogo">
              <ArrowLeft size={18} aria-hidden="true" />
              Continuar explorando
            </Link>
          </section>

          {/* RESUMEN */}

          <aside className="carrito__resumen" aria-labelledby="resumen-titulo">
            <h2 id="resumen-titulo">Resumen de consulta</h2>

            <dl>
              <div>
                <dt>Productos seleccionados</dt>
                <dd>{lineas.length}</dd>
              </div>

              <div>
                <dt>Subtotal referencial</dt>
                <dd>{precioEnUSD(subtotalUSD)}</dd>
              </div>

              <div>
                <dt>Entrega</dt>
                <dd>Por confirmar</dd>
              </div>

              <div className="carrito__total">
                <dt>Total referencial</dt>
                <dd aria-live="polite">{precioEnUSD(subtotalUSD)}</dd>
              </div>
            </dl>

            <p className="carrito__equivalente">
              Aproximadamente {precioEnNIO(subtotalUSD)}
            </p>

            <button
              className="carrito__boton"
              type="button"
              onClick={() => abrirConfirmacion("consulta")}
            >
              <MessageCircle size={20} aria-hidden="true" />
              Consultar por WhatsApp
              <ArrowUpRight size={18} aria-hidden="true" />
            </button>

            <button
              className="carrito__vaciar"
              type="button"
              onClick={() => abrirConfirmacion("vaciado")}
            >
              <Trash2 size={17} aria-hidden="true" />
              Vaciar carrito
            </button>

            <p className="carrito__nota">
              Esta consulta no constituye una compra. Los precios publicados son
              provisionales y deben confirmarse con Click Casa. El costo de
              entrega no está incluido.
            </p>
          </aside>
        </div>
      )}

      {/* MODAL: CONFIRMAR CONSULTA */}

      {confirmarConsulta && (
        <div
          className="carrito-modal__fondo"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) {
              cerrarConfirmaciones();
            }
          }}
        >
          <div
            ref={modalRef}
            className="carrito-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmar-consulta-titulo"
            aria-describedby="confirmar-consulta-descripcion"
          >
            <div className="carrito-modal__icono">
              <MessageCircle size={30} aria-hidden="true" />
            </div>

            <h2 id="confirmar-consulta-titulo">
              ¿Enviar consulta por WhatsApp?
            </h2>

            <p
              id="confirmar-consulta-descripcion"
              className="carrito-modal__descripcion"
            >
              Tu selección está lista para consultar con Click Casa.
            </p>

            <div className="carrito-modal__resumen">
              <div>
                <span>Productos seleccionados</span>
                <strong>{lineas.length}</strong>
              </div>

              <div>
                <span>Total referencial</span>
                <strong>{precioEnUSD(subtotalUSD)}</strong>
              </div>
            </div>

            <p className="carrito-modal__aviso">
              Se abrirá WhatsApp con el mensaje preparado. Deberás presionar
              Enviar para completar la consulta. Tu carrito permanecerá
              guardado.
            </p>

            <div className="carrito-modal__acciones">
              <a
                className="carrito-modal__confirmar"
                href={crearEnlaceWhatsApp(mensajeWhatsApp)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={cerrarConfirmaciones}
              >
                <MessageCircle size={19} aria-hidden="true" />
                Continuar a WhatsApp
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>

              <button
                className="carrito-modal__cancelar"
                type="button"
                onClick={cerrarConfirmaciones}
              >
                Cancelar y seguir explorando
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VACIAR CARRITO */}

      {confirmarVaciado && (
        <div
          className="carrito-modal__fondo"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) {
              cerrarConfirmaciones();
            }
          }}
        >
          <div
            ref={modalRef}
            className="carrito-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmar-vaciado-titulo"
            aria-describedby="confirmar-vaciado-descripcion"
          >
            <div className="carrito-modal__icono">
              <Trash2 size={30} aria-hidden="true" />
            </div>

            <h2 id="confirmar-vaciado-titulo">¿Vaciar el carrito?</h2>

            <p
              id="confirmar-vaciado-descripcion"
              className="carrito-modal__descripcion"
            >
              Se eliminarán los {lineas.length}{" "}
              {lineas.length === 1
                ? "producto seleccionado"
                : "productos seleccionados"}
              .
            </p>

            <p className="carrito-modal__aviso">
              Esta acción no se puede deshacer. Puedes cancelar para conservar
              tu selección.
            </p>

            <div className="carrito-modal__acciones">
              <button
                className="carrito-modal__confirmar"
                type="button"
                onClick={confirmarVaciarCarrito}
              >
                <Trash2 size={17} aria-hidden="true" />
                Sí, vaciar carrito
              </button>

              <button
                className="carrito-modal__cancelar"
                type="button"
                onClick={cerrarConfirmaciones}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Carrito;
