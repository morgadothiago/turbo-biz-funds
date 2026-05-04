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
  signup: "👤",
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

// Helper to extract data from API response
function extractData<T>(response: any): T | null {
  if (!response) return null;
  return (response.data ?? response) as T;
}

async function fetchActivity(): Promise<AdminNotification[]> {
  try {
    const [usersRes, subsRes] = await Promise.allSettled([
      api.get(`${apiEndpoints.admin.users}?limit=10`),
      api.get(apiEndpoints.admin.subscriptions),
    ]);

    // Log individual API errors for debugging
    if (usersRes.status === 'rejected') {
      console.error('[useAdminNotifications] Users API failed:', usersRes.reason);
    }
    if (subsRes.status === 'rejected') {
      console.error('[useAdminNotifications] Subscriptions API failed:', subsRes.reason);
    }

    const notifications: AdminNotification[] = [];
    let idx = 0;

    // Load seen and cleared IDs from localStorage
    const seenIds = getSeenIds();
    const clearedIds = getClearedKeys();

    // 1. New signups from users endpoint
    const usersData = extractData<any[]>(usersRes.status === 'fulfilled' ? usersRes.value : null);
    const users: any[] = usersData ?? [];
    
    users.slice(0, 5).forEach((u: any) => {
      const id = `signup::${u.id ?? u.email}::${idx++}`;
      // Skip cleared notifications
      if (clearedIds.has(id)) return;
      notifications.push({
        id,
        type: "signup",
        message: `Novo cadastro: ${u.name || u.email || "Usuário"}`,
        time: "Recentemente",
        read: seenIds.has(id), // Mark as read if seen
      });
    });

    // 2. Payments from subscriptions (active status, paid plans)
    const subsData = extractData<any[]>(subsRes.status === 'fulfilled' ? subsRes.value : null);
    const subscriptions: any[] = subsData ?? [];
    
    subscriptions
      .filter((sub: any) => sub.status === "active" && sub.planName && sub.planName.toLowerCase() !== "free")
      .slice(0, 5)
      .forEach((sub: any) => {
        const id = `payment::${sub.id ?? idx}::${idx++}`;
        // Skip cleared notifications
        if (clearedIds.has(id)) return;
        notifications.push({
          id,
          type: "payment",
          message: `Pagamento recebido: R$ ${sub.amount || 0} - ${sub.planName || "Plano"}`,
          time: "Recentemente",
          read: seenIds.has(id), // Mark as read if seen
        });
      });

    console.log("[useAdminNotifications] fetched:", notifications.length, "notifications (seen:", seenIds.size, "cleared:", clearedIds.size, ")");
    return notifications;
  } catch (error) {
    console.error("[useAdminNotifications] Error:", error);
    return [];
  }
}

export function useAdminNotifications() {
  const queryClient = useQueryClient();
  const prevIdsRef = useRef<Set<string>>(new Set());
  const initialLoadRef = useRef(true);

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["admin", "notifications"],
    queryFn: fetchActivity,
    refetchInterval: POLL_INTERVAL,
    staleTime: 0,
  });

  // Detect new items after initial load
  useEffect(() => {
    if (notifications.length === 0) return;

    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      prevIdsRef.current = new Set(notifications.map((n) => n.id));
      return;
    }

    const newItems = notifications.filter((n) => !prevIdsRef.current.has(n.id));
    if (newItems.length === 0) return;

    newItems.slice(0, 3).forEach(toastForItem);
    if (newItems.length > 3) {
      toast(`+${newItems.length - 3} outras notificações`, { duration: 4000 });
    }

    prevIdsRef.current = new Set(notifications.map((n) => n.id));
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = useCallback((id: string) => {
    const seenIds = getSeenIds();
    seenIds.add(id);
    saveSeenIds(seenIds);
    queryClient.setQueryData<AdminNotification[]>(
      ["admin", "notifications"],
      (prev) => (prev ?? []).map((n) => n.id === id ? { ...n, read: true } : n)
    );
  }, [queryClient]);

  const markAllRead = useCallback(() => {
    const allSeenKeys = new Set(notifications.map((n) => n.id));
    saveSeenIds(allSeenKeys);
    queryClient.setQueryData<AdminNotification[]>(
      ["admin", "notifications"],
      (prev) => (prev ?? []).map((n) => ({ ...n, read: true }))
    );
  }, [notifications, queryClient]);

  const clearAll = useCallback(() => {
    const allKeys = new Set(notifications.map((n) => n.id));
    // merge with cleared existing
    const existing = getClearedKeys();
    allKeys.forEach((k) => existing.add(k));
    saveClearedKeys(existing);
    // also mark as read in localStorage
    saveSeenIds(new Set(notifications.map((n) => n.id)));
    queryClient.setQueryData<AdminNotification[]>(["admin", "notifications"], []);
  }, [notifications, queryClient]);

  return { notifications, isLoading, unreadCount, markRead, markAllRead, clearAll };
}
