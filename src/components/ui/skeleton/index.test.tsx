import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Skeleton } from "./index";

describe("Skeleton component", () => {
  it("should render without crashing", () => {
    const { container } = render(<Skeleton />);
    expect(container).toBeInTheDocument();
  });

  it("should render children correctly", () => {
    render(<Skeleton>Loading...</Skeleton>);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
