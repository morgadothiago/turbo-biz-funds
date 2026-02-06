import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {action && (
        <Button 
          onClick={action.onClick}
          className="bg-[#25D366] hover:bg-[#128C7E] text-white gap-2 w-full sm:w-auto"
        >
          {action.icon || <Plus className="w-4 h-4" />}
          {action.label}
        </Button>
      )}
    </div>
  );
}
