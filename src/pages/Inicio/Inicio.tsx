import Hero from "../../components/Hero/Hero";
import CatalogoCategorias from "../../components/CatalogoCategorias/CatalogoCategorias";
import Beneficios from "../../components/Beneficios/Beneficios";
import QuienesSomos from "../../components/QuienesSomos/QuienesSomos";
import DondeEncontrarnos from "../../components/DondeEncontrarnos/DondeEncontrarnos";
import Contacto from "../../components/Contacto/Contacto";
import SEO from "../../components/SEO/SEO";

import { categoriasProducto } from "../../data/categoriasProducto";
import { beneficios } from "../../data/beneficios";

function Inicio() {
  return (
    <main>
      <SEO
        titulo="Click Casa | Electrodomésticos"
        descripcion="Descubre refrigeradoras, lavadoras, televisores, cocinas y más en Click Casa, Managua. Explora nuestro catálogo, visítanos o consulta por WhatsApp."
      />

      <Hero />

      <Beneficios beneficios={beneficios} />

      <CatalogoCategorias categorias={categoriasProducto} />

      <QuienesSomos />

      <DondeEncontrarnos />

      <Contacto />
    </main>
  );
}

export default Inicio;
