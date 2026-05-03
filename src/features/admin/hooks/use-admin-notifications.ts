import { useEffect, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, apiEndpoints } from "@/lib/api/client";
import type { AdminActivityItem } from "./use-admin-dashboard";

const STORAGE_KEY = "admin:notifications:seen";
const CLEARED_KEY = "admin:notifications:cleared";
const POLL_INTERVAL = 30_000; // 30s

export interface AdminNotification extends AdminActivityItem {
  id: string;
  read: boolean;
}

function buildId(item: AdminActivityItem, index: number): string {
  return `${item.type}::${item.message}::${index}`;
}

// Para detecção de "novo": ignora índice, compara só tipo+mensagem+tempo
function buildSeenKey(item: AdminActivityItem): string {
  return `${item.type}::${item.message}::${item.time}`;
}

function getSeenIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveSeenIds(ids: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch (_) {
    // ignore storage errors
  }
}

function getClearedKeys(): Set<string> {
  try {
    const raw = localStorage.getItem(CLEARED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveClearedKeys(keys: Set<string>) {
  try {
    localStorage.setItem(CLEARED_KEY, JSON.stringify([...keys]));
  } catch (_) {
    // ignore storage errors
  }
}

const ACTIVITY_ICONS: Record<string, string> = {
  signup:  "👤",
  payment: "💳",
  upgrade: "⬆️",
  support: "🎧",
};

function toastForItem(item: AdminActivityItem) {
  const icon = ACTIVITY_ICONS[item.type] ?? "🔔";
  toast(`${icon} ${item.message}`, {
    description: item.time,
    duration: 6000,
  });
}

async function fetchActivity(): Promise<AdminNotification[]> {
  // Endpoint /v1/admin/activity não existe no backend ainda
  return [];
}

export function useAdminNotifications() {
  const queryClient = useQueryClient();
  const prevIdsRef = useRef<Set<string>>(new Set());
  const initialLoadRef = useRef(true);

  const { data: notifications = [] } = useQuery({
    queryKey: ["admin", "notifications"],
    queryFn: fetchActivity,
    refetchInterval: POLL_INTERVAL,
    staleTime: 0,
  });

  // Detect new items after initial load using seenKeys (type::message::time)
  useEffect(() => {
    if (notifications.length === 0) return;

    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      prevIdsRef.current = new Set(notifications.map((n) => buildSeenKey(n)));
      return;
    }

    const newItems = notifications.filter((n) => !prevIdsRef.current.has(buildSeenKey(n)));
    if (newItems.length === 0) return;

    newItems.slice(0, 3).forEach(toastForItem);
    if (newItems.length > 3) {
      toast(`+${newItems.length - 3} outras notificações`, { duration: 4000 });
    }

    prevIdsRef.current = new Set(notifications.map((n) => buildSeenKey(n)));
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = useCallback(() => {
    const allSeenKeys = new Set(notifications.map((n) => buildSeenKey(n)));
    saveSeenIds(allSeenKeys);
    queryClient.setQueryData<AdminNotification[]>(
      ["admin", "notifications"],
      (prev) => (prev ?? []).map((n) => ({ ...n, read: true }))
    );
  }, [notifications, queryClient]);

  const clearAll = useCallback(() => {
    const allKeys = new Set(notifications.map((n) => buildSeenKey(n)));
    // merge com cleared existente para não perder limpezas anteriores
    const existing = getClearedKeys();
    allKeys.forEach((k) => existing.add(k));
    saveClearedKeys(existing);
    // também marca como lidas no localStorage
    saveSeenIds(new Set(notifications.map((n) => buildSeenKey(n))));
    queryClient.setQueryData<AdminNotification[]>(["admin", "notifications"], []);
  }, [notifications, queryClient]);

  return { notifications, unreadCount, markAllRead, clearAll };
}
