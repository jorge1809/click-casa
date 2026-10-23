import { ArrowUpRight } from "lucide-react";
import { rutaPublica } from "../../utils/rutaPublica";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-titulo">
      <div className="hero__visual">
        <img
          className="hero__imagen"
          src={rutaPublica("/images/hero-click-casa.webp")}
          alt="Electrodomésticos para equipar tu hogar"
          width={1920}
          height={1080}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </div>

      <div className="hero__contenido">
        <span className="hero__etiqueta">
          <span className="hero__etiqueta-linea" aria-hidden="true" />
          TECNOLOGÍA PARA TU HOGAR
        </span>

        <h1 className="hero__titulo" id="hero-titulo">
          Equipa tu hogar
          <span> a solo un clic.</span>
        </h1>

        <p className="hero__descripcion">
          Descubre nuestra variedad de refrigeradoras, cocinas, lavadoras,
          televisores y mucho más. Consulta precios y disponibilidad
          directamente por WhatsApp.
        </p>

        <a className="hero__boton" href="#catalogo">
          Explorar catálogo
          <ArrowUpRight size={19} aria-hidden="true" />
        </a>

        <div className="hero__detalle">
          <span className="hero__detalle-linea" aria-hidden="true" />
          <p>Tus electrodomésticos, a solo un clic.</p>
        </div>
      </div>

      <div className="hero__imagen-etiqueta">
        <span>CLICK CASA</span>
        <span>Tu hogar, nuestra prioridad</span>
      </div>
    </section>
  );
}

export default Hero;
