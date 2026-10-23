import { useLayoutEffect } from "react";
import { useLocation } from "react-router";

function ScrollAlInicio() {
  const { pathname, search, hash } = useLocation();

  useLayoutEffect(() => {
    // Al navegar a otra página, comenzar desde arriba.
    if (!hash) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });

      return;
    }

    // Si navegamos a una sección de la página,
    // buscarla y desplazarla debajo del Header.
    let frame = 0;
    let intentos = 0;
    const maxIntentos = 30;

    let id: string;

    try {
      id = decodeURIComponent(hash.slice(1));
    } catch {
      id = hash.slice(1);
    }

    function desplazar() {
      const elemento = document.getElementById(id);

      if (!elemento) {
        if (intentos < maxIntentos) {
          intentos++;
          frame = requestAnimationFrame(desplazar);
        }
        return;
      }

      const header = document.querySelector<HTMLElement>(".header");

      const alturaHeader = header?.getBoundingClientRect().height ?? 0;

      const posicionElemento =
        elemento.getBoundingClientRect().top + window.scrollY;

      const posicionFinal = Math.max(0, posicionElemento - alturaHeader - 12);

      window.scrollTo({
        top: posicionFinal,
        left: 0,
        behavior: "instant",
      });
    }

    frame = requestAnimationFrame(desplazar);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [pathname, search, hash]);

  return null;
}

export default ScrollAlInicio;
