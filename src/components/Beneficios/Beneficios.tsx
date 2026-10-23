import type { Beneficio } from "../../types/Beneficio";
import "./Beneficios.css";

interface BeneficiosProps {
  beneficios: Beneficio[];
}

function Beneficios({ beneficios }: BeneficiosProps) {
  return (
    <section className="beneficios" aria-label="Beneficios de Click Casa">
      <div className="beneficios__contenedor">
        {beneficios.map(({ id, icono: Icono, titulo, descripcion }) => (
          <article className="beneficio" key={id}>
            <div className="beneficio__icono">
              <Icono size={23} strokeWidth={2} aria-hidden="true" />
            </div>
            <div className="beneficio__contenido">
              <h3>{titulo}</h3>
              <p>{descripcion}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Beneficios;
