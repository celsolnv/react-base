import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import * as Sentry from "@sentry/browser";
import { createRouter } from "@tanstack/react-router";

import type { IRouterContext } from "./app/__root";
import LoadingScreen from "./components/layouts/loading-screen";
import { queryClient } from "./lib/query-client";
import { App } from "./App";
import { routeTree } from "./routeTree.gen";

import "./global.css";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  sendDefaultPii: true,
});

export const router = createRouter({
  routeTree,
  context: undefined! as IRouterContext,
  defaultPendingComponent: LoadingScreen,
  defaultPendingMs: 0,
  defaultPendingMinMs: 1000,
});

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App router={router} queryClient={queryClient} />
    </StrictMode>
  );
}
