import { createServer } from "vite";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse, parseFragment, serialize } from "parse5";

const raiz = process.cwd();

function obtenerAtributo(nodo, nombre) {
  return nodo.attrs?.find((atributo) => atributo.name === nombre)?.value;
}

function buscarElemento(nodo, nombre, id) {
  if (nodo.tagName === nombre && (!id || obtenerAtributo(nodo, "id") === id)) {
    return nodo;
  }

  for (const hijo of nodo.childNodes ?? []) {
    const encontrado = buscarElemento(hijo, nombre, id);

    if (encontrado) return encontrado;
  }

  return null;
}

function esMetadataSEO(nodo) {
  if (nodo.tagName === "title") return true;

  if (nodo.tagName === "meta") {
    return ["description", "robots"].includes(
      obtenerAtributo(nodo, "name")?.toLowerCase(),
    );
  }

  if (nodo.tagName === "link") {
    return obtenerAtributo(nodo, "rel")
      ?.toLowerCase()
      .split(/\s+/)
      .includes("canonical");
  }

  return false;
}

function generarDocumento(plantilla, htmlReact) {
  const documento = parse(plantilla);

  const head = buscarElemento(documento, "head");
  const root = buscarElemento(documento, "div", "root");

  if (!head || !root) {
    throw new Error("No se encontró <head> o <div id='root'>.");
  }

  const fragmento = parseFragment(htmlReact);

  // Extraer los metadatos generados por React.
  const metadataReact = [];

  function extraerMetadata(nodo) {
    for (const hijo of [...(nodo.childNodes ?? [])]) {
      if (esMetadataSEO(hijo)) {
        const indice = nodo.childNodes.indexOf(hijo);

        nodo.childNodes.splice(indice, 1);
        metadataReact.push(hijo);
      } else {
        extraerMetadata(hijo);
      }
    }
  }

  extraerMetadata(fragmento);

  // Evitar duplicados entre la plantilla y React.
  // Si React no genera una etiqueta SEO, se conserva
  // la correspondiente de la plantilla.
  if (metadataReact.length > 0) {
    const tiposReact = new Set(
      metadataReact.map((nodo) => {
        if (nodo.tagName === "title") return "title";

        if (nodo.tagName === "meta") {
          return `meta:${obtenerAtributo(nodo, "name")?.toLowerCase()}`;
        }

        return "canonical";
      }),
    );

    head.childNodes = head.childNodes.filter((nodo) => {
      if (!esMetadataSEO(nodo)) return true;

      const tipo =
        nodo.tagName === "title"
          ? "title"
          : nodo.tagName === "meta"
            ? `meta:${obtenerAtributo(nodo, "name")?.toLowerCase()}`
            : "canonical";

      return !tiposReact.has(tipo);
    });

    for (const nodo of metadataReact) {
      nodo.parentNode = head;
      head.childNodes.push(nodo);
    }
  }

  // Insertar el HTML renderizado dentro de #root.
  root.childNodes = fragmento.childNodes;

  for (const hijo of root.childNodes) {
    hijo.parentNode = root;
  }

  return serialize(documento);
}

const servidor = await createServer({
  configFile: path.join(raiz, "vite.config.ts"),
  server: {
    middlewareMode: true,
  },
  appType: "custom",
});

try {
  const { render } = await servidor.ssrLoadModule("/src/entry-server.tsx");

  const { productos } = await servidor.ssrLoadModule("/src/data/productos.ts");

  const { categoriasProducto } = await servidor.ssrLoadModule(
    "/src/data/categoriasProducto.ts",
  );

  // Rutas activas de Click Casa.
  const rutas = [
    "/",
    ...categoriasProducto.map((categoria) => `/catalogo/${categoria.slug}`),
    ...productos.map((producto) => `/productos/${producto.id}`),
  ];

  const rutasUnicas = [...new Set(rutas)];

  const plantilla = await readFile(
    path.join(raiz, "dist", "index.html"),
    "utf8",
  );

  for (const ruta of rutasUnicas) {
    const htmlReact = await render(ruta);

    if (typeof htmlReact !== "string" || !htmlReact.trim()) {
      throw new Error(`El renderizado de ${ruta} no produjo HTML válido.`);
    }

    const html = generarDocumento(plantilla, htmlReact);

    const destino =
      ruta === "/"
        ? path.join(raiz, "dist", "index.html")
        : path.join(raiz, "dist", ruta.slice(1), "index.html");

    await mkdir(path.dirname(destino), {
      recursive: true,
    });

    await writeFile(destino, html, "utf8");

    console.log(`Prerenderizado: ${ruta}`);
  }

  console.log(`Prerenderizado completado: ${rutasUnicas.length} rutas.`);
} finally {
  await servidor.close();
}
