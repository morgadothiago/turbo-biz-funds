import { useAuth } from "@/contexts/AuthContext";
import { isAtLimit, getLimit, type PlanResource } from "@/lib/plan-limits";

export function usePlanGuard(resource: PlanResource, currentCount: number) {
  const { user } = useAuth();
  const plan = user?.plan ?? "free";
  const limit = getLimit(plan, resource);
  const limitReached = isAtLimit(plan, resource, currentCount);

  return {
    plan,
    limit,
    limitReached,
    canCreate: !limitReached,
    currentCount,
  };
}
