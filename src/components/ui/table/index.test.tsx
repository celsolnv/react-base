import * as React from "react";

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./index";

describe("Table Component", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Table", () => {
    it("should render table element", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
    });

    it("should wrap table in div with correct classes", () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.tagName).toBe("DIV");
      expect(wrapper).toHaveClass(
        "border-border",
        "relative",
        "w-full",
        "overflow-auto",
        "rounded-lg",
        "border"
      );
    });

    it("should apply default classes to table element", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const table = screen.getByRole("table");
      expect(table).toHaveClass("w-full", "caption-bottom", "text-sm");
    });

    it("should apply custom className", () => {
      render(
        <Table className="custom-table-class">
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const table = screen.getByRole("table");
      expect(table).toHaveClass("custom-table-class");
    });

    it("should forward ref to table element", () => {
      const ref = React.createRef<HTMLTableElement>();
      render(
        <Table ref={ref}>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(ref.current).not.toBeNull();
      expect(ref.current instanceof HTMLTableElement).toBe(true);
    });

    it("should forward additional props to table element", () => {
      render(
        <Table data-testid="test-table" aria-label="Test table">
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const table = screen.getByTestId("test-table");
      expect(table).toBeInTheDocument();
      expect(table).toHaveAttribute("aria-label", "Test table");
    });
  });

  describe("TableHeader", () => {
    it("should render thead element", () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );

      const header = screen.getByText("Header").closest("thead");
      expect(header).toBeInTheDocument();
    });

    it("should apply default classes", () => {
      const { container } = render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );

      const header = container.querySelector("thead");
      expect(header).toHaveClass("border-border", "border-b");
    });

    it("should apply custom className", () => {
      const { container } = render(
        <Table>
          <TableHeader className="custom-header-class">
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );

      const header = container.querySelector("thead");
      expect(header).toHaveClass("custom-header-class");
    });

    it("should forward ref to thead element", () => {
      const ref = React.createRef<HTMLTableSectionElement>();
      render(
        <Table>
          <TableHeader ref={ref}>
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );

      expect(ref.current).not.toBeNull();
      expect(ref.current instanceof HTMLTableSectionElement).toBe(true);
    });

    it("should forward additional props", () => {
      const { container } = render(
        <Table>
          <TableHeader data-testid="test-header">
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );

      const header = container.querySelector('[data-testid="test-header"]');
      expect(header).toBeInTheDocument();
    });
  });

  describe("TableBody", () => {
    it("should render tbody element", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const body = screen.getByText("Cell").closest("tbody");
      expect(body).toBeInTheDocument();
    });

    it("should apply default classes", () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const body = container.querySelector("tbody");
      expect(body).toHaveClass("[&_tr:last-child]:border-0");
    });

    it("should apply custom className", () => {
      const { container } = render(
        <Table>
          <TableBody className="custom-body-class">
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const body = container.querySelector("tbody");
      expect(body).toHaveClass("custom-body-class");
    });

    it("should forward ref to tbody element", () => {
      const ref = React.createRef<HTMLTableSectionElement>();
      render(
        <Table>
          <TableBody ref={ref}>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(ref.current).not.toBeNull();
      expect(ref.current instanceof HTMLTableSectionElement).toBe(true);
    });
  });

  describe("TableFooter", () => {
    it("should render tfoot element", () => {
      render(
        <Table>
          <TableFooter>
            <TableRow>
              <TableCell>Footer</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );

      const footer = screen.getByText("Footer").closest("tfoot");
      expect(footer).toBeInTheDocument();
    });

    it("should apply default classes", () => {
      const { container } = render(
        <Table>
          <TableFooter>
            <TableRow>
              <TableCell>Footer</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );

      const footer = container.querySelector("tfoot");
      expect(footer).toHaveClass(
        "bg-muted/50",
        "border-t",
        "font-medium",
        "[&>tr]:last:border-b-0"
      );
    });

    it("should apply custom className", () => {
      const { container } = render(
        <Table>
          <TableFooter className="custom-footer-class">
            <TableRow>
              <TableCell>Footer</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );

      const footer = container.querySelector("tfoot");
      expect(footer).toHaveClass("custom-footer-class");
    });

    it("should forward ref to tfoot element", () => {
      const ref = React.createRef<HTMLTableSectionElement>();
      render(
        <Table>
          <TableFooter ref={ref}>
            <TableRow>
              <TableCell>Footer</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );

      expect(ref.current).not.toBeNull();
      expect(ref.current instanceof HTMLTableSectionElement).toBe(true);
    });
  });

  describe("TableRow", () => {
    it("should render tr element", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const row = screen.getByText("Cell").closest("tr");
      expect(row).toBeInTheDocument();
    });

    it("should apply default classes", () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const row = container.querySelector("tr");
      expect(row).toHaveClass(
        "hover:bg-muted/50",
        "data-[state=selected]:bg-muted",
        "border-b",
        "transition-colors"
      );
    });

    it("should apply custom className", () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow className="custom-row-class">
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const row = container.querySelector("tr");
      expect(row).toHaveClass("custom-row-class");
    });

    it("should forward ref to tr element", () => {
      const ref = React.createRef<HTMLTableRowElement>();
      render(
        <Table>
          <TableBody>
            <TableRow ref={ref}>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(ref.current).not.toBeNull();
      expect(ref.current instanceof HTMLTableRowElement).toBe(true);
    });

    it("should handle data-state attribute", () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow data-state="selected">
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const row = container.querySelector("tr");
      expect(row).toHaveAttribute("data-state", "selected");
    });
  });

  describe("TableHead", () => {
    it("should render th element", () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );

      const head = screen.getByText("Header");
      expect(head.tagName).toBe("TH");
      expect(head).toBeInTheDocument();
    });

    it("should apply default classes", () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );

      const head = screen.getByText("Header");
      expect(head).toHaveClass(
        "text-muted-foreground",
        "h-12",
        "px-4",
        "text-left",
        "align-middle",
        "font-medium"
      );
    });

    it("should apply custom className", () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="custom-head-class">Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );

      const head = screen.getByText("Header");
      expect(head).toHaveClass("custom-head-class");
    });

    it("should forward ref to th element", () => {
      const ref = React.createRef<HTMLTableCellElement>();
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead ref={ref}>Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );

      expect(ref.current).not.toBeNull();
      expect(ref.current instanceof HTMLTableCellElement).toBe(true);
    });

    it("should forward additional props", () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="col" colSpan={2}>
                Header
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );

      const head = screen.getByText("Header");
      expect(head).toHaveAttribute("scope", "col");
      expect(head).toHaveAttribute("colSpan", "2");
    });
  });

  describe("TableCell", () => {
    it("should render td element", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const cell = screen.getByText("Cell");
      expect(cell.tagName).toBe("TD");
      expect(cell).toBeInTheDocument();
    });

    it("should apply default classes", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const cell = screen.getByText("Cell");
      expect(cell).toHaveClass("p-4", "align-middle");
    });

    it("should apply custom className", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="custom-cell-class">Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const cell = screen.getByText("Cell");
      expect(cell).toHaveClass("custom-cell-class");
    });

    it("should forward ref to td element", () => {
      const ref = React.createRef<HTMLTableCellElement>();
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell ref={ref}>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(ref.current).not.toBeNull();
      expect(ref.current instanceof HTMLTableCellElement).toBe(true);
    });

    it("should forward additional props", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2} rowSpan={3}>
                Cell
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const cell = screen.getByText("Cell");
      expect(cell).toHaveAttribute("colSpan", "2");
      expect(cell).toHaveAttribute("rowSpan", "3");
    });
  });

  describe("TableCaption", () => {
    it("should render caption element", () => {
      render(
        <Table>
          <TableCaption>Table Caption</TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const caption = screen.getByText("Table Caption");
      expect(caption.tagName).toBe("CAPTION");
      expect(caption).toBeInTheDocument();
    });

    it("should apply default classes", () => {
      render(
        <Table>
          <TableCaption>Table Caption</TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const caption = screen.getByText("Table Caption");
      expect(caption).toHaveClass("text-muted-foreground", "mt-4", "text-sm");
    });

    it("should apply custom className", () => {
      render(
        <Table>
          <TableCaption className="custom-caption-class">
            Table Caption
          </TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const caption = screen.getByText("Table Caption");
      expect(caption).toHaveClass("custom-caption-class");
    });

    it("should forward ref to caption element", () => {
      const ref = React.createRef<HTMLTableCaptionElement>();
      render(
        <Table>
          <TableCaption ref={ref}>Table Caption</TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(ref.current).not.toBeNull();
      expect(ref.current instanceof HTMLTableCaptionElement).toBe(true);
    });
  });

  describe("Integration", () => {
    it("should render complete table structure", () => {
      render(
        <Table>
          <TableCaption>User List</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John Doe</TableCell>
              <TableCell>john@example.com</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jane Smith</TableCell>
              <TableCell>jane@example.com</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total: 2 users</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );

      expect(screen.getByText("User List")).toBeInTheDocument();
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByText("jane@example.com")).toBeInTheDocument();
      expect(screen.getByText("Total: 2 users")).toBeInTheDocument();
    });

    it("should handle multiple rows and cells", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell 1-1</TableCell>
              <TableCell>Cell 1-2</TableCell>
              <TableCell>Cell 1-3</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Cell 2-1</TableCell>
              <TableCell>Cell 2-2</TableCell>
              <TableCell>Cell 2-3</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getByText("Cell 1-1")).toBeInTheDocument();
      expect(screen.getByText("Cell 1-2")).toBeInTheDocument();
      expect(screen.getByText("Cell 1-3")).toBeInTheDocument();
      expect(screen.getByText("Cell 2-1")).toBeInTheDocument();
      expect(screen.getByText("Cell 2-2")).toBeInTheDocument();
      expect(screen.getByText("Cell 2-3")).toBeInTheDocument();
    });

    it("should handle empty cells", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Cell 2</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const cells = screen.getAllByRole("cell");
      expect(cells).toHaveLength(2);
      expect(cells[0]).toBeEmptyDOMElement();
      expect(cells[1]).toHaveTextContent("Cell 2");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty table", () => {
      render(<Table />);

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
    });

    it("should handle table with only header", () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );

      expect(screen.getByText("Header")).toBeInTheDocument();
    });

    it("should handle table with only body", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getByText("Cell")).toBeInTheDocument();
    });

    it("should handle long text content", () => {
      const longText = "A".repeat(1000);
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>{longText}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("should handle special characters in content", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Special: &lt;&gt;&amp;&quot;&apos;</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getByText(/Special:/)).toBeInTheDocument();
    });

    it("should handle numeric content", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>123</TableCell>
              <TableCell>456.78</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getByText("123")).toBeInTheDocument();
      expect(screen.getByText("456.78")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have correct table role", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
    });

    it("should support aria-label on table", () => {
      render(
        <Table aria-label="User data table">
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const table = screen.getByRole("table");
      expect(table).toHaveAttribute("aria-label", "User data table");
    });

    it("should support scope attribute on TableHead", () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Name</TableHead>
              <TableHead scope="row">Row Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );

      expect(screen.getByText("Name")).toHaveAttribute("scope", "col");
      expect(screen.getByText("Row Header")).toHaveAttribute("scope", "row");
    });

    it("should support colSpan and rowSpan for accessibility", () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={2}>Combined Header</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell rowSpan={2}>Row Span Cell</TableCell>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getByText("Combined Header")).toHaveAttribute(
        "colSpan",
        "2"
      );
      expect(screen.getByText("Row Span Cell")).toHaveAttribute("rowSpan", "2");
    });
  });
});
