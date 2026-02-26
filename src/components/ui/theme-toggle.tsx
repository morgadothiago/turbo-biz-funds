"use client";

import { Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { memo } from "react";

const ThemeToggle = memo(() => {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Tema claro"
      className="relative w-9 h-9 rounded-lg hover:bg-muted transition-colors"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 text-amber-500" />
    </Button>
  );
});

ThemeToggle.displayName = "ThemeToggle";

export { ThemeToggle };
