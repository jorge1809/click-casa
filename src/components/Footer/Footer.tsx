import { useState } from "react";
import { Link } from "react-router";
import { ChevronDown } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa6";

import { categoriasProducto } from "../../data/categoriasProducto";
import { crearEnlaceWhatsApp } from "../../config/contacto";

import "./Footer.css";

type GrupoFooter = "productos" | "atencion" | "informacion";

function Footer() {
  const categoriasDestacadas = categoriasProducto.slice(0, 6);

  const [grupoAbierto, setGrupoAbierto] = useState<GrupoFooter | null>(null);

  const alternarGrupo = (grupo: GrupoFooter) => {
    setGrupoAbierto((actual) => (actual === grupo ? null : grupo));
  };

  return (
    <footer className="footer">
      <div className="footer__contenido">
        {/* IDENTIDAD DE LA TIENDA */}
        <div className="footer__marca">
          <Link
            className="footer__logo"
            to="/"
            aria-label="Click Casa: volver al inicio"
          >
            <img
              src="/images/logo-click-casa.webp"
              alt="Click Casa"
              width="220"
            />
          </Link>

          <p className="footer__eslogan">Tu hogar, nuestra inspiración.</p>

          <div className="footer__redes">
            <a
              href="https://www.facebook.com/ClickCasa1?locale=es_LA"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visitar Facebook de Click Casa"
              title="Facebook"
            >
              <FaFacebookF size={22} aria-hidden="true" />
            </a>

            <a
              href="https://www.tiktok.com/@clickcasa0"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visitar TikTok de Click Casa"
              title="TikTok"
            >
              <FaTiktok size={22} aria-hidden="true" />
            </a>

            <span
              className="footer__red-social--pendiente"
              aria-label="Instagram próximamente"
              title="Instagram próximamente"
            >
              <FaInstagram size={22} aria-hidden="true" />
            </span>
          </div>

          <span className="footer__redes-nota">
            Síguenos en nuestras redes sociales
          </span>
        </div>

        {/* CATEGORÍAS */}
        <div className="footer__grupo">
          <h3 className="footer__titulo">
            <button
              type="button"
              className="footer__alternador"
              aria-expanded={grupoAbierto === "productos"}
              aria-controls="footer-productos"
              onClick={() => alternarGrupo("productos")}
            >
              Explorar productos
              <ChevronDown size={18} aria-hidden="true" />
            </button>
          </h3>

          <nav
            id="footer-productos"
            className={`footer__columna ${
              grupoAbierto === "productos" ? "footer__columna--abierta" : ""
            }`}
            aria-label="Categorías de productos"
          >
            {categoriasDestacadas.map((categoria) => (
              <Link key={categoria.id} to={`/catalogo/${categoria.slug}`}>
                {categoria.nombre}
              </Link>
            ))}

            <Link className="footer__enlace-destacado" to="/#catalogo">
              Ver todas las categorías
            </Link>
          </nav>
        </div>

        {/* ATENCIÓN AL CLIENTE */}
        <div className="footer__grupo">
          <h3 className="footer__titulo">
            <button
              type="button"
              className="footer__alternador"
              aria-expanded={grupoAbierto === "atencion"}
              aria-controls="footer-atencion"
              onClick={() => alternarGrupo("atencion")}
            >
              Atención al cliente
              <ChevronDown size={18} aria-hidden="true" />
            </button>
          </h3>

          <nav
            id="footer-atencion"
            className={`footer__columna ${
              grupoAbierto === "atencion" ? "footer__columna--abierta" : ""
            }`}
            aria-label="Atención al cliente"
          >
            <Link to="/#contacto">Contacto</Link>
            <Link to="/carrito">Mi carrito</Link>

            <a
              href={crearEnlaceWhatsApp(
                "Hola, necesito ayuda con una consulta sobre Click Casa.",
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Hablar con un asesor
            </a>
          </nav>
        </div>

        {/* INFORMACIÓN */}
        <div className="footer__grupo">
          <h3 className="footer__titulo">
            <button
              type="button"
              className="footer__alternador"
              aria-expanded={grupoAbierto === "informacion"}
              aria-controls="footer-informacion"
              onClick={() => alternarGrupo("informacion")}
            >
              Información
              <ChevronDown size={18} aria-hidden="true" />
            </button>
          </h3>

          <div
            id="footer-informacion"
            className={`footer__columna ${
              grupoAbierto === "informacion" ? "footer__columna--abierta" : ""
            }`}
          >
            <span>Nicaragua</span>
            <span>Precios y disponibilidad sujetos a confirmación</span>
            <span>Entregas según cobertura y disponibilidad</span>
          </div>
        </div>
      </div>

      {/* FRANJA INFERIOR */}
      <div className="footer__inferior">
        <p>
          © {new Date().getFullYear()} Click Casa. Todos los derechos
          reservados.
        </p>

        <p>Electrodomésticos para tu hogar</p>
      </div>
    </footer>
  );
}

export default Footer;
