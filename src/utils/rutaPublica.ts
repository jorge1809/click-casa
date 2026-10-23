export function rutaPublica(ruta: string): string {
  const base = import.meta.env?.BASE_URL ?? "/";

  return `${base}${ruta.replace(/^\/+/, "")}`;
}
