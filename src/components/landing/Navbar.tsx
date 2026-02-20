import { useState, useCallback, memo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useI18n } from "@/lib/i18n-provider";
import { analytics } from "@/lib/analytics";

const Navbar = memo(() => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleCTAClick = useCallback((buttonName: string) => {
    analytics.click(buttonName, "navbar");
  }, []);

  const NAV_LINKS = [
    { name: t("landing", "navHowItWorks"), href: "#como-funciona" },
    { name: t("landing", "navTestimonials"), href: "#depoimentos" },
    { name: t("landing", "navPricing"), href: "#planos" },
    { name: t("landing", "navFAQ"), href: "#faq" },
  ] as const;

  const NavLinks = () => (
    <>
      {NAV_LINKS.map((link) => (
        <a
          key={link.name}
          href={link.href}
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
          onClick={closeMenu}
        >
          {link.name}
        </a>
      ))}
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 md:bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center transition-transform group-hover:scale-105">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Organiza<span className="text-primary">AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <NavLinks />
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link to="/login" onClick={() => handleCTAClick("login")}>{t("landing", "navLogin")}</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/cadastro" onClick={() => handleCTAClick("sign_up")}>{t("landing", "navSignUp")}</Link>
            </Button>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 pt-6">
                <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold text-foreground">
                    Organiza<span className="text-primary">AI</span>
                  </span>
                </Link>

                <div className="flex flex-col gap-2">
                  <NavLinks />
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-border">
                  <ThemeToggle />
                </div>

                <div className="flex flex-col gap-3 pt-4 border-t border-border">
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/login" onClick={() => { closeMenu(); handleCTAClick("login_mobile"); }}>{t("landing", "navLogin")}</Link>
                  </Button>
                  <Button variant="hero" asChild className="w-full">
                    <Link to="/cadastro" onClick={() => { closeMenu(); handleCTAClick("sign_up_mobile"); }}>{t("landing", "navSignUp")}</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;
