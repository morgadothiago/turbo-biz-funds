import { lazy } from "react";

const RELOAD_WINDOW_MS = 8000;
let _reloading = false;

export function lazyWithRetry<T extends React.ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return lazy(() =>
    factory().catch((err: unknown) => {
      const isChunkError =
        err instanceof Error &&
        (err.message.includes("Failed to fetch dynamically imported module") ||
          err.message.includes("Importing a module script failed") ||
          err.message.includes("error loading dynamically imported module"));

      if (!isChunkError) throw err;

      const lastReload = parseInt(sessionStorage.getItem("chunk_reload_ts") || "0");
      const recentlyReloaded = Date.now() - lastReload < RELOAD_WINDOW_MS;

      if (!recentlyReloaded && !_reloading) {
        _reloading = true;
        sessionStorage.setItem("chunk_reload_ts", Date.now().toString());
        window.location.reload();
      }

      if (!recentlyReloaded) {
        // Reload agendado — manter promessa pendente para não disparar ErrorBoundary
        return new Promise<{ default: T }>(() => {});
      }

      // Recarregou recentemente e ainda falha — mostrar erro
      throw err;
    })
  );
}
