import { lazy } from "react";

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
      if (isChunkError && !sessionStorage.getItem("chunk_reload")) {
        sessionStorage.setItem("chunk_reload", "1");
        window.location.reload();
        return new Promise<{ default: T }>(() => {});
      }
      sessionStorage.removeItem("chunk_reload");
      throw err;
    })
  );
}
