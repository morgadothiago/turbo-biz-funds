import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, MessageCircle, Brain } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";

const CTA = () => {
  const containerRef = useReveal();

  return (
    <section className="py-24 relative overflow-hidden bg-white">
      <div className="container mx-auto px-4 relative z-10">
        <div ref={containerRef} className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-br from-primary via-primary to-accent rounded-3xl p-8 md:p-16 text-primary-foreground overflow-hidden shadow-2xl">
            {/* Background decorations */}
            <div className="blob w-96 h-96 bg-white/20 -top-20 -right-20 animate-blob" />
            <div className="blob w-[400px] h-[400px] bg-accent/30 -bottom-20 -left-20 animate-blob" style={{ animationDelay: '-10s' }} />


            {/* Floating icons with animation */}
            <div className="absolute top-12 right-12 hidden md:block">
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 animate-float shadow-lg">
                <Brain className="w-7 h-7" />
              </div>
            </div>
            <div className="absolute bottom-12 right-32 hidden md:block">
              <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20 animate-float shadow-lg" style={{ animationDelay: "1.5s" }}>
                <MessageCircle className="w-6 h-6" />
              </div>
            </div>


            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm mb-8">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Comece gratuitamente hoje</span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Simplifique sua gestão financeira<br className="hidden md:block" />
                usando apenas o WhatsApp
              </h2>

              <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
                Junte-se a empresas que já economizam tempo enviando áudios e fotos
                para controlar o financeiro automaticamente com nossa IA.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="white" size="xl" asChild className="w-full sm:w-auto">
                  <Link to="/cadastro">
                    Começar Agora — É Grátis
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  variant="glass"
                  size="xl"
                  className="w-full sm:w-auto border-white/30 hover:bg-white/20"
                >
                  Falar com Especialista
                </Button>
              </div>

              <p className="text-sm text-primary-foreground/60 mt-6">
                ✓ Setup em 5 minutos &nbsp;&nbsp; ✓ Sem cartão de crédito &nbsp;&nbsp; ✓ Suporte em português
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
