import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/globals.css"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["react", "react-dom"],
  injectStyle: false,
});
