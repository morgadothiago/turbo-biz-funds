import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, MessageCircle, Brain } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-br from-primary via-primary to-accent rounded-3xl p-8 md:p-16 text-primary-foreground overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/30 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
            
            {/* Floating icons */}
            <div className="absolute top-8 right-8 hidden md:block">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm animate-float">
                <Brain className="w-6 h-6" />
              </div>
            </div>
            <div className="absolute bottom-8 right-24 hidden md:block">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm animate-float" style={{ animationDelay: "0.5s" }}>
                <MessageCircle className="w-5 h-5" />
              </div>
            </div>

            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm mb-8">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Comece gratuitamente hoje</span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Pronto para transformar a gestão<br className="hidden md:block" />
                financeira da sua empresa?
              </h2>

              <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
                Junte-se a mais de 5.000 empresas que já economizam tempo e dinheiro
                com inteligência artificial e automação via WhatsApp.
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
