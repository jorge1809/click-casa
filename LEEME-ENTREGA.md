# Click Casa — versión corregida

Preparada el 11 de noviembre de 2026 a partir de ClickCasa.zip. Se trabajó en una copia; el ZIP y el proyecto original del escritorio permanecen intactos. Este paquete no se ha publicado.

## Abrir y ejecutar

Extrae el ZIP en una carpeta nueva. No combines sus archivos con una carpeta que conserve un dist o node_modules antiguo. Incluye las fotografías originales suministradas; no es necesario descargarlas.

Requisito: Node.js 22.12 o posterior compatible (CI usa Node 22; instalación limpia y comprobaciones locales realizadas con Node 24.19.0).

```text
npm ci
npm run dev
```

Para compilar para el repositorio GitHub Pages `jorge1809/click-casa`:

```text
npm run lint
npm run build:pages
npm run preview
```

La vista previa detecta automáticamente la base `/click-casa/` del dist. El comando `build:pages` configura la base y ejecuta la validación de entrega. Para un hosting en la raíz, ajusta `.env.production` al dominio definitivo y utiliza `npm run build`. No subas el ZIP directamente como sitio: publica el contenido de dist o usa el workflow incluido. No se realizó ningún push ni despliegue durante esta corrección.

## Cambios incluidos

- Sin carrito activo, botones de compra, ordenación por precio, precios ficticios en el catálogo ni ofertas monetarias en JSON-LD. Las rutas antiguas `/carrito` y `/pedido` redirigen al inicio dentro de la app y tienen entradas estáticas con meta refresh.
- Cuatro líneas de teléfono con enlaces de llamada y etiquetas Tigo/Claro. WhatsApp usa **+505 8998 8018**, confirmado por el propietario.
- Botón Maps con el enlace exacto solicitado. Iframe actualizado a las coordenadas del establecimiento resueltas desde ese enlace: **12.1249055, -86.2404934**. Se retiró la dirección específica antigua, cuya correspondencia no estaba acreditada; el texto remite al mapa verificado.
- Lema exacto «Tus electrodomésticos a tan solo un click» y párrafo comercial completo con «hogar y/o Negocio». Lista independiente de 24 marcas reales del catálogo, sin «Sin especificar».
- Eliminadas las 69 descripciones de demostración. Se incorporó texto de consulta basado en el nombre de cada producto, sin inventar especificaciones, garantías, capacidades o stock. Disponibilidad pasa a «Consultar disponibilidad» hasta que el negocio aporte inventario fiable.
- Revisadas las 260 fotos y seleccionada manualmente la mejor imagen principal disponible por producto. Se conservaron todas las fotos originales en las galerías, sin generar fotografías de equipos.
- SSR en modo producción; canonical, sitemap, robots y URLs de schema con origen y base correctos. URLs SEO con barra final coherente con directorios estáticos. Búsqueda con metadata explícita y noindex, entrada estática e hidratación compatible con parámetros de búsqueda.
- Custom 404 para Pages, que conserva estado 404; vista previa con redirección de directorios y fallback equivalente. Las recargas de búsqueda y las rutas prerenderizadas funcionan en las pruebas locales.
- Carrusel de categorías manual, sin temporizador automático. Enlace para saltar al contenido, foco en main al cambiar de página, anclas sin compensación de header fijo y ARIA del footer coherente con móvil/escritorio. Galería con retorno de foco, bloqueo del scroll de fondo y controles de teclado sin reiniciar foco al cambiar de foto.
- Imagen de contacto reducida de 1.815.032 a 199.545 bytes; favicon de 1.063.481 a 7.112 bytes. Retirados de public el ZIP de trabajo y recursos gráficos reemplazados. Se usa tipografía de sistema, sin petición a Google Fonts. CSS/bundle inicial reducidos; no se atribuyen puntuaciones Lighthouse sin medir.
- Dependencias actualizadas con lockfile; override de minimatch corregido. `npm audit` reportó **0 vulnerabilidades** al validar el paquete. No significa ausencia absoluta de vulnerabilidades presentes o futuras.
- Check de entrega en CI: valida textos, teléfonos, mapa, 84 URLs de sitemap, canonical, recursos con casing exacto, noindex de búsqueda, ausencia de precios/demo y entradas estáticas necesarias.

## Pendientes reales antes de aprobación comercial

1. **Fotografías:** `FOTOS-PENDIENTES.csv` identifica **35 productos** que todavía requieren foto frontal del equipo completo, cerrado y/o aislado, o revisión de la perspectiva. Algunos solo tienen fotos de cajas; otros fotos laterales, equipos abiertos o varios artículos juntos. Se seleccionó la mejor foto existente y NO se considera que esos casos cumplan el requisito al 100 %. `REVISION-FOTOGRAFIAS.json` registra la selección de los 69 productos. Esta lista es conservadora y requiere aceptación editorial del cliente incluso para las fotos seleccionadas restantes.
2. **Fichas y stock:** el cliente debe aportar características/modelos faltantes, disponibilidad real y confirmar la marca del producto ID 3. No se afirmó una marca no acreditada. Las descripciones actuales son neutrales de consulta; no sustituyen fichas técnicas verificadas.
3. **Aceptación final:** verificar el establecimiento, los cuatro teléfonos y el sitio publicado desde dispositivos reales. No se hicieron llamadas ni se enviaron mensajes. Revisar condiciones reales de garantías y entregas que ya figuraban en la web.
4. **Calidad en producción:** falta medir Core Web Vitals en condiciones reales y realizar revisión formal con lector de pantalla. La validación local responsive no es una certificación WCAG. No se da por aprobado el entregable comercial mientras los pendientes anteriores sigan abiertos.

## Evidencia incluida

- `VALIDACION-BUILD.json`: verificación de 88 HTML (84 indexables, búsqueda, dos rutas retiradas y 404), 69 productos y 84 URLs de sitemap.
- `VALIDACION-NPM.json`: consulta de vulnerabilidades con resultado cero durante la preparación.
- `VALIDACION-HTTP.json`: comprobaciones HTTP locales de páginas, búsqueda, rutas retiradas y 404.
- `scripts/check-release.mjs`: comprobación repetible con `npm run check:release`, después de compilar.
- `dist/`: compilación preparada para GitHub Pages `/click-casa/`.

No se incluyen node_modules ni historia Git. npm ci reconstruye las dependencias a partir del lockfile. Mantén el proyecto original como respaldo y revisa este paquete antes de reemplazarlo o publicarlo.
