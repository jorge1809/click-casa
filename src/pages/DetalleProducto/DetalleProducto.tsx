import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import useEmblaCarousel from "embla-carousel-react";
import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Expand,
  ImageOff,
  MessageCircle,
  ShoppingCart,
  X,
} from "lucide-react";

import type { Producto } from "../../types/Producto";
import type { CategoriaProducto } from "../../types/CategoriaProducto";
import { precioEnUSD, precioEnNIO } from "../../config/moneda";
import { crearEnlaceWhatsApp } from "../../config/contacto";
import { useCarrito } from "../../hooks/useCarrito";
import "./DetalleProducto.css";

interface DetalleProductoProps {
  producto: Producto;
  categoria: CategoriaProducto;
}

function ImagenDetalle({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        className={`detalle-producto__sin-imagen ${className ?? ""}`}
        role="img"
        aria-label={alt}
      >
        <ImageOff size={36} />
        <span>Imagen próximamente</span>
      </div>
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}

function DetalleProducto({ producto, categoria }: DetalleProductoProps) {
  const fotografias = [
    ...new Set([producto.imagen, ...producto.galeria].filter(Boolean)),
  ];

  const { items, agregarItem } = useCarrito();
  const agregado = items.some((item) => item.productoId === producto.id);

  const [indiceImagen, setIndiceImagen] = useState(0);
  const [imagenAmpliada, setImagenAmpliada] = useState(false);

  const botonCerrarRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: fotografias.length > 1,
    align: "start",
    containScroll: "trimSnaps",
  });

  const cambiarImagen = useCallback(
    (direccion: number) => {
      if (!fotografias.length) return;

      const siguiente =
        (indiceImagen + direccion + fotografias.length) % fotografias.length;

      setIndiceImagen(siguiente);
      emblaApi?.scrollTo(siguiente);
    },
    [emblaApi, fotografias.length, indiceImagen],
  );

  useEffect(() => {
    if (!emblaApi) return;

    const actualizarSeleccion = () => {
      setIndiceImagen(emblaApi.selectedScrollSnap());
    };

    actualizarSeleccion();
    emblaApi.on("select", actualizarSeleccion);

    return () => {
      emblaApi.off("select", actualizarSeleccion);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!imagenAmpliada) return;

    const elementoAnterior = document.activeElement;
    botonCerrarRef.current?.focus();

    function manejarTeclado(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setImagenAmpliada(false);
      }

      if (event.key === "ArrowLeft") cambiarImagen(-1);
      if (event.key === "ArrowRight") cambiarImagen(1);

      if (event.key === "Tab") {
        const controles = modalRef.current?.querySelectorAll<HTMLButtonElement>(
          "button:not([disabled])",
        );

        if (!controles?.length) return;

        const primero = controles[0];
        const ultimo = controles[controles.length - 1];

        if (event.shiftKey && document.activeElement === primero) {
          event.preventDefault();
          ultimo.focus();
        } else if (!event.shiftKey && document.activeElement === ultimo) {
          event.preventDefault();
          primero.focus();
        }
      }
    }

    document.addEventListener("keydown", manejarTeclado);

    return () => {
      document.removeEventListener("keydown", manejarTeclado);

      if (elementoAnterior instanceof HTMLElement) {
        elementoAnterior.focus();
      }
    };
  }, [imagenAmpliada, cambiarImagen]);

  const precioUSD = precioEnUSD(producto.precioUSD);
  const precioNIO = precioEnNIO(producto.precioUSD);

  const mensajeWhatsApp = [
    "Hola, quisiera información sobre este producto de Click Casa:",
    "",
    `Producto: ${producto.nombre}`,
    producto.modelo ? `Modelo: ${producto.modelo}` : "",
    `Precio de referencia: ${precioUSD}`,
    `Equivalente aproximado: ${precioNIO}`,
    "",
    "¿Podrían confirmar el precio, la disponibilidad y la entrega?",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <main className="detalle-producto">
      <nav className="detalle-producto__ruta" aria-label="Ruta de navegación">
        <Link to="/">Inicio</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/catalogo/${categoria.slug}`}>{categoria.nombre}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{producto.nombre}</span>
      </nav>

      <div className="detalle-producto__grid">
        <div className="detalle-producto__galeria">
          <div className="detalle-producto__galeria-layout">
            {fotografias.length > 1 && (
              <div
                className="detalle-producto__miniaturas"
                aria-label="Fotografías del producto"
              >
                {fotografias.map((imagen, indice) => (
                  <button
                    key={imagen}
                    type="button"
                    className="detalle-producto__miniatura"
                    aria-label={`Ver fotografía ${indice + 1}`}
                    aria-pressed={indice === indiceImagen}
                    onClick={() => {
                      setIndiceImagen(indice);
                      emblaApi?.scrollTo(indice);
                    }}
                  >
                    <ImagenDetalle src={imagen} alt={`Miniatura ${indice + 1}`} />
                  </button>
                ))}
              </div>
            )}

            <div className="detalle-producto__visor">
              <div className="detalle-producto__embla" ref={emblaRef}>
                <div className="detalle-producto__embla-contenedor">
                  {(fotografias.length ? fotografias : [""]).map(
                    (imagen, indice) => (
                      <div
                        className="detalle-producto__embla-slide"
                        key={imagen || "pendiente"}
                      >
                        <ImagenDetalle
                          key={imagen}
                          src={imagen}
                          className="detalle-producto__imagen"
                          alt={`${producto.nombre}, fotografía ${indice + 1}`}
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>

              {fotografias.length > 0 && (
                <button
                  type="button"
                  className="detalle-producto__ampliar"
                  onClick={() => setImagenAmpliada(true)}
                  aria-label="Ampliar fotografía"
                >
                  <Expand size={20} />
                </button>
              )}

              {fotografias.length > 1 && (
                <span className="detalle-producto__contador">
                  {indiceImagen + 1} / {fotografias.length}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="detalle-producto__contenido">
          <span className="detalle-producto__categoria">
            {producto.marca} · {categoria.nombre}
          </span>

          <h1>{producto.nombre}</h1>

          <p className="detalle-producto__precio">{precioUSD}</p>

          <p className="detalle-producto__precio-nio">
            Aproximadamente {precioNIO}
          </p>

          <p className="detalle-producto__descripcion">
            {producto.descripcion}
          </p>

          <p
            className={`detalle-producto__stock ${
              producto.disponible
                ? "detalle-producto__stock--disponible"
                : "detalle-producto__stock--agotado"
            }`}
          >
            {producto.disponible ? "Disponible" : "Agotado"}
          </p>

          <button
            type="button"
            className="detalle-producto__boton"
            disabled={!producto.disponible || agregado}
            onClick={() => agregarItem(producto.id)}
          >
            {agregado ? (
              <Check size={20} aria-hidden="true" />
            ) : (
              <ShoppingCart size={20} aria-hidden="true" />
            )}

            {!producto.disponible
              ? "No disponible"
              : agregado
                ? "Agregado al carrito"
                : "Agregar al carrito"}
          </button>

          {agregado && producto.disponible && (
            <Link to="/carrito" className="detalle-producto__ir-carrito">
              Ver carrito
              <ArrowUpRight size={17} />
            </Link>
          )}

          <a
            className="detalle-producto__whatsapp"
            href={crearEnlaceWhatsApp(mensajeWhatsApp)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={19} />
            Consultar este producto por WhatsApp
            <ArrowUpRight size={17} />
          </a>

          <p className="detalle-producto__nota">
            Los precios publicados son referenciales y están sujetos a
            confirmación. Consulta disponibilidad y opciones de entrega.
          </p>

          {producto.especificaciones &&
            Object.keys(producto.especificaciones).length > 0 && (
              <section className="detalle-producto__especificaciones">
                <h2>Especificaciones</h2>

                <dl>
                  {Object.entries(producto.especificaciones).map(
                    ([nombre, valor]) => (
                      <div key={nombre}>
                        <dt>{nombre}</dt>
                        <dd>{valor}</dd>
                      </div>
                    ),
                  )}
                </dl>
              </section>
            )}
        </div>
      </div>

      {imagenAmpliada && (
        <div
          ref={modalRef}
          className="detalle-producto__modal"
          role="dialog"
          aria-modal="true"
          aria-label={`Galería ampliada de ${producto.nombre}`}
        >
          <button
            ref={botonCerrarRef}
            type="button"
            className="detalle-producto__modal-cerrar"
            onClick={() => setImagenAmpliada(false)}
            aria-label="Cerrar galería"
          >
            <X size={26} />
          </button>

          {fotografias.length > 1 && (
            <button
              type="button"
              className="detalle-producto__modal-anterior"
              onClick={() => cambiarImagen(-1)}
              aria-label="Fotografía anterior"
            >
              <ChevronLeft size={30} />
            </button>
          )}

          <ImagenDetalle
            key={fotografias[indiceImagen] ?? "pendiente"}
            src={fotografias[indiceImagen] ?? ""}
            alt={`${producto.nombre}, imagen ampliada`}
          />

          {fotografias.length > 1 && (
            <button
              type="button"
              className="detalle-producto__modal-siguiente"
              onClick={() => cambiarImagen(1)}
              aria-label="Fotografía siguiente"
            >
              <ChevronRight size={30} />
            </button>
          )}
        </div>
      )}
    </main>
  );
}

export default DetalleProducto;
