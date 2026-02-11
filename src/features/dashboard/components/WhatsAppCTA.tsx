/**
 * Componente de chamada para ação do WhatsApp.
 */

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight } from "lucide-react";

export const WhatsAppCTA = () => {
  return (
    <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
      <CardContent className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#25D366]/20">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground">
              Registre pelo WhatsApp
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              Envie áudio, foto ou texto e nossa IA categoriza automaticamente
            </p>
          </div>
        </div>
        <Button className="bg-[#25D366] hover:bg-[#128C7E] text-white whitespace-nowrap w-full sm:w-auto">
          Conectar
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};
