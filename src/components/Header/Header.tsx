import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import type { FormEvent } from "react";
import { Menu, Search, ShoppingCart, X } from "lucide-react";

import { useCarrito } from "../../hooks/useCarrito";
import { rutaPublica } from "../../utils/rutaPublica";

import "./Header.css";

const enlaces = [
  { href: "/", texto: "Inicio" },
  { href: "/#catalogo", texto: "Catálogo" },
  { href: "/#nosotros", texto: "Quiénes somos" },
  { href: "/#ubicacion", texto: "Dónde encontrarnos" },
  { href: "/#contacto", texto: "Contacto" },
];

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [busquedaEditada, setBusquedaEditada] = useState<{
    ruta: string;
    texto: string;
  } | null>(null);

  const botonMenuRef = useRef<HTMLButtonElement>(null);

  const { items } = useCarrito();
  const totalProductos = items.length;

  const rutaActual = `${location.pathname}${location.search}${location.hash}`;

  const consultaActual =
    location.pathname === "/buscar"
      ? (new URLSearchParams(location.search).get("q") ?? "")
      : "";

  const busqueda =
    busquedaEditada?.ruta === rutaActual
      ? busquedaEditada.texto
      : consultaActual;

  function actualizarBusqueda(texto: string) {
    setBusquedaEditada({
      ruta: rutaActual,
      texto,
    });
  }

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  function buscarProducto(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const termino = busqueda.trim();

    if (!termino) return;

    cerrarMenu();
    navigate(`/buscar?q=${encodeURIComponent(termino)}`);
  }

  return (
    <>
      <div className="announcement">Tus electrodomésticos, a solo un clic</div>

      <header
        className="header"
        onKeyDown={(event) => {
          if (event.key === "Escape" && menuAbierto) {
            cerrarMenu();
            botonMenuRef.current?.focus();
          }
        }}
      >
        <div className="header__contenido">
          <Link
            className="header__logo"
            to="/"
            onClick={cerrarMenu}
            aria-label="Click Casa, ir al inicio"
          >
            <img
              src={rutaPublica("/images/logo-click-casa.webp")}
              alt="Click Casa"
              className="header__logo-imagen"
            />
          </Link>

          <form
            className="header__buscador"
            role="search"
            onSubmit={buscarProducto}
          >
            <input
              type="search"
              value={busqueda}
              onChange={(event) => actualizarBusqueda(event.target.value)}
              placeholder="¿Qué producto estás buscando?"
              aria-label="Buscar productos"
              maxLength={100}
            />

            <button type="submit" aria-label="Buscar productos">
              <Search size={21} aria-hidden="true" />
            </button>
          </form>

          <Link
            className="header__carrito"
            to="/carrito"
            onClick={cerrarMenu}
            aria-label={`Carrito con ${totalProductos} productos`}
          >
            <ShoppingCart size={24} aria-hidden="true" />
            <span>Carrito</span>

            {totalProductos > 0 && (
              <span className="header__contador">{totalProductos}</span>
            )}
          </Link>

          <button
            ref={botonMenuRef}
            className="header__menu-boton"
            type="button"
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuAbierto}
            aria-controls="menu-movil"
            onClick={() => setMenuAbierto((abierto) => !abierto)}
          >
            {menuAbierto ? (
              <X size={24} aria-hidden="true" />
            ) : (
              <Menu size={24} aria-hidden="true" />
            )}
          </button>
        </div>

        <nav className="header__nav" aria-label="Navegación principal">
          <div className="header__nav-contenido">
            {enlaces.map((enlace) => (
              <Link key={enlace.href} to={enlace.href}>
                {enlace.texto}
              </Link>
            ))}
          </div>
        </nav>

        <nav
          className="menu-movil"
          id="menu-movil"
          aria-label="Navegación móvil"
          hidden={!menuAbierto}
        >
          {enlaces.map((enlace) => (
            <Link key={enlace.href} to={enlace.href} onClick={cerrarMenu}>
              {enlace.texto}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}

export default Header;
