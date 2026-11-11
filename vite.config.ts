import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export default defineConfig(({ command, isPreview }) => ({
  plugins: [
    react(),
    {
      name: "static-preview-navigation",
      configurePreviewServer(server) {
        const root = path.resolve(
          server.config.root,
          server.config.build.outDir,
        );
        const base = server.config.base;
        server.middlewares.use((req, res, next) => {
          if (!req.url || !["GET", "HEAD"].includes(req.method ?? ""))
            return next();
          const url = new URL(req.url, "http://localhost");
          if (!url.pathname.startsWith(base)) return next();
          let relativa: string;
          try {
            relativa = decodeURIComponent(url.pathname.slice(base.length));
          } catch {
            return next();
          }
          const destino = path.resolve(root, relativa);
          if (destino !== root && !destino.startsWith(root + path.sep))
            return next();
          if (
            !url.pathname.endsWith("/") &&
            existsSync(path.join(destino, "index.html"))
          ) {
            res.writeHead(308, { Location: url.pathname + "/" + url.search });
            return res.end();
          }
          next();
        });
        // Match Pages behavior: serve its custom 404 with a 404 status, not a soft 200.
        return () =>
          server.middlewares.use((req, res, next) => {
            if (
              !req.url ||
              !["GET", "HEAD"].includes(req.method ?? "") ||
              !req.headers.accept?.includes("text/html")
            )
              return next();
            // Vite's HTML fallback may have rewritten a directory to index.html.
            // Let its HTML middleware serve that existing file before handling unknown routes.
            try {
              const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
              const requested = path.resolve(root, "." + pathname);
              if (requested.startsWith(root + path.sep) && existsSync(requested)) return next();
            } catch { return next(); }
            const fallback = path.join(root, "404.html");
            if (!existsSync(fallback)) return next();
            res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
            res.end(req.method === "HEAD" ? undefined : readFileSync(fallback));
          });
      },
    },
  ],

  // GitHub Pages utiliza una ruta base diferente.
  base: process.env.GITHUB_PAGES === "true" ||
    (isPreview && existsSync("dist/index.html") && readFileSync("dist/index.html", "utf8").includes('src="/click-casa/assets/'))
    ? "/click-casa/" : "/",

  // Desarrollo: SPA para permitir recargar rutas de React Router.
  // Preview y compilación: MPA para servir el HTML prerenderizado.
  appType: command === "serve" && !isPreview ? "spa" : "mpa",

  build: {
    manifest: true,
  },

  ssr: {
    noExternal: ["react-router"],
  },
}));
