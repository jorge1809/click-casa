import { Link } from "react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import SEO from "../SEO/SEO";
import "./PaginaNoEncontrada.css";

interface PaginaNoEncontradaProps {
  tipo?: string;
  titulo?: string;
  descripcion?: string;
}

function PaginaNoEncontrada({
  tipo = "PÁGINA",
  titulo = "No encontramos esta página",
  descripcion = "La página que buscas no está disponible o su dirección ha cambiado. Explora nuestro catálogo de electrodomésticos y artículos para el hogar.",
}: PaginaNoEncontradaProps) {
  return (
    <main className="categoria-error">
      <SEO titulo={titulo} descripcion={descripcion} noIndex />

      <div className="categoria-error__contenido">
        <span className="categoria-error__etiqueta">CLICK CASA · {tipo}</span>

        <span className="categoria-error__numero" aria-hidden="true">
          404
        </span>

        <div className="categoria-error__linea" aria-hidden="true" />

        <h1>{titulo}</h1>

        <p className="categoria-error__descripcion">{descripcion}</p>

        <div className="categoria-error__acciones">
          <Link to="/#catalogo" className="categoria-error__boton">
            Explorar catálogo
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>

          <Link to="/" className="categoria-error__regresar">
            <ArrowLeft size={17} aria-hidden="true" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}

export default PaginaNoEncontrada;
