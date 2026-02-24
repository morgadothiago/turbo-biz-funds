import { memo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, Star, Clock, MessageCircle, Info } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n-provider";
import { analytics } from "@/lib/analytics";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6 },
  },
};

const Hero = memo(() => {
  const { t } = useI18n();

  const HERO_STATS = [
    { value: "3.000+", label: t("landing", "heroStatUsers"), icon: Users },
    { value: "500k+", label: t("landing", "heroStatExpenses"), icon: MessageCircle },
    { value: "4.9", label: t("landing", "heroStatRating"), icon: Star },
    { value: "< 5min", label: t("landing", "heroStatTime"), icon: Clock },
  ] as const;

  return (
    <section className="relative min-h-[90vh] pt-20 pb-12 md:min-h-screen md:pt-24 md:pb-16 flex items-center bg-transparent">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-5xl mx-auto text-center relative"
        >
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-primary/5 blur-[80px] -z-10" />

          <motion.div variants={staggerItem} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 md:mb-8">
            <Sparkles className="w-4 h-4" />
            {t("landing", "heroBadge")}
          </motion.div>

          <motion.h1 variants={staggerItem} className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4 md:mb-6">
            {t("landing", "heroTitleLine1")}
            <br />
            <span className="text-primary">{t("landing", "heroTitleLine2")}</span>
          </motion.h1>

          <motion.p variants={staggerItem} className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 md:mb-10">
            {t("landing", "heroSubtitle")}
          </motion.p>

          <motion.div variants={staggerItem} className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-12 md:mb-16">
            <Button variant="hero" size="lg" asChild className="w-full sm:w-auto md:size-xl">
              <Link to="/cadastro" onClick={() => analytics.click("hero_cta", "hero")}>
                {t("landing", "heroCTA")}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto md:size-xl gap-2" onClick={() => analytics.click("watch_demo", "hero")}>
              <Info className="w-5 h-5" />
              {t("landing", "heroWatchDemo")}
            </Button>
          </motion.div>

          <motion.div variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto mb-12 md:mb-16">
            {HERO_STATS.map((stat, index) => (
              <motion.div key={index} variants={staggerItem} className="text-center">
                <div className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight flex items-center justify-center gap-1 md:gap-2 text-accent">
                  <stat.icon className="w-4 h-4 md:w-6 md:h-6 text-accent" />
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={scaleIn} className="relative">
            <div className="relative bg-gradient-to-b from-primary/5 to-accent/10 rounded-xl md:rounded-2xl p-1.5 md:p-3 shadow-lg md:shadow-xl border border-border/50">
              <div className="bg-card rounded-lg md:rounded-xl overflow-hidden shadow-card">
                {/* 3 Mobile Mockups - Substituindo o vídeo */}
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
                    {/* Celular 1 - Registro Simples */}
                    <div className="flex-1 max-w-[200px]">
                      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-4 border border-border/50 shadow-md">
                        <div className="bg-white rounded-xl p-3 shadow-sm">
                          <div className="text-xs text-muted-foreground mb-2">WhatsApp</div>
                          <div className="space-y-2">
                            <div className="bg-green-100 rounded-lg p-2 text-xs">
                              <span className="font-medium">Você:</span> Gastei 50 reais na farmácia
                            </div>
                            <div className="bg-blue-100 rounded-lg p-2 text-xs">
                              <span className="font-medium">Assistente:</span> Registrado em Saúde 💊
                            </div>
                          </div>
                        </div>
                        <div className="text-center mt-2">
                          <span className="text-xs font-medium text-green-600">Registro automático</span>
                        </div>
                      </div>
                    </div>

                    {/* Celular 2 - Multiformato */}
                    <div className="flex-1 max-w-[200px]">
                      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-4 border border-border/50 shadow-md">
                        <div className="bg-white rounded-xl p-3 shadow-sm">
                          <div className="text-xs text-muted-foreground mb-2">Múltiplos formatos</div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">🎤</span>
                              <span>Áudio</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">📷</span>
                              <span>Foto</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">✍️</span>
                              <span>Texto</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-center mt-2">
                          <span className="text-xs font-medium text-blue-600">Fácil e natural</span>
                        </div>
                      </div>
                    </div>

                    {/* Celular 3 - Dashboard Mobile */}
                    <div className="flex-1 max-w-[200px]">
                      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-4 border border-border/50 shadow-md">
                        <div className="bg-white rounded-xl p-3 shadow-sm">
                          <div className="text-xs text-muted-foreground mb-2">Dashboard Mobile</div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Saldo</span>
                              <span className="font-medium text-green-600">R$ 2.340</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Gastos</span>
                              <span className="font-medium text-red-500">R$ 1.850</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }} />
                            </div>
                            <div className="flex gap-1 mt-1">
                              <div className="h-1 flex-1 bg-green-400 rounded-full" />
                              <div className="h-1 flex-1 bg-blue-400 rounded-full" />
                              <div className="h-1 flex-1 bg-yellow-400 rounded-full" />
                              <div className="h-1 flex-1 bg-purple-400 rounded-full" />
                            </div>
                          </div>
                        </div>
                        <div className="text-center mt-2">
                          <span className="text-xs font-medium text-blue-600">Funciona no celular</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:block absolute -left-8 top-1/4 bg-card rounded-xl p-3 shadow-lg border border-border/50 -translate-x-4 opacity-0 animate-fade-in">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-muted-foreground">{t("landing", "heroSent")}</div>
                  <div className="text-sm font-medium">"{t("landing", "heroSentExample")}"</div>
                </div>
              </div>
            </div>

            <div className="hidden md:block absolute -right-8 top-1/3 bg-card rounded-xl p-3 shadow-lg border border-border/50 translate-x-4 opacity-0 animate-fade-in [animation-delay:0.3s]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-muted-foreground">{t("landing", "heroCategorized")}</div>
                  <div className="text-sm font-medium text-primary">{t("landing", "heroCategoryFood")}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

Hero.displayName = "Hero";

export default Hero;
