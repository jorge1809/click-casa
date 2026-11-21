import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Tag } from "lucide-react";

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

// Cada columna contiene dos marcas.
// Si la cantidad es impar, repetimos la primera al final
// para evitar un espacio vacío en la segunda fila.
const columnasMarcas = Array.from(
  { length: Math.ceil(marcas.length / 2) },
  (_, indice) => {
    const primera = marcas[indice * 2];
    const segunda = marcas[indice * 2 + 1];

    if (segunda) return [primera, segunda];
    if (marcas.length > 1) return [primera, marcas[0]];

    return [primera];
  },
);

function normalizarMarca(nombre: string): string {
  return nombre.trim().toLocaleLowerCase("es");
}

function buscarLogotipo(marca: string): string | undefined {
  return Object.entries(logotiposMarcas).find(
    ([nombre]) => normalizarMarca(nombre) === normalizarMarca(marca),
  )?.[1];
}

function Logotipo({ marca }: { marca: string }) {
  const [archivoFallido, setArchivoFallido] = useState<string | null>(null);
  const archivo = buscarLogotipo(marca);

  if (!archivo || archivo === archivoFallido) {
    return <span className="marcas__nombre">{marca}</span>;
  }

  return (
    <img
      className="marcas__logo-individual"
      src={rutaPublica(archivo)}
      alt=""
      width={330}
      height={120}
      loading="lazy"
      decoding="async"
      onError={() => setArchivoFallido(archivo)}
    />
  );
}

export default function Marcas() {
  const seccionRef = useRef<HTMLElement>(null);
  const ultimaInteraccionRef = useRef(0);

  const [viewportRef, carrusel] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 2,
    duration: 30,
  });

  const [estado, setEstado] = useState({
    indice: 0,
    grupos: 0,
    anterior: false,
    siguiente: false,
  });

  // Sincroniza los puntos y las flechas con el carrusel.
  useEffect(() => {
    if (!carrusel) return;

    function actualizar() {
      if (!carrusel) return;

      setEstado({
        indice: carrusel.selectedScrollSnap(),
        grupos: carrusel.scrollSnapList().length,
        anterior: carrusel.canScrollPrev(),
        siguiente: carrusel.canScrollNext(),
      });
    }

    const frame = requestAnimationFrame(actualizar);

    carrusel.on("select", actualizar);
    carrusel.on("reInit", actualizar);

    return () => {
      cancelAnimationFrame(frame);
      carrusel.off("select", actualizar);
      carrusel.off("reInit", actualizar);
    };
  }, [carrusel]);

  // Avanza automáticamente cada tres segundos.
  useEffect(() => {
    if (!carrusel) return;

    const seccion = seccionRef.current;
    if (!seccion) return;

    let arrastrando = false;

    function registrarInteraccion() {
      ultimaInteraccionRef.current = Date.now();
    }

    function iniciarArrastre() {
      arrastrando = true;
      registrarInteraccion();
    }

    function terminarArrastre() {
      arrastrando = false;
      registrarInteraccion();
    }

    carrusel.on("pointerDown", iniciarArrastre);
    carrusel.on("pointerUp", terminarArrastre);

    seccion.addEventListener("wheel", registrarInteraccion, {
      passive: true,
    });

    const temporizador = window.setInterval(() => {
      if (document.hidden || arrastrando) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      if (Date.now() - ultimaInteraccionRef.current < 3000) return;

      // Evita mover los enlaces mientras se usan con el teclado.
      if (seccion.contains(document.activeElement)) return;

      // Permite seleccionar una marca con tranquilidad.
      if (
        window.matchMedia("(hover: hover)").matches &&
        seccion.matches(":hover")
      ) {
        return;
      }

      const limites = seccion.getBoundingClientRect();

      if (limites.bottom <= 0 || limites.top >= window.innerHeight) {
        return;
      }

      carrusel.scrollNext();
    }, 3000);

    return () => {
      window.clearInterval(temporizador);
      carrusel.off("pointerDown", iniciarArrastre);
      carrusel.off("pointerUp", terminarArrastre);
      seccion.removeEventListener("wheel", registrarInteraccion);
    };
  }, [carrusel]);

  function mover(direccion: "anterior" | "siguiente", momento: number) {
    if (!carrusel) return;

    ultimaInteraccionRef.current = momento;

    const inmediato = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (direccion === "anterior") {
      carrusel.scrollPrev(inmediato);
    } else {
      carrusel.scrollNext(inmediato);
    }
  }

  function irAlGrupo(indice: number, momento: number) {
    if (!carrusel) return;

    ultimaInteraccionRef.current = momento;

    const inmediato = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    carrusel.scrollTo(indice, inmediato);
  }
  return (
    <section
      className="marcas"
      id="marcas"
      ref={seccionRef}
      aria-labelledby="marcas-titulo"
    >
      <div className="marcas__encabezado">
        <span className="marcas__etiqueta">EXPLORA POR MARCA</span>

        <h2 id="marcas-titulo">Nuestras marcas</h2>

        <p>Encuentra tus electrodomésticos favoritos por marca.</p>
      </div>

      <div className="marcas__viewport" ref={viewportRef}>
        <ul className="marcas__lista" id="lista-marcas">
          {columnasMarcas.map((columna, indiceColumna) => (
            <li
              className="marcas__columna"
              key={`${columna[0]}-${indiceColumna}`}
            >
              {columna.map((marca, indiceFila) => (
                <Link
                  key={`${marca}-${indiceFila}`}
                  className="marcas__enlace"
                  to={`/buscar/?marca=${encodeURIComponent(marca)}`}
                  aria-label={`Ver productos de ${marca}`}
                >
                  <Logotipo marca={marca} />
                </Link>
              ))}
            </li>
          ))}
        </ul>
      </div>

      {estado.grupos > 1 && (
        <div className="marcas__navegacion">
          <div
            className="marcas__controles"
            role="group"
            aria-label="Navegación de marcas"
          >
            <button
              type="button"
              className="marcas__flecha"
              onClick={() => mover("anterior", Date.now())}
              disabled={!estado.anterior}
              aria-label="Marcas anteriores"
              aria-controls="lista-marcas"
            >
              <ChevronLeft size={21} aria-hidden="true" />
            </button>

            <div className="marcas__puntos">
              {Array.from({ length: estado.grupos }, (_, indice) => (
                <button
                  key={indice}
                  type="button"
                  className="marcas__punto"
                  aria-label={`Ir al grupo ${indice + 1} de marcas`}
                  aria-current={indice === estado.indice ? "true" : undefined}
                  aria-controls="lista-marcas"
                  onClick={() => irAlGrupo(indice, Date.now())}
                />
              ))}
            </div>

            <button
              type="button"
              className="marcas__flecha"
              onClick={() => mover("siguiente", Date.now())}
              disabled={!estado.siguiente}
              aria-label="Marcas siguientes"
              aria-controls="lista-marcas"
            >
              <ChevronRight size={21} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

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
