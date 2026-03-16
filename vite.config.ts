import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
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
    tsconfigPaths(),
  ].filter(Boolean),
  resolve: {
    alias: [
      {
        find: /^@\/ui\/(.*)$/,
        replacement: path.resolve(__dirname, "./src/components/ui/$1"),
      },
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src"),
      },
      {
        find: "moment/min/moment-with-locales",
        replacement: "moment",
      },
    ],
  },
  test: {
    globals: true,
    environment: "jsdom",
    pool: "threads",
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
      exclude: [
        "**/*.spec.{js,ts,jsx,tsx}",
        "src/routeTree.gen.ts",
        "src/modules/template-base/**",
        "src/app/**",
      ],
    },
  },
}));
