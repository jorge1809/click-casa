export const monedaConfig = {
  cordobasPorDolar: 36.6243,
} as const;

const formatoUSD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const formatoNIO = new Intl.NumberFormat("es-NI", {
  style: "currency",
  currency: "NIO",
});

export function precioEnUSD(precio: number): string {
  return formatoUSD.format(precio);
}

export function precioEnNIO(precioUSD: number): string {
  return formatoNIO.format(precioUSD * monedaConfig.cordobasPorDolar);
}
