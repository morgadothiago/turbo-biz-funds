import { useState, useEffect, useRef } from "react";

async function checkConnectivity(): Promise<boolean> {
  try {
    await fetch(`/favicon.ico?_=${Date.now()}`, {
      method: "HEAD",
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    // qualquer resposta HTTP (inclusive 404) = servidor alcançável = online
    return true;
  } catch {
    return false;
  }
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const failCount = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const verify = async () => {
      const ok = await checkConnectivity();
      if (ok) {
        failCount.current = 0;
        setIsOnline(true);
      } else {
        failCount.current += 1;
        // só declara offline após 2 falhas consecutivas
        if (failCount.current >= 2) setIsOnline(false);
      }
    };

    verify();

    window.addEventListener("online", verify);
    window.addEventListener("offline", verify);
    intervalRef.current = setInterval(verify, 30_000);

    return () => {
      window.removeEventListener("online", verify);
      window.removeEventListener("offline", verify);
      clearInterval(intervalRef.current);
    };
  }, []);

  return isOnline;
}
