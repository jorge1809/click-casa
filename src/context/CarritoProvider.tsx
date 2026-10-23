import { useEffect, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

import { cargarCarrito, guardarCarrito } from "../services/carritoStorage";

import type { ItemCarrito } from "../types/ItemCarrito";
import { productos } from "../data/productos";
import { CarritoContext } from "./CarritoContext";

interface CarritoProviderProps {
  children: ReactNode;
}

// Durante SSR devolvemos false.
// En el navegador, React detecta cuándo puede
// acceder a los datos almacenados.
function suscribir() {
  return () => {};
}

function obtenerSnapshotCliente() {
  return true;
}

function obtenerSnapshotServidor() {
  return false;
}

function CarritoProvider({ children }: CarritoProviderProps) {
  const clienteListo = useSyncExternalStore(
    suscribir,
    obtenerSnapshotCliente,
    obtenerSnapshotServidor,
  );

  const [items, setItems] = useState<ItemCarrito[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    return cargarCarrito();
  });

  // Guardamos el carrito cuando cambia.
  useEffect(() => {
    if (!clienteListo) return;

    guardarCarrito(items);
  }, [items, clienteListo]);

  function agregarItem(productoId: number) {
    const producto = productos.find((producto) => producto.id === productoId);

    if (!producto || !producto.disponible) return;

    setItems((actuales) => {
      const existe = actuales.some((item) => item.productoId === productoId);

      if (existe) return actuales;

      return [...actuales, { productoId }];
    });
  }

  function eliminarItem(productoId: number) {
    setItems((actuales) =>
      actuales.filter((item) => item.productoId !== productoId),
    );
  }
  function vaciarCarrito() {
    setItems([]);
  }
  return (
    <CarritoContext.Provider
      value={{
        items,
        agregarItem,
        eliminarItem,
        vaciarCarrito,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export default CarritoProvider;
