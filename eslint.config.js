import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  {
    // Ignores globais
    ignores: [
      "dist",
      "src/modules/template-base/**",
      "**/*.spec.ts",
      "**/*.spec.tsx",
      "**/*.test.ts",
      "**/*.test.tsx",
      "vite.config.ts",
      "vite-env.d.ts",
      "generate-module.mjs",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ["./tsconfig.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "simple-import-sort": simpleImportSort,
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react", "^@react"],
            ["^@?\\w"],
            ["^@/"],
            [
              "^\\.\\.(?!/?$)",
              "^\\.\\./?$",
              "^\\./(?=.*/)(?!/?$)",
              "^\\.(?!/?$)",
              "^\\./?$",
            ],
            ["^.+\\.?(css|less|scss|sass|styl)$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          selector: "interface",
          format: ["PascalCase"],
          custom: { regex: "^I[A-Z]", match: true },
        },
        {
          selector: "typeAlias",
          format: ["PascalCase"],
          custom: { regex: "^T[A-Z]", match: true },
        },
      ],
      "prettier/prettier": "warn",
    },
  },
  eslintConfigPrettier
);
