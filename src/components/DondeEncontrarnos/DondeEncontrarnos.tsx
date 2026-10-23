import {
  ArrowUpRight,
  MapPin,
  Navigation,
  Phone,
  MessageCircle,
} from "lucide-react";

import {
  contacto,
  crearEnlaceGoogleMaps,
  crearEnlaceWhatsApp,
} from "../../config/contacto";

import "./DondeEncontrarnos.css";

function DondeEncontrarnos() {
  const { latitud, longitud } = contacto.ubicacion;

  const mapaEmbed = `https://maps.google.com/maps?q=${latitud},${longitud}&z=16&output=embed`;

  const formatearTelefono = (numero: string) => {
    const limpio = numero.replace(/\D/g, "");

    const nacional = limpio.startsWith("505") ? limpio.slice(3) : limpio;

    return `+505 ${nacional.slice(0, 4)}-${nacional.slice(4)}`;
  };

  return (
    <section
      className="ubicacion"
      id="ubicacion"
      aria-labelledby="ubicacion-titulo"
    >
      <div className="ubicacion__encabezado">
        <span className="ubicacion__etiqueta">NUESTRA TIENDA</span>

        <h2 id="ubicacion-titulo">¿Dónde encontrarnos?</h2>

        <p>
          Visítanos en Managua. Consulta nuestra ubicación y cómo llegar desde
          Google Maps.
        </p>
      </div>

      <div className="ubicacion__grid">
        <div className="ubicacion__mapa">
          <iframe
            title="Ubicación de Click Casa en Managua"
            src={mapaEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        <div className="ubicacion__informacion">
          <div className="ubicacion__dato">
            <MapPin size={22} aria-hidden="true" />

            <div>
              <h3>Dirección</h3>
              <p>{contacto.direccion}</p>
            </div>
          </div>

          <div className="ubicacion__dato">
            <MessageCircle size={22} aria-hidden="true" />

            <div>
              <h3>WhatsApp oficial</h3>

              <a
                href={crearEnlaceWhatsApp(
                  "Hola, quisiera información para visitar Click Casa.",
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                {formatearTelefono(contacto.whatsapp)}
              </a>
            </div>
          </div>

          <div className="ubicacion__dato">
            <Phone size={22} aria-hidden="true" />

            <div>
              <h3>Teléfono alternativo</h3>

              <a href={`tel:+${contacto.whatsapp}`}>
                {formatearTelefono(contacto.whatsapp)}
              </a>
            </div>
          </div>

          <a
            className="ubicacion__boton"
            href={crearEnlaceGoogleMaps()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Navigation size={19} aria-hidden="true" />
            Cómo llegar
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default DondeEncontrarnos;
