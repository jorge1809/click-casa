import type { ItemCarrito } from "../types/ItemCarrito";
import { productos } from "../data/productos";

const CLAVE_CARRITO = "clickcasa.carrito.v1";

function esItemCarrito(valor: unknown): valor is ItemCarrito {
  if (typeof valor !== "object" || valor === null) return false;
  const item = valor as Record<string, unknown>;
  return (
    typeof item.productoId === "number" &&
    Number.isSafeInteger(item.productoId) &&
    item.productoId > 0
  );
}

export function cargarCarrito(): ItemCarrito[] {
  try {
    const guardado = localStorage.getItem(CLAVE_CARRITO);
    if (!guardado) return [];

    const datos: unknown = JSON.parse(guardado);
    if (!Array.isArray(datos)) return [];

    const idsValidos = new Set(productos.map((p) => p.id));
    const ids = new Set<number>();

    for (const dato of datos) {
      if (esItemCarrito(dato) && idsValidos.has(dato.productoId)) {
        ids.add(dato.productoId);
      }
    }

    return [...ids].map((productoId) => ({ productoId }));
  } catch {
    return [];
  }
}

export function guardarCarrito(items: ItemCarrito[]): void {
  try {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
  } catch {
    console.warn("No se pudo guardar el carrito.");
  }
}
