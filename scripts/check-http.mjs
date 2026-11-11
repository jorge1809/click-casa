import assert from "node:assert/strict";
import fs from "node:fs";
const origen = process.argv[2] ?? "http://127.0.0.1:4181/click-casa/";
const validacion = JSON.parse(fs.readFileSync("VALIDACION-BUILD.json", "utf8"));
const resultados = [];
for (const { ruta } of validacion.resultados) {
  const relativa = ruta.replace(/index\.html$/, "");
  const response = await fetch(new URL(relativa, origen), { headers: { Accept: "text/html" } });
  assert.equal(response.status, 200, relativa);
  resultados.push({ ruta: relativa, estado: response.status });
}
for (const ruta of ["buscar?q=Hisense", "catalogo/refrigeradoras", "productos/2", "carrito", "pedido"]) {
  const response = await fetch(new URL(ruta, origen), { redirect: "manual", headers: { Accept: "text/html" } });
  assert.equal(response.status, 308, ruta);
  assert(response.headers.get("location")?.includes("/"));
  resultados.push({ruta,estado:response.status,destino:response.headers.get("location")});
}
for (const ruta of ["productos/999999", "ruta-inexistente"]) {
  const response = await fetch(new URL(ruta, origen), { headers: { Accept: "text/html" } });
  const html = await response.text();
  assert.equal(response.status, 404, ruta);
  assert(html.includes('id="root"'));
  assert(html.includes("noindex, follow"));
  resultados.push({ruta,estado:response.status});
}
fs.writeFileSync("VALIDACION-HTTP.json", JSON.stringify({fecha:new Date().toISOString(),origen,resultados},null,2));
console.log(`HTTP: ${resultados.length} comprobaciones correctas, incluidas redirecciones y 404.`);
