import { useNavigate } from "react-router-dom";
import { Zap, Check, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RESOURCE_LABELS, PLAN_BENEFITS, type PlanResource } from "@/lib/plan-limits";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource: PlanResource;
  limit: number;
}

export function UpgradeModal({ open, onOpenChange, resource, limit }: UpgradeModalProps) {
  const navigate = useNavigate();
  const label = RESOURCE_LABELS[resource];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-amber-500" />
            </div>
            <DialogTitle className="text-lg">Faça seu upgrade</DialogTitle>
          </div>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Você atingiu o limite de{" "}
          <span className="font-semibold text-foreground">
            {limit} {label}
          </span>
          . Faça upgrade para continuar.
        </p>

        <div className="grid grid-cols-2 gap-3 mt-2">
          <PlanCard
            name="Pro"
            price="R$ 99,90"
            period="/mês"
            benefits={PLAN_BENEFITS.pro}
            highlight
            onSelect={() => {
              onOpenChange(false);
              navigate("/pagamento", { state: { plan: "pro" } });
            }}
          />
          <PlanCard
            name="Business"
            price="R$ 297"
            period="/mês"
            benefits={PLAN_BENEFITS.business}
            onSelect={() => {
              onOpenChange(false);
              navigate("/pagamento", { state: { plan: "business" } });
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface PlanCardProps {
  name: string;
  price: string;
  period: string;
  benefits: string[];
  highlight?: boolean;
  onSelect: () => void;
}

function PlanCard({ name, price, period, benefits, highlight, onSelect }: PlanCardProps) {
  return (
    <div
      className={`rounded-xl border p-4 flex flex-col gap-3 ${
        highlight ? "border-primary bg-primary/5" : "border-border"
      }`}
    >
      <div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground">{name}</span>
          {highlight && (
            <Badge className="text-[10px] px-1.5 py-0">Popular</Badge>
          )}
        </div>
        <div className="mt-1">
          <span className="text-xl font-bold text-foreground">{price}</span>
          <span className="text-xs text-muted-foreground">{period}</span>
        </div>
      </div>

      <ul className="space-y-1.5 flex-1">
        {benefits.slice(0, 4).map((b) => (
          <li key={b} className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <Check className="w-3 h-3 text-primary mt-0.5 shrink-0" />
            {b}
          </li>
        ))}
      </ul>

      <Button
        size="sm"
        variant={highlight ? "default" : "outline"}
        className="w-full"
        onClick={onSelect}
      >
        <Zap className="w-3.5 h-3.5 mr-1.5" />
        Assinar {name}
      </Button>
    </div>
  );
}
