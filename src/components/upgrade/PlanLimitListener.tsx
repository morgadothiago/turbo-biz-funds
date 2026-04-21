import { useEffect, useState } from "react";
import { UpgradeModal } from "./UpgradeModal";
import type { PlanResource } from "@/lib/plan-limits";

export function PlanLimitListener() {
  const [open, setOpen] = useState(false);
  const [resource, setResource] = useState<PlanResource>("transactions");
  const [limit, setLimit] = useState(3);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setResource((detail?.error?.resource as PlanResource) ?? "transactions");
      setLimit(detail?.error?.limit ?? 1);
      setOpen(true);
    };
    window.addEventListener("plan:limit-exceeded", handler);
    return () => window.removeEventListener("plan:limit-exceeded", handler);
  }, []);

  return (
    <UpgradeModal
      open={open}
      onOpenChange={setOpen}
      resource={resource}
      limit={limit}
    />
  );
}
