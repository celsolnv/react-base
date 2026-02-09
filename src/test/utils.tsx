import React from "react";
import { BrowserRouter } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { TooltipProvider } from "@/components/ui/tooltip";

// Mock SidebarProvider para não depender de window.matchMedia
const MockSidebarProvider = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="mock-sidebar-provider">{children}</div>;
};

// Create a query client for testing
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Create a wrapper with all application providers
export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MockSidebarProvider>
          <BrowserRouter>{ui}</BrowserRouter>
        </MockSidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

// Make vi available
export { vi };

// Re-export everything from testing-library
export * from "@testing-library/react";
export { userEvent };
