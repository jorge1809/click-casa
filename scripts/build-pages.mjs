import { spawnSync } from "node:child_process";
if (!process.env.npm_execpath) throw new Error("Ejecuta este comando con npm run build:pages.");
const env = {...process.env, GITHUB_PAGES: "true"};
for (const script of ["build", "check:release"]) {
  const result = spawnSync(process.execPath, [process.env.npm_execpath, "run", script], {env, stdio:"inherit"});
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
