export function urlSitio(ruta: string): string | undefined {
  const sitio = import.meta.env.VITE_SITE_URL as string | undefined;
  if (!sitio) return undefined;
  const base = new URL(sitio.endsWith("/") ? sitio : sitio + "/");
  if (/^https?:\/\//i.test(ruta)) return ruta;
  const prefijo = base.pathname.replace(/\/$/, "");
  const relativa =
    prefijo && (ruta === prefijo || ruta.startsWith(prefijo + "/"))
      ? ruta.slice(prefijo.length)
      : ruta;
  const url = new URL(relativa.replace(/^\/+/, ""), base);
  if (!url.pathname.endsWith("/") && !url.pathname.split("/").at(-1)?.includes(".")) {
    url.pathname += "/";
  }
  return url.href;
}
