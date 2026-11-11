import { useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Headset,
  ImageOff,
  MessageCircle,
  XCircle,
} from "lucide-react";
import { Link } from "react-router";
import { crearEnlaceWhatsApp } from "../../config/contacto";
import type { Producto } from "../../types/Producto";
import "./ProductoCard.css";

export default function ProductoCard({
  producto,
  nombreCategoria,
}: {
  producto: Producto;
  nombreCategoria: string;
}) {
  const [imagenFallida, setImagenFallida] = useState(false);
  const mensaje = `Hola, quisiera consultar el precio y la disponibilidad de ${producto.nombre} en Click Casa.`;
  const estado =
    producto.disponible === null
      ? "consulta"
      : producto.disponible
        ? "disponible"
        : "agotado";
  return (
    <article className="producto-card">
      <Link
        to={`/productos/${producto.id}`}
        className="producto-card__enlace"
        aria-label={`Ver detalles de ${producto.nombre}`}
      >
        <div className="producto-card__visual">
          {!imagenFallida && producto.imagen ? (
            <img
              src={producto.imagen}
              alt={producto.nombre}
              loading="lazy"
              decoding="async"
              onError={() => setImagenFallida(true)}
            />
          ) : (
            <div className="producto-card__placeholder">
              <ImageOff size={36} aria-hidden="true" />
              <span>Imagen próximamente</span>
            </div>
          )}
        </div>
        <div className="producto-card__contenido">
          <span className="producto-card__marca">
            {producto.marca === "Sin especificar"
              ? nombreCategoria
              : `${producto.marca} · ${nombreCategoria}`}
          </span>
          <h3>{producto.nombre}</h3>
        </div>
      </Link>
      <div className="producto-card__pie">
        <div className="producto-card__indicadores">
          <span className={`producto-card__${estado}`}>
            {producto.disponible === null ? (
              <Headset size={16} aria-hidden="true" />
            ) : producto.disponible ? (
              <CheckCircle2 size={16} aria-hidden="true" />
            ) : (
              <XCircle size={16} aria-hidden="true" />
            )}
            {producto.disponible === null
              ? "Consultar disponibilidad"
              : producto.disponible
                ? "Disponible"
                : "Agotado"}
          </span>
          <span className="producto-card__asesoria">
            <Headset size={17} aria-hidden="true" />
            Asesoría personalizada
          </span>
        </div>
        <a
          className="producto-card__whatsapp"
          href={crearEnlaceWhatsApp(mensaje)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Consultar por WhatsApp sobre ${producto.nombre}`}
        >
          <MessageCircle size={19} aria-hidden="true" />
          <span>Consultar por WhatsApp</span>
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
