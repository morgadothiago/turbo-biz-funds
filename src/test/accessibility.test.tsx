import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "@/pages/Login";

describe("Accessibility Tests", () => {
  describe("Button accessibility", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(<Button>Click me</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should be accessible when disabled", async () => {
      const { container } = render(<Button disabled>Disabled</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Input accessibility", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(
        <>
          <label htmlFor="test-input">Test Label</label>
          <Input id="test-input" aria-describedby="test-help" />
          <div id="test-help">Help text</div>
        </>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should be accessible with error state", async () => {
      const { container } = render(
        <>
          <label htmlFor="error-input">Email</label>
          <Input 
            id="error-input" 
            aria-invalid="true" 
            aria-errormessage="error-message" 
          />
          <div id="error-message" role="alert">Invalid email</div>
        </>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Card accessibility", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Login page accessibility", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(
        <BrowserRouter>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </BrowserRouter>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
