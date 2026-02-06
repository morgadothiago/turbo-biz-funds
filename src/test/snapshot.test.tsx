import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

describe("Snapshot Tests", () => {
  describe("Button", () => {
    it("should match snapshot - default variant", () => {
      const { container } = render(<Button>Default Button</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot - outline variant", () => {
      const { container } = render(<Button variant="outline">Outline Button</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot - disabled state", () => {
      const { container } = render(<Button disabled>Disabled Button</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe("Card", () => {
    it("should match snapshot - complete card", () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
          <CardContent>Card content goes here</CardContent>
        </Card>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
