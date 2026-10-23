export const contacto = {
  // whatsapp: "50589988018",
  whatsapp: "50589773100",

  direccion:
    "Pista de la Solidaridad, esquina Avenida Argüelles, Managua, Nicaragua",

  ubicacion: {
    latitud: 12.12255,
    longitud: -86.24357,
  },
} as const;

export function crearEnlaceWhatsApp(mensaje: string): string {
  return `https://wa.me/${contacto.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

export function crearEnlaceGoogleMaps(): string {
  const { latitud, longitud } = contacto.ubicacion;

  return `https://www.google.com/maps/search/?api=1&query=${latitud},${longitud}`;
}
