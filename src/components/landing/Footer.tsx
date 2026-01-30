import { Link } from "react-router-dom";
import { Sparkles, Linkedin, Instagram, Youtube, Mail } from "lucide-react";

const Footer = () => {
  const links = {
    produto: [
      { name: "Recursos", href: "#" },
      { name: "Preços", href: "#planos" },
      { name: "Integrações", href: "#" },
      { name: "API", href: "#" },
    ],
    empresa: [
      { name: "Sobre", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Carreiras", href: "#" },
      { name: "Contato", href: "#" },
    ],
    recursos: [
      { name: "Central de Ajuda", href: "#" },
      { name: "Documentação", href: "#" },
      { name: "Status", href: "#" },
      { name: "Changelog", href: "#" },
    ],
    legal: [
      { name: "Privacidade", href: "#" },
      { name: "Termos", href: "#" },
      { name: "Segurança", href: "#" },
      { name: "LGPD", href: "#" },
    ],
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Logo and description */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold">
                Finance<span className="text-accent">AI</span>
              </span>
            </Link>
            <p className="text-primary-foreground/70 text-sm mb-6 max-w-xs">
              Gestão financeira inteligente para pequenas e médias empresas.
              Automatize com IA e WhatsApp.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Produto</h4>
            <ul className="space-y-3">
              {links.produto.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-3">
              {links.empresa.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Recursos</h4>
            <ul className="space-y-3">
              {links.recursos.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} FinanceAI. Todos os direitos reservados.
          </p>
          <p className="text-sm text-primary-foreground/60">
            Feito com 💙 no Brasil
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
