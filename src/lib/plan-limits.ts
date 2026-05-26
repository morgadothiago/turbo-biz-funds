import type { UserPlan } from "@/types/auth";

export type PlanResource = "transactions" | "goals" | "cards" | "recurrences";

const LIMITS: Record<UserPlan, Record<PlanResource, number>> = {
  free: {
    transactions: Infinity,
    goals: Infinity,
    cards: Infinity,
    recurrences: Infinity,
  },
  pro: {
    transactions: Infinity,
    goals: Infinity,
    cards: Infinity,
    recurrences: Infinity,
  },
  business: {
    transactions: Infinity,
    goals: Infinity,
    cards: Infinity,
    recurrences: Infinity,
  },
};

export function getLimit(plan: UserPlan, resource: PlanResource): number {
  return LIMITS[plan][resource];
}

export function isAtLimit(plan: UserPlan, resource: PlanResource, count: number): boolean {
  return count >= getLimit(plan, resource);
}

export const RESOURCE_LABELS: Record<PlanResource, string> = {
  transactions: "transações",
  goals: "metas",
  cards: "cartões",
  recurrences: "recorrências",
};

export const PLAN_BENEFITS = {
  pro: [
    "Transações ilimitadas",
    "Metas ilimitadas",
    "Cartões ilimitados",
    "Recorrências ilimitadas",
    "Categorização por IA",
    "Registro por WhatsApp",
    "Relatórios avançados",
    "Suporte prioritário",
  ],
  business: [
    "Tudo do Pro",
    "Empresas ilimitadas",
    "Chat com IA financeira",
    "Previsão de gastos",
    "Detecção de anomalias",
    "API de integração",
    "Suporte VIP",
  ],
};
