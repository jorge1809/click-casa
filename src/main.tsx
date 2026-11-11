import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import App from "./App";
import "./index.css";

const contenedor = document.getElementById("root");

if (!contenedor) {
  throw new Error("No se encontró el elemento root.");
}

const aplicacion = (
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>
);

if (contenedor.hasChildNodes()) {
  hydrateRoot(contenedor, aplicacion);
} else {
  createRoot(contenedor).render(aplicacion);
}
