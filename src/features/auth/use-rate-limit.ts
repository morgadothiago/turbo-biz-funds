import { useState, useEffect, useCallback } from "react";
import { MAX_LOGIN_ATTEMPTS, LOCKOUT_DURATION_MS, LOGIN_ATTEMPTS_KEY, LOGIN_LOCKOUT_KEY } from "./constants";

export function useRateLimit() {
  const [attempts, setAttempts] = useState(() => {
    const stored = sessionStorage.getItem(LOGIN_ATTEMPTS_KEY);
    return stored ? parseInt(stored, 10) : 0;
  });

  const [lockedUntil, setLockedUntil] = useState<number | null>(() => {
    const stored = sessionStorage.getItem(LOGIN_LOCKOUT_KEY);
    const ts = stored ? parseInt(stored, 10) : 0;
    return ts > Date.now() ? ts : null;
  });

  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!lockedUntil) { setSecondsLeft(0); return; }
    const tick = () => {
      const diff = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (diff <= 0) { setLockedUntil(null); setSecondsLeft(0); }
      else { setSecondsLeft(diff); }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lockedUntil]);

  const isLocked = lockedUntil !== null && lockedUntil > Date.now();

  const recordFailure = useCallback(() => {
    const next = attempts + 1;
    setAttempts(next);
    sessionStorage.setItem(LOGIN_ATTEMPTS_KEY, String(next));
    if (next >= MAX_LOGIN_ATTEMPTS) {
      // Backoff exponencial: 30s, 60s, 120s...
      const multiplier = Math.pow(2, Math.floor(next / MAX_LOGIN_ATTEMPTS) - 1);
      const until = Date.now() + LOCKOUT_DURATION_MS * multiplier;
      setLockedUntil(until);
      sessionStorage.setItem(LOGIN_LOCKOUT_KEY, String(until));
    }
  }, [attempts]);

  const recordSuccess = useCallback(() => {
    setAttempts(0);
    setLockedUntil(null);
    sessionStorage.removeItem(LOGIN_ATTEMPTS_KEY);
    sessionStorage.removeItem(LOGIN_LOCKOUT_KEY);
  }, []);

  return { isLocked, secondsLeft, recordFailure, recordSuccess, attempts };
}
