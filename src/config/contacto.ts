export const contacto = {
  whatsapp: "50589988018",
  direccion:
    "Click Casa, Managua, Nicaragua. Consulta cómo llegar en Google Maps.",
  mapsUrl: "https://maps.app.goo.gl/r5uJuemw6VAEdALv6",
  ubicacion: { latitud: 12.1249055, longitud: -86.2404934 },
  telefonos: [
    { operador: "Tigo", numero: "50589988018", texto: "+505 8998 8018" },
    { operador: "Tigo", numero: "50582850123", texto: "+505 8285 0123" },
    { operador: "Claro", numero: "50589101397", texto: "+505 8910 1397" },
    { operador: "Claro", numero: "50588228233", texto: "+505 8822 8233" },
  ],
} as const;
export function crearEnlaceWhatsApp(mensaje: string): string {
  return `https://wa.me/${contacto.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}
export function crearEnlaceGoogleMaps(): string {
  return contacto.mapsUrl;
}
