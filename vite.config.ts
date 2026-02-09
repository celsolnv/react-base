import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default defineConfig(({ mode }) => ({
  logLevel: "info", // Alterado para 'info' para mais detalhes em desenvolvimento
  server: {
    host: "::",
    port: 5555,
    open: true, // Abre o navegador automaticamente ao iniciar o servidor
  },
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory: "./src/app",
      // Vai ignorar arquivos com prefixo .ts
      routeFileIgnorePattern: ".ts$",
    }),
    react(),
    tailwindcss(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],

    css: true, // Ignore CSS files in tests
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    typecheck: {
      tsconfig: "./tsconfig.spec.json",
    },
    coverage: {
      reporter: ["lcov", "text"],
      provider: "v8",
      reportsDirectory: "coverage",
      all: true, // Incluindo todos os arquivos na cobertura
      include: ["src/**/*.{js,ts,jsx,tsx}"],
      exclude: ["**/*.spec.{js,ts,jsx,tsx}"],
    },
  },
}));
