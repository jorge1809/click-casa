import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";

import App from "./App";

export function render(url: string): string {
  const basename = import.meta.env.BASE_URL;

  return renderToString(
    <StaticRouter
      location={`${basename.replace(/\/$/, "")}${url}`}
      basename={basename}
    >
      <App />
    </StaticRouter>,
  );
}
