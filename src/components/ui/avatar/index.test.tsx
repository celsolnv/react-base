import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Avatar, AvatarFallback, AvatarImage } from "./index";

describe("Avatar Component", () => {
  it("should render Avatar with image", () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/image.jpg" alt="User Avatar" />
        <AvatarFallback>UA</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText("UA")).toBeInTheDocument();
  });

  it("should render AvatarFallback when image is not provided", () => {
    render(
      <Avatar>
        <AvatarFallback>UA</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText("UA")).toBeInTheDocument();
  });
});
