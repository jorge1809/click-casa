import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";

import App from "./App";
import CarritoProvider from "./context/CarritoProvider";

export function render(url: string): string {
  const basename = import.meta.env.BASE_URL;

  return renderToString(
    <StaticRouter
      location={`${basename.replace(/\/$/, "")}${url}`}
      basename={basename}
    >
      <CarritoProvider>
        <App />
      </CarritoProvider>
    </StaticRouter>,
  );
}
