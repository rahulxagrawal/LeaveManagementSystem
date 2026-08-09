import { defineConfig, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// The assignment requires App.js/index.js, so this small pre-transform lets
// Vite read JSX syntax inside .js files without changing the required names.
function jsxInJs() {
  return {
    name: "jsx-in-js",
    enforce: "pre",
    async transform(code, id) {
      if (id.includes("/src/") && id.endsWith(".js")) {
        return transformWithEsbuild(code, id, {
          loader: "jsx",
          jsx: "automatic"
        });
      }
    }
  };
}

export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx"
      }
    }
  },
  plugins: [
    jsxInJs(),
    react(),
    tailwindcss()
  ]
});
