import { memo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// Card 1 — Registro automático (WhatsApp chat simulation)
const RegistroCard = memo(() => (
  <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3 h-full">
    {/* Chat bubble mockup */}
    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
      <div className="text-xs text-gray-400 mb-2 font-medium">WhatsApp</div>
      <div className="space-y-2">
        {/* User message */}
        <div className="flex justify-end">
          <div className="bg-[#dcf8c6] rounded-2xl rounded-tr-sm px-3 py-2 text-xs text-gray-800 max-w-[85%]">
            Você enviou: "Gastei 45 no mercado"
          </div>
        </div>
        {/* Bot reply */}
        <div className="flex justify-start">
          <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2 text-xs text-gray-800 max-w-[85%] border border-gray-100 shadow-sm">
            Registrado em Alimentação
          </div>
        </div>
      </div>
    </div>
    <div className="mt-auto text-center">
      <span className="inline-block bg-green-50 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">
        Registro automático
      </span>
    </div>
  </div>
));

RegistroCard.displayName = "RegistroCard";

// Card 2 — Múltiplos formatos
const FormatosCard = memo(() => (
  <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3 h-full">
    <div className="text-sm font-bold text-gray-800 mb-1">Múltiplos formatos</div>
    <div className="space-y-3 flex-1">
      <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2">
        <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-base flex-shrink-0">
          🎤
        </span>
        <span className="text-sm text-gray-700 font-medium">Áudio</span>
      </div>
      <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2">
        <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-base flex-shrink-0">
          📷
        </span>
        <span className="text-sm text-gray-700 font-medium">Foto</span>
      </div>
      <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2">
        <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-base flex-shrink-0">
          ✍️
        </span>
        <span className="text-sm text-gray-700 font-medium">Texto</span>
      </div>
    </div>
    <div className="text-center">
      <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
        Fácil e natural
      </span>
    </div>
  </div>
));

FormatosCard.displayName = "FormatosCard";

// Card 3 — Dashboard Mobile
const DashboardCard = memo(() => (
  <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3 h-full">
    <div className="text-sm font-bold text-gray-800 mb-1">Dashboard Mobile</div>
    <div className="space-y-2 flex-1">
      <div className="flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2">
        <span className="text-sm text-gray-500">Saldo</span>
        <span className="text-sm font-bold text-green-600">R$ 2.340</span>
      </div>
      <div className="flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2">
        <span className="text-sm text-gray-500">Gastos</span>
        <span className="text-sm font-bold text-red-500">R$ 1.850</span>
      </div>
      {/* Progress bar */}
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mt-1">
        <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" style={{ width: "65%" }} />
      </div>
      {/* Color bars */}
      <div className="flex gap-1 mt-1">
        <div className="h-1.5 flex-1 bg-green-400 rounded-full" />
        <div className="h-1.5 flex-1 bg-blue-400 rounded-full" />
        <div className="h-1.5 flex-1 bg-yellow-400 rounded-full" />
        <div className="h-1.5 flex-1 bg-purple-400 rounded-full" />
      </div>
    </div>
    <div className="text-center">
      <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
        Funciona no celular
      </span>
    </div>
  </div>
));

DashboardCard.displayName = "DashboardCard";

const HowItWorks = memo(() => {
  return (
    <section id="como-funciona" className="py-16 md:py-24 bg-[#06091c]">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-blue-300 text-sm font-medium mb-4 uppercase tracking-wide">
            Como funciona
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Simples como mandar uma mensagem
          </h2>
          <p className="text-lg text-white/60">
            Você conversa, o sistema organiza. Sem planilhas, sem complicação.
          </p>
        </motion.div>

        {/* 3-card container with dashed border */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-5xl mx-auto"
        >
          <div className="border-2 border-blue-500/40 border-dashed rounded-3xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <RegistroCard />
              <FormatosCard />
              <DashboardCard />
            </div>
          </div>
        </motion.div>

        {/* CTA button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mt-10"
        >
          <Button
            className="bg-[#1a3799] hover:bg-[#2b3fcb] text-white font-bold text-base px-8 py-4 rounded-full h-auto shadow-lg shadow-blue-900/40 transition-all duration-200"
            asChild
          >
            <Link to="/cadastro">
              ADQUIRIR O DOUTOR CASH
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
});

HowItWorks.displayName = "HowItWorks";

export default HowItWorks;
