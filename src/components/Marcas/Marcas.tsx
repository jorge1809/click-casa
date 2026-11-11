import { useState } from "react";
import { Link } from "react-router";
import { Tag } from "lucide-react";

import { productos } from "../../data/productos";
import { logotiposMarcas } from "../../data/marcas";
import { rutaPublica } from "../../utils/rutaPublica";

import "./Marcas.css";

const marcas = [
  ...new Set(
    productos
      .map((producto) => producto.marca.trim())
      .filter((marca) => marca && marca !== "Sin especificar"),
  ),
].sort((a, b) => a.localeCompare(b, "es"));

// Compatibilidad temporal con los logotipos de la imagen anterior.
// Cada archivo individual registrado en marcas.ts tiene prioridad.
const ordenLogosAnteriores = [
  "ACR",
  "Black + Decker",
  "Challenger",
  "Coby",
  "Frigidaire",
  "General Air",
  "Gplus",
  "GRS",
  "Hisense",
  "LG",
  "Mabe",
  "MasterSonic",
  "Mystic",
  "Ninja",
  "Olympia",
  "Oster",
  "Premier",
  "RCA",
  "Royal",
  "SamDy",
  "Samsung",
  "Sankey",
  "TCL",
  "Tornado",
];

const columnas = [73, 430, 781, 1135, 1490, 1838];
const filas = [328, 486, 644, 802];

function normalizarMarca(nombre: string): string {
  return nombre.trim().toLocaleLowerCase("es");
}

function buscarLogotipo(marca: string): string | undefined {
  return Object.entries(logotiposMarcas).find(
    ([nombre]) => normalizarMarca(nombre) === normalizarMarca(marca),
  )?.[1];
}

function Logotipo({ marca }: { marca: string }) {
  const [falloIndividual, setFalloIndividual] = useState(false);
  const [falloAnterior, setFalloAnterior] = useState(false);

  const archivoIndividual = buscarLogotipo(marca);

  // Primero intenta mostrar el archivo propio de la marca.
  if (archivoIndividual && !falloIndividual) {
    return (
      <img
        className="marcas__logo-individual"
        src={rutaPublica(archivoIndividual)}
        alt=""
        width={240}
        height={90}
        loading="lazy"
        decoding="async"
        onError={() => setFalloIndividual(true)}
      />
    );
  }

  // Conserva los logotipos antiguos que todavía no tengan archivo propio.
  const indice = ordenLogosAnteriores.findIndex(
    (nombre) => normalizarMarca(nombre) === normalizarMarca(marca),
  );

  if (indice >= 0 && !falloAnterior) {
    const x = columnas[indice % 6];
    const y = filas[Math.floor(indice / 6)];

    return (
      <span className="marcas__logotipo" aria-hidden="true">
        <img
          src={rutaPublica("/images/marcas/marcas-referencia.png")}
          alt=""
          width={2196}
          height={1078}
          loading="lazy"
          decoding="async"
          onError={() => setFalloAnterior(true)}
          style={{
            left: `${(-x / 284) * 100}%`,
            top: `${(-y / 90) * 100}%`,
          }}
        />
      </span>
    );
  }

  // Si no existe un logotipo válido, muestra el nombre.
  return <span className="marcas__nombre">{marca}</span>;
}

export default function Marcas() {
  return (
    <section className="marcas" id="marcas" aria-labelledby="marcas-titulo">
      <div className="marcas__encabezado">
        <span className="marcas__etiqueta">EXPLORA POR MARCA</span>

        <h2 id="marcas-titulo">Nuestras marcas</h2>

        <p>Encuentra tus electrodomésticos favoritos por marca.</p>
      </div>

      <ul className="marcas__lista">
        {marcas.map((marca) => (
          <li key={marca}>
            <Link
              className="marcas__enlace"
              to={`/buscar/?marca=${encodeURIComponent(marca)}`}
              aria-label={`Ver productos de ${marca}`}
            >
              <Logotipo marca={marca} />
            </Link>
          </li>
        ))}
      </ul>

      <p className="marcas__nota">
        <Tag size={25} aria-hidden="true" />

        <span>
          Trabajamos con las mejores marcas en electrodomésticos, con calidad y
          respaldo para tu hogar y negocio.
        </span>
      </p>
    </section>
  );
}
