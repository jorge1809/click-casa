import type { ReactNode } from "react";

interface DocumentoHTMLProps {
  children: ReactNode;
}

function DocumentoHTML({ children }: DocumentoHTMLProps) {
  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#334239" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>

      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}

export default DocumentoHTML;
