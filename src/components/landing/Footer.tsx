import { memo } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Instagram, Youtube, Mail } from "lucide-react";
import { useI18n } from "@/lib/i18n-provider";

interface FooterLink {
  name: string;
  href: string;
}

const Footer = memo(() => {
  const { t } = useI18n();

  const FOOTER_LINKS: Record<string, FooterLink[]> = {
    produto: [
      { name: t("landing", "footerHowItWorks"), href: "#como-funciona" },
      { name: t("landing", "footerPricing"), href: "#planos" },
      { name: t("landing", "footerTestimonials"), href: "#depoimentos" },
      { name: t("landing", "footerFAQ"), href: "#faq" },
    ],
    suporte: [
      { name: t("landing", "footerHelpCenter"), href: "#" },
      { name: t("landing", "footerContactUs"), href: "#" },
      { name: t("landing", "footerWhatsApp"), href: "#" },
    ],
    legal: [
      { name: t("landing", "footerPrivacy"), href: "#" },
      { name: t("landing", "footerTerms"), href: "#" },
      { name: t("landing", "footerLGPD"), href: "#" },
    ],
  };

  const SOCIAL_LINKS = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "Youtube" },
    { icon: Mail, href: "#", label: "Email" },
  ] as const;

  const CURRENT_YEAR = new Date().getFullYear();

  const FooterColumn = ({ title, links }: { title: string; links: FooterLink[] }) => (
    <div>
      <h4 className="font-semibold mb-4 text-white">{title}</h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.name}>
            <a
              href={link.href}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="relative bg-[#3F7F6B] text-white pt-12 pb-6 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold">
                Organiza<span className="text-[#6FAF8E]">AI</span>
              </span>
            </Link>
            <p className="text-white/80 text-sm mb-6 max-w-xs leading-relaxed">
              {t("landing", "footerDescription")}
            </p>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title={t("landing", "footerProduct")} links={FOOTER_LINKS.produto} />
          <FooterColumn title={t("landing", "footerSupport")} links={FOOTER_LINKS.suporte} />
          <FooterColumn title={t("landing", "footerLegal")} links={FOOTER_LINKS.legal} />
        </div>

        <div className="pt-6 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-white/60">
            © {CURRENT_YEAR} OrganizaAI. {t("landing", "footerCopyright")}
          </p>
          <p className="text-sm text-white/60">
            {t("landing", "footerMadeInBrazil")}
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
