import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./index";

describe("Breadcrumb Component", () => {
  it("renders Breadcrumb component", () => {
    render(<Breadcrumb data-testid="breadcrumb" />);
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
  });

  it("renders BreadcrumbList component", () => {
    render(<BreadcrumbList data-testid="breadcrumb-list" />);
    expect(screen.getByTestId("breadcrumb-list")).toBeInTheDocument();
  });

  it("renders BreadcrumbItem component", () => {
    render(<BreadcrumbItem data-testid="breadcrumb-item" />);
    expect(screen.getByTestId("breadcrumb-item")).toBeInTheDocument();
  });

  it("renders BreadcrumbLink component", () => {
    render(
      <BreadcrumbLink href="#" data-testid="breadcrumb-link">
        Link
      </BreadcrumbLink>
    );
    expect(screen.getByTestId("breadcrumb-link")).toBeInTheDocument();
    expect(screen.getByText("Link")).toHaveAttribute("href", "#");
  });

  it("renders BreadcrumbPage component", () => {
    render(<BreadcrumbPage data-testid="breadcrumb-page">Page</BreadcrumbPage>);
    expect(screen.getByTestId("breadcrumb-page")).toBeInTheDocument();
    expect(screen.getByText("Page")).toHaveAttribute("aria-current", "page");
  });

  it("renders BreadcrumbSeparator component with default separator", () => {
    render(<BreadcrumbSeparator data-testid="breadcrumb-separator" />);
    expect(screen.getByTestId("breadcrumb-separator")).toBeInTheDocument();
    expect(
      screen.getByTestId("breadcrumb-separator").querySelector("svg")
    ).toBeInTheDocument();
  });

  it("renders BreadcrumbSeparator component with custom separator", () => {
    render(
      <BreadcrumbSeparator data-testid="breadcrumb-separator">
        /
      </BreadcrumbSeparator>
    );
    expect(screen.getByTestId("breadcrumb-separator")).toHaveTextContent("/");
  });

  it("renders BreadcrumbEllipsis component", () => {
    render(<BreadcrumbEllipsis data-testid="breadcrumb-ellipsis" />);
    expect(screen.getByTestId("breadcrumb-ellipsis")).toBeInTheDocument();
    expect(screen.getByText("More")).toHaveClass("sr-only");
  });
});
