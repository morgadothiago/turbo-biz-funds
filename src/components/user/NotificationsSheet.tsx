import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NOTIFICATION_COUNT = 2;

export function NotificationsSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-full bg-[#1a3799]/8 hover:bg-[#1a3799]/12 text-[#1a3799]"
          aria-label="Notificações"
        >
          <Bell className="h-5 w-5 fill-[#1a3799] text-[#1a3799]" />
          {NOTIFICATION_COUNT > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 min-w-[18px] items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white leading-none px-1">
              {NOTIFICATION_COUNT}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[85vw] max-w-sm flex flex-col p-0 bg-background/95 backdrop-blur-xl border-l overflow-x-hidden"
      >
        <div className="flex items-center p-4 border-b shrink-0">
          <SheetTitle className="text-lg font-semibold">Notificações</SheetTitle>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center px-4">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
            <Bell className="h-7 w-7 text-muted-foreground/40" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">Nenhuma notificação</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Você está em dia com tudo!</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
