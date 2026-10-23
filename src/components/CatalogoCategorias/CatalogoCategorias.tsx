import { useCallback, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "react-router";
import ImagenConFallback from "../ImagenConFallback/ImagenConFallback";
import type { CategoriaProducto } from "../../types/CategoriaProducto";
import "./CatalogoCategorias.css";
import Autoplay from "embla-carousel-autoplay";

interface CatalogoCategoriasProps {
  categorias: CategoriaProducto[];
}

function CatalogoCategorias({ categorias }: CatalogoCategoriasProps) {
  // Inicializamos Embla sin Autoplay para evitar el error.
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      containScroll: "trimSnaps",
      loop: categorias.length > 4,
      slidesToScroll: 1,
    },
    [
      Autoplay({
        delay: 5000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        playOnInit: true,
      }),
    ],
  );

  const suscribirBotones = useCallback(
    (notificar: () => void) => {
      if (!emblaApi) return () => {};

      emblaApi.on("select", notificar);
      emblaApi.on("reInit", notificar);

      return () => {
        emblaApi.off("select", notificar);
        emblaApi.off("reInit", notificar);
      };
    },
    [emblaApi],
  );

  const obtenerEstadoBotones = useCallback(() => {
    if (!emblaApi) return "false:false";

    return `${emblaApi.canScrollPrev()}:${emblaApi.canScrollNext()}`;
  }, [emblaApi]);

  const estadoBotones = useSyncExternalStore(
    suscribirBotones,
    obtenerEstadoBotones,
    () => "false:false",
  );

  const [puedeAnterior, puedeSiguiente] = estadoBotones
    .split(":")
    .map((valor) => valor === "true");

  return (
    <section
      className="catalogo-categorias"
      id="catalogo"
      aria-labelledby="catalogo-titulo"
    >
      <header className="catalogo-categorias__encabezado">
        <div>
          <span className="catalogo-categorias__etiqueta">
            Nuestro catálogo
          </span>

          <h2 id="catalogo-titulo">Explora por categoría</h2>

          <p>
            Encuentra electrodomésticos y artículos para equipar cada espacio de
            tu hogar.
          </p>
        </div>

        <div className="catalogo-categorias__controles">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!puedeAnterior}
            aria-label="Ver categorías anteriores"
          >
            <ArrowLeft size={20} />
          </button>

          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!puedeSiguiente}
            aria-label="Ver categorías siguientes"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </header>

      <div className="catalogo-categorias__viewport" ref={emblaRef}>
        <div className="catalogo-categorias__carrusel">
          {categorias.map((categoria) => (
            <div className="catalogo-categorias__slide" key={categoria.id}>
              <Link
                className="catalogo-categoria"
                to={`/catalogo/${categoria.slug}`}
                aria-label={`Explorar categoría ${categoria.nombre}`}
              >
                <div className="catalogo-categoria__imagen">
                  <ImagenConFallback
                    src={categoria.imagen}
                    alt={categoria.nombre}
                  />
                </div>

                <div className="catalogo-categoria__contenido">
                  <div>
                    <h3>{categoria.nombre}</h3>
                    <span>Explorar productos</span>
                  </div>

                  <ArrowUpRight size={22} aria-hidden="true" />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CatalogoCategorias;
