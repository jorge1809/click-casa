import { ArrowUpRight, MapPin, MessageCircle, Store } from "lucide-react";
import { crearEnlaceWhatsApp } from "../../config/contacto";

import "./QuienesSomos.css";

function QuienesSomos() {
  return (
    <section
      className="nosotros"
      id="nosotros"
      aria-labelledby="nosotros-titulo"
    >
      <div className="nosotros__contenido">
        <span className="nosotros__etiqueta">CONOCE CLICK CASA</span>

        <h2 className="nosotros__titulo" id="nosotros-titulo">
          Más que electrodomésticos,
          <span> soluciones para tu hogar.</span>
        </h2>

        <p className="nosotros__descripcion">
          En Click Casa creemos que cada espacio de tu hogar merece comodidad,
          funcionalidad y calidad.
        </p>

        <p className="nosotros__descripcion">
          Por eso, reunimos una selección de refrigeradoras, lavadoras, cocinas,
          televisores y pequeños electrodomésticos que hacen más práctico tu día
          a día.
        </p>

        <p className="nosotros__descripcion">
          Estamos en Managua, Nicaragua. Explora nuestro catálogo, descubre
          nuestras opciones y recibe atención personalizada por WhatsApp para
          encontrar lo que buscas.
        </p>

        <div className="nosotros__acciones">
          <a className="nosotros__boton" href="#ubicacion">
            <MapPin size={18} aria-hidden="true" />
            Visítanos
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>

          <a
            className="nosotros__enlace"
            href={crearEnlaceWhatsApp(
              "Hola, quisiera conocer más sobre Click Casa y sus productos.",
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={18} aria-hidden="true" />
            Escríbenos
          </a>
        </div>
      </div>

      <div className="nosotros__visual">
        <div className="nosotros__visual-contenido">
          <Store size={64} strokeWidth={1.3} aria-hidden="true" />

          <span>CLICK CASA</span>

          <p>
            Tus electrodomésticos,
            <br />a solo un clic.
          </p>
        </div>

        <span className="nosotros__visual-etiqueta">MANAGUA · NICARAGUA</span>
      </div>
    </section>
  );
}

export default QuienesSomos;
