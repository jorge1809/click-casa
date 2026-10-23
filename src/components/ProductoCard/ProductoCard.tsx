import { useState } from "react";
import { ImageOff, ShoppingCart } from "lucide-react";
import { Link } from "react-router";
import { useCarrito } from "../../hooks/useCarrito";
import { precioEnUSD, precioEnNIO } from "../../config/moneda";
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

  return (
    <article className="producto-card">
      <Link to={`/productos/${producto.id}`} className="producto-card__enlace">
        <div className="producto-card__visual">
          {!imagenFallida && producto.imagen ? (
            <img
              src={producto.imagen}
              alt={producto.nombre}
              loading="lazy"
              onError={() => setImagenFallida(true)}
            />
          ) : (
            <div className="producto-card__placeholder">
              <ImageOff size={36} strokeWidth={1.4} />
              <span>Imagen próximamente</span>
            </div>
          )}
        </div>

        <div className="producto-card__contenido">
          <span className="producto-card__marca">
            {producto.marca} · {nombreCategoria}
          </span>

          <h3>{producto.nombre}</h3>

          <strong className="producto-card__usd">
            {precioEnUSD(producto.precioUSD)}
          </strong>

          <span className="producto-card__nio">
            Aprox. {precioEnNIO(producto.precioUSD)}
          </span>
        </div>
      </Link>

      <div className="producto-card__pie">
        <span
          className={
            producto.disponible
              ? "producto-card__disponible"
              : "producto-card__agotado"
          }
        >
          {producto.disponible ? "Disponible" : "Agotado"}
        </span>

        <button
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
      </div>
    </article>
  );
}
