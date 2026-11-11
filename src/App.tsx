import { Route, Routes, Navigate } from "react-router";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ScrollAlInicio from "./components/ScrollAlInicio/ScrollAlInicio";
import PaginaNoEncontrada from "./components/PaginaNoEncontrada/PaginaNoEncontrada";
import Inicio from "./pages/Inicio/Inicio";
import CategoriaProductosRuta from "./pages/CategoriaProductos/CategoriaProductosRuta";
import DetalleProductoRuta from "./pages/DetalleProducto/DetalleProductoRuta";
import Buscar from "./pages/Buscar/Buscar";
import "./App.css";

function App() {
  return (
    <>
      <ScrollAlInicio />
      <Header />

      <Routes>
        <Route path="/" element={<Inicio />} />

        <Route path="/buscar" element={<Buscar />} />

        <Route path="/catalogo/:slug" element={<CategoriaProductosRuta />} />

        <Route path="/productos/:id" element={<DetalleProductoRuta />} />

        <Route path="/carrito" element={<Navigate to="/" replace />} />
        <Route path="/pedido" element={<Navigate to="/" replace />} />
        <Route path="*" element={<PaginaNoEncontrada />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
