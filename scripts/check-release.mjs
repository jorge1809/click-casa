import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { parse } from "parse5";

const raiz = process.cwd(),
  dist = path.join(raiz, "dist");
const caminar = (d) =>
  fs
    .readdirSync(d, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? caminar(path.join(d, e.name)) : [path.join(d, e.name)],
    );
const archivos = caminar(dist),
  exactos = new Set(
    archivos.map((f) => path.relative(dist, f).replaceAll("\\", "/")),
  );
const htmls = archivos.filter((f) => f.endsWith(".html"));
const sitio = new URL(
  fs
    .readFileSync(".env.production", "utf8")
    .match(/^VITE_SITE_URL=(.+)$/m)[1]
    .trim(),
);
assert.equal(sitio.protocol, "https:");
const base = fs.readFileSync(path.join(dist, "index.html"), "utf8").includes('src="/click-casa/assets/') ? "/click-casa/" : "/";
let productos = 0,
  indexables = 0;
const resultados = [];
for (const f of htmls) {
  const html = fs.readFileSync(f, "utf8");
  const nodos = [];
  function recorrer(n) {
    nodos.push(n);
    for (const c of n.childNodes ?? []) recorrer(c);
  }
  recorrer(parse(html));
  const attr = (n, k) => n.attrs?.find((a) => a.name === k)?.value;
  const texto = (n) =>
    (n.childNodes ?? []).map((c) => c.value ?? texto(c)).join("");
  const canonical = nodos.find(
    (n) => n.tagName === "link" && attr(n, "rel") === "canonical",
  );
  const noindex = nodos.some(
    (n) =>
      n.tagName === "meta" &&
      attr(n, "name") === "robots" &&
      attr(n, "content")?.includes("noindex"),
  );
  const ruta = path.relative(dist, f).replaceAll("\\", "/");
  assert(
    !/Lorem ipsum|Producto de demostración|precioUSD|"price"\s*:|"offers"\s*:/i.test(
      html,
    ),
    `Contenido prohibido: ${ruta}`,
  );
  assert(
    !/localhost|127\.0\.0\.1|rm-muebleria/.test(html),
    `URL de entorno incorrecta: ${ruta}`,
  );
  if (!noindex) {
    indexables++;
    assert(canonical, `Sin canonical: ${ruta}`);
    const u = new URL(attr(canonical, "href"));
    assert.equal(u.origin, sitio.origin);
    assert(u.pathname.startsWith(sitio.pathname), `Base incorrecta: ${u}`);
    assert.equal(
      nodos.filter((n) => n.tagName === "h1").length,
      1,
      `H1 incorrecto: ${ruta}`,
    );
  }
  for (const n of nodos) {
    const u = ["img", "script"].includes(n.tagName)
      ? attr(n, "src")
      : n.tagName === "link" &&
          ["stylesheet", "icon", "modulepreload"].includes(attr(n, "rel"))
        ? attr(n, "href")
        : null;
    if (!u || !u.startsWith("/")) continue;
    assert(u.startsWith(base), `Recurso fuera de base: ${u}`);
    const relativa = decodeURIComponent(u.slice(base.length).split("?")[0]);
    assert(exactos.has(relativa), `Recurso ausente/casing: ${u} en ${ruta}`);
  }
  if (ruta.startsWith("productos/")) {
    productos++;
    const schemas = nodos
      .filter(
        (n) =>
          n.tagName === "script" && attr(n, "type") === "application/ld+json",
      )
      .map((n) => JSON.parse(texto(n)));
    const product = schemas.find((s) => s["@type"] === "Product");
    assert(product, `Sin schema: ${ruta}`);
    assert(!product.offers);
    assert(!product.price);
    assert(product.url.startsWith(sitio.href));
    for (const imagen of product.image ?? [])
      assert(
        imagen.startsWith(sitio.href),
        `Imagen schema fuera de base: ${imagen}`,
      );
  }
  assert(
    !nodos.some(
      (n) => n.tagName === "button" && /Agregar al carrito/.test(texto(n)),
    ),
    `Carrito expuesto: ${ruta}`,
  );
  resultados.push({
    ruta,
    noindex,
    canonical: canonical ? attr(canonical, "href") : null,
  });
}
assert.equal(productos, 69);
assert.equal(indexables, 84);
const inicio = parse(fs.readFileSync(path.join(dist, "index.html"), "utf8"));
function contenido(n) {
  return n.value ?? (n.childNodes ?? []).map(contenido).join(" ");
}
const textoInicio = contenido(inicio).replace(/\s+/g, " ");
for (const requerido of [
  "Tus electrodomésticos a tan solo un click",
  "Encuentra los electrodomésticos ideales para tu hogar y/o Negocio. Te ayudamos a comparar modelos, consultar precios, verificar disponibilidad y conocer las opciones de entrega.",
  "+505 8998 8018",
  "+505 8285 0123",
  "+505 8910 1397",
  "+505 8822 8233",
  "Nuestras marcas",
])
  assert(textoInicio.includes(requerido), `Texto ausente: ${requerido}`);
const htmlInicio = fs.readFileSync(path.join(dist, "index.html"), "utf8");
assert(htmlInicio.includes("https://maps.app.goo.gl/r5uJuemw6VAEdALv6"));
assert(htmlInicio.includes("12.1249055,-86.2404934"));
const sitemap = fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
assert.equal(locs.length, 84);
for (const loc of locs) {
  assert(loc.startsWith(sitio.href), `Sitemap fuera de base: ${loc}`);
  const rel = new URL(loc).pathname.slice(sitio.pathname.length);
  assert(
    fs.existsSync(path.join(dist, decodeURIComponent(rel), "index.html")),
    `Sitemap sin página: ${loc}`,
  );
}
assert(
  fs
    .readFileSync(path.join(dist, "robots.txt"), "utf8")
    .includes(new URL("sitemap.xml", sitio).href),
);
for (const requerido of [
  "buscar/index.html",
  "carrito/index.html",
  "pedido/index.html",
  "404.html",
])
  assert(exactos.has(requerido));
for (const p of ["carrito", "pedido"])
  assert(
    fs
      .readFileSync(path.join(dist, p, "index.html"), "utf8")
      .includes(`0;url=${base}`),
  );
const resumen = {
  fecha: new Date().toISOString(),
  html: htmls.length,
  indexables,
  productos,
  urlsSitemap: locs.length,
  recursosVerificados: true,
  preciosPublicos: false,
  resultados,
};
fs.writeFileSync("VALIDACION-BUILD.json", JSON.stringify(resumen, null, 2));
console.log(
  `Release verificada: ${htmls.length} HTML, ${indexables} páginas indexables, ${productos} productos, ${locs.length} URLs válidas. Sin precios ni contenido de prueba.`,
);
