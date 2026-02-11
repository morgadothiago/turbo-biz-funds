/**
 * Componente de chamada para ação do WhatsApp.
 */

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export const WhatsAppCTA = () => {
  return (
    <Card className="bg-gradient-to-r from-[#25D366]/10 to-[#128C7E]/10 border-[#25D366]/20">
      <CardContent className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">Registre pelo WhatsApp</h3>
            <p className="text-sm text-muted-foreground">
              Envie áudio, foto ou texto e nossa IA categoriza automaticamente
            </p>
          </div>
        </div>
        <Button className="bg-[#25D366] hover:bg-[#128C7E] text-white whitespace-nowrap">
          Conectar WhatsApp
        </Button>
      </CardContent>
    </Card>
  );
};
