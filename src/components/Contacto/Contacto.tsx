import { useState } from "react";
import { ArrowUpRight, MessageCircle, ImageOff } from "lucide-react";

import { crearEnlaceWhatsApp } from "../../config/contacto";
import { rutaPublica } from "../../utils/rutaPublica";

import "./Contacto.css";

function Contacto() {
  const [imagenError, setImagenError] = useState(false);

  // const imagen = rutaPublica("/images/contacto-click-casa.gif");
  const imagen = rutaPublica("/images/contacto-click-casa.png");
  return (
    <section
      className="contacto"
      id="contacto"
      aria-labelledby="contacto-titulo"
    >
      <div className="contacto__contenido">
        <span className="contacto__etiqueta">ATENCIÓN PERSONALIZADA</span>

        <h2 className="contacto__titulo" id="contacto-titulo">
          ¿Necesitas ayuda para elegir?
        </h2>

        <p className="contacto__descripcion">
          Encuentra los electrodomésticos ideales para tu hogar. Te ayudamos a
          comparar modelos, consultar precios, verificar disponibilidad y
          conocer las opciones de entrega.
        </p>

        <a
          className="contacto__boton"
          href={crearEnlaceWhatsApp(
            "Hola, quisiera recibir asesoría sobre los electrodomésticos disponibles en Click Casa.",
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={20} aria-hidden="true" />
          <span>Hablar con un asesor</span>
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>

        <p className="contacto__nota">Consulta sin compromiso por WhatsApp.</p>
      </div>

      <div className="contacto__visual">
        {imagenError ? (
          <div className="contacto__placeholder">
            <ImageOff size={42} aria-hidden="true" />
            <span>Imagen de Click Casa no disponible</span>
          </div>
        ) : (
          <img
            src={imagen}
            alt="Click Casa: tus electrodomésticos, a solo un click"
            loading="lazy"
            decoding="async"
            onError={() => setImagenError(true)}
          />
        )}
      </div>
    </section>
  );
}

export default Contacto;
