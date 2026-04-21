import { useAuth } from "@/contexts/AuthContext";
import type { UserPlan } from "@/types/auth";

export function usePlan() {
  const { user } = useAuth();
  const plan: UserPlan = user?.plan ?? "free";

  return {
    plan,
    isFree: plan === "free",
    isPro: plan === "pro",
    isBusiness: plan === "business",
    isPaid: plan === "pro" || plan === "business",
  };
}
