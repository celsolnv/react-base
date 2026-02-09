import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./index";

describe("Card Component", () => {
  it("renders card with all its subcomponents", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content goes here</p>
        </CardContent>
        <CardFooter>
          <p>Card footer</p>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText("Card Title")).toBeInTheDocument();
    expect(screen.getByText("Card Description")).toBeInTheDocument();
    expect(screen.getByText("Card content goes here")).toBeInTheDocument();
    expect(screen.getByText("Card footer")).toBeInTheDocument();
  });

  it("forwards refs correctly to each component", () => {
    const cardRef = { current: null };
    const headerRef = { current: null };
    const titleRef = { current: null };
    const descriptionRef = { current: null };
    const contentRef = { current: null };
    const footerRef = { current: null };

    render(
      <Card ref={cardRef}>
        <CardHeader ref={headerRef}>
          <CardTitle ref={titleRef}>Title</CardTitle>
          <CardDescription ref={descriptionRef}>Description</CardDescription>
        </CardHeader>
        <CardContent ref={contentRef}>Content</CardContent>
        <CardFooter ref={footerRef}>Footer</CardFooter>
      </Card>
    );

    expect(cardRef.current).not.toBeNull();
    expect(headerRef.current).not.toBeNull();
    expect(titleRef.current).not.toBeNull();
    expect(descriptionRef.current).not.toBeNull();
    expect(contentRef.current).not.toBeNull();
    expect(footerRef.current).not.toBeNull();
  });
});
