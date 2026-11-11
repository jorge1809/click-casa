import { productos } from "../../data/productos";
import "./Marcas.css";
const marcas = [
  ...new Set(
    productos.map((p) => p.marca).filter((m) => m && m !== "Sin especificar"),
  ),
].sort((a, b) => a.localeCompare(b, "es"));
export default function Marcas() {
  return (
    <section className="marcas" aria-labelledby="marcas-titulo">
      <h2 id="marcas-titulo">Nuestras marcas</h2>
      <ul>
        {marcas.map((marca) => (
          <li key={marca}>{marca}</li>
        ))}
      </ul>
    </section>
  );
}
