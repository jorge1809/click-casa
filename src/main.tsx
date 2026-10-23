import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import App from "./App";
import CarritoProvider from "./context/CarritoProvider";
import "./index.css";

const contenedor = document.getElementById("root");

if (!contenedor) {
  throw new Error("No se encontró el elemento root.");
}

const aplicacion = (
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <CarritoProvider>
        <App />
      </CarritoProvider>
    </BrowserRouter>
  </StrictMode>
);

if (contenedor.hasChildNodes()) {
  hydrateRoot(contenedor, aplicacion);
} else {
  createRoot(contenedor).render(aplicacion);
}
