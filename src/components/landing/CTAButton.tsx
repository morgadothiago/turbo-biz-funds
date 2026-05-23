import { memo, ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

type ArrowStyle = "simple" | "circle";

interface CTAButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  children: ReactNode;
  /** React Router link target */
  to?: string;
  /** External href */
  href?: string;
  onClick?: () => void;
  /** simple = plain arrow, circle = arrow inside darker circle */
  arrowStyle?: ArrowStyle;
  className?: string;
}

const BASE =
  "inline-flex items-center gap-3 px-7 py-3 " +
  "bg-gradient-to-r from-[#0047FF] to-[#0A1940]/90 " +
  "hover:from-[#1a5fff] hover:to-[#0d2a50] " +
  "active:scale-[0.97] " +
  "text-white font-bold text-sm uppercase tracking-wide " +
  "rounded-lg border border-blue-500/20 " +
  "shadow-[0_0_24px_rgba(0,71,255,0.45)] " +
  "hover:shadow-[0_0_38px_rgba(0,71,255,0.65)] " +
  "transition-all duration-200 cursor-pointer select-none";

const SimpleArrow = () => <ArrowRight className="w-4 h-4 flex-shrink-0" />;

const CircleArrow = () => (
  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#001a6b] flex-shrink-0">
    <ArrowRight className="w-3.5 h-3.5" />
  </span>
);

const CTAButton = memo(
  ({
    children,
    to,
    href,
    onClick,
    arrowStyle = "simple",
    className = "",
    ...props
  }: CTAButtonProps) => {
    const Arrow = arrowStyle === "circle" ? CircleArrow : SimpleArrow;
    const cls = `${BASE} ${className}`;
    const content = (
      <>
        {children}
        <Arrow />
      </>
    );

    if (to) {
      return (
        <Link to={to} className={cls} onClick={onClick}>
          {content}
        </Link>
      );
    }

    if (href) {
      return (
        <a href={href} className={cls} onClick={onClick} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      );
    }

    return (
      <button className={cls} onClick={onClick} {...props}>
        {content}
      </button>
    );
  }
);

CTAButton.displayName = "CTAButton";

export default CTAButton;

/*
  Usage examples:

  // Hero CTA
  <CTAButton to="/cadastro" onClick={() => analytics.click("hero_cta", "hero")}>
    COMECE AGORA
  </CTAButton>

  // Video section CTA (arrow in circle)
  <CTAButton to="/cadastro" arrowStyle="circle">
    ADQUIRIR O DOUTOR CASH
  </CTAButton>

  // Plain button
  <CTAButton onClick={handleSubmit}>
    ENVIAR
  </CTAButton>
*/
