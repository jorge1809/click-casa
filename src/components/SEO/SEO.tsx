import { useEffect } from "react";
import { useLocation } from "react-router";

interface SEOProps {
  titulo: string;
  descripcion: string;
  noIndex?: boolean;
}

function SEO({ titulo, descripcion, noIndex = false }: SEOProps) {
  const { pathname } = useLocation();

  const tituloLimpio = titulo.trim();

  const tituloCompleto =
    tituloLimpio === "Click Casa" || tituloLimpio.endsWith(" | Click Casa")
      ? tituloLimpio
      : `${tituloLimpio} | Click Casa`;

  const urlBase = import.meta.env.VITE_SITE_URL as string | undefined;

  const urlCanonica = urlBase
    ? new URL(pathname, `${urlBase.replace(/\/+$/, "")}/`).href
    : undefined;

  useEffect(() => {
    document.title = tituloCompleto;

    // Descripción de la página.
    let descripcionMeta = document.head.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );

    if (!descripcionMeta) {
      descripcionMeta = document.createElement("meta");
      descripcionMeta.name = "description";
      document.head.appendChild(descripcionMeta);
    }

    descripcionMeta.content = descripcion;

    // URL canónica.
    const canonicalAnterior = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );

    if (!noIndex && urlCanonica) {
      const canonical = canonicalAnterior ?? document.createElement("link");

      canonical.rel = "canonical";
      canonical.href = urlCanonica;

      if (!canonicalAnterior) {
        document.head.appendChild(canonical);
      }
    } else {
      canonicalAnterior?.remove();
    }

    // Control de indexación.
    const robotsAnterior = document.head.querySelector<HTMLMetaElement>(
      'meta[name="robots"]',
    );

    if (noIndex) {
      const robots = robotsAnterior ?? document.createElement("meta");

      robots.name = "robots";
      robots.content = "noindex, follow";

      if (!robotsAnterior) {
        document.head.appendChild(robots);
      }
    } else {
      robotsAnterior?.remove();
    }
  }, [tituloCompleto, descripcion, urlCanonica, noIndex]);

  // Metadatos para el HTML prerenderizado.
  if (import.meta.env.SSR) {
    return (
      <>
        <title>{tituloCompleto}</title>

        <meta name="description" content={descripcion} />

        {noIndex && <meta name="robots" content="noindex, follow" />}

        {!noIndex && urlCanonica && <link rel="canonical" href={urlCanonica} />}
      </>
    );
  }

  return null;
}

export default SEO;
