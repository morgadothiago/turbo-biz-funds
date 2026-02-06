import { Loader2 } from "lucide-react";

export function AuthLoading() {
  return (
    <div className="min-h-screen bg-[#1a3d35] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center animate-pulse">
          <span className="text-white font-bold text-2xl">F</span>
        </div>
        <div className="flex items-center gap-2 text-[#F6F4EF]/70">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Carregando...</span>
        </div>
      </div>
    </div>
  );
}
