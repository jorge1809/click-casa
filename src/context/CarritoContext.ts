import { createContext } from "react";
import type { ItemCarrito } from "../types/ItemCarrito";

interface CarritoContextValue {
  items: ItemCarrito[];
  agregarItem: (productoId: number) => void;
  eliminarItem: (productoId: number) => void;
  vaciarCarrito: () => void;
}

export const CarritoContext = createContext<CarritoContextValue | undefined>(
  undefined,
);
