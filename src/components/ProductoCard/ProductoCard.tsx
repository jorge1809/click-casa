import { useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Headset,
  ImageOff,
  MessageCircle,
  ShoppingCart,
  XCircle,
} from "lucide-react";
import { Link } from "react-router";
import { useCarrito } from "../../hooks/useCarrito";
import { precioEnUSD, precioEnNIO } from "../../config/moneda";
import { funcionalidades } from "../../config/funcionalidades";
import { crearEnlaceWhatsApp } from "../../config/contacto";
import type { Producto } from "../../types/Producto";
import "./ProductoCard.css";

interface ProductoCardProps {
  producto: Producto;
  nombreCategoria: string;
}

export default function ProductoCard({
  producto,
  nombreCategoria,
}: ProductoCardProps) {
  const { items, agregarItem } = useCarrito();
  const [imagenFallida, setImagenFallida] = useState(false);
  const agregado = items.some((item) => item.productoId === producto.id);

  const mensajeWhatsApp =
    `Hola, estoy interesado en el producto ${producto.nombre} ` +
    `de la marca ${producto.marca}. ` +
    "¿Podrían confirmarme su disponibilidad y brindarme más información?";

  return (
    <article className="producto-card">
      <Link
        to={`/productos/${producto.id}`}
        className="producto-card__enlace"
        aria-label={`Ver detalles de ${producto.nombre}`}
      >
        <div className="producto-card__visual">
          {/* <span className="producto-card__categoria">{nombreCategoria}</span> */}

          {!imagenFallida && producto.imagen ? (
            <img
              src={producto.imagen}
              alt={producto.nombre}
              loading="lazy"
              onError={() => setImagenFallida(true)}
            />
          ) : (
            <div className="producto-card__placeholder">
              <ImageOff size={36} strokeWidth={1.4} aria-hidden="true" />
              <span>Imagen próximamente</span>
            </div>
          )}
        </div>

        <div className="producto-card__contenido">
          <span className="producto-card__marca">
            {producto.marca} · {nombreCategoria}
          </span>

          <h3>{producto.nombre}</h3>

          {funcionalidades.mostrarPrecios && (
            <>
              <strong className="producto-card__usd">
                {precioEnUSD(producto.precioUSD)}
              </strong>
              <span className="producto-card__nio">
                Aprox. {precioEnNIO(producto.precioUSD)}
              </span>
            </>
          )}
        </div>
      </Link>

      <div className="producto-card__pie">
        <div className="producto-card__indicadores">
          <span
            className={
              producto.disponible
                ? "producto-card__disponible"
                : "producto-card__agotado"
            }
          >
            {producto.disponible ? (
              <CheckCircle2 size={16} aria-hidden="true" />
            ) : (
              <XCircle size={16} aria-hidden="true" />
            )}
            {producto.disponible ? "Disponible" : "Agotado"}
          </span>

          <span className="producto-card__asesoria">
            <Headset size={17} aria-hidden="true" />
            Asesoría personalizada
          </span>
        </div>

        <a
          className="producto-card__whatsapp"
          href={crearEnlaceWhatsApp(mensajeWhatsApp)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Consultar por WhatsApp sobre ${producto.nombre}`}
        >
          <MessageCircle size={19} aria-hidden="true" />
          <span>Consultar por WhatsApp</span>
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>

        {funcionalidades.carritoHabilitado && (
          <button
            className="producto-card__agregar"
            type="button"
            disabled={!producto.disponible || agregado}
            onClick={() => agregarItem(producto.id)}
          >
            <ShoppingCart size={17} aria-hidden="true" />
            {!producto.disponible
              ? "No disponible"
              : agregado
                ? "Agregado"
                : "Agregar al carrito"}
          </button>
        )}
      </div>
    </article>
  );
}
