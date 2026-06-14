import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { storage } from "../storage";

// Em dev: VITE_API_URL vazio → URL relativa → proxy do Vite encaminha para a API real (sem CORS)
// Em produção: VITE_API_URL deve ser a URL completa da API
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

if (import.meta.env.PROD && !API_BASE_URL) {
  console.warn("[config] VITE_API_URL não definida em produção. As chamadas de API usarão URL relativa.");
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

function createApiClient(): AxiosInstance {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = storage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string; code?: string }>) => {
      const status = error.response?.status;
      const message =
        error.response?.data?.message || error.message || "Erro desconhecido";
      const code = error.response?.data?.code;

      const isAuthEndpoint = error.config?.url?.startsWith("/v1/auth/");
      if (status === 401 && !isAuthEndpoint) {
        storage.clear();
        window.dispatchEvent(new CustomEvent("auth:session-expired"));
      }

      const apiError: ApiError = { message, status: status ?? 0, code };
      return Promise.reject(apiError);
    }
  );

  return instance;
}

function createPublicApiClient(): AxiosInstance {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export const http = createApiClient();
export const publicHttp = createPublicApiClient();

export const api = {
  get<T>(endpoint: string) {
    return http.get<T>(endpoint).then((r) => r.data);
  },
  post<T>(endpoint: string, data?: unknown) {
    return http.post<T>(endpoint, data).then((r) => r.data);
  },
  put<T>(endpoint: string, data: unknown) {
    return http.put<T>(endpoint, data).then((r) => r.data);
  },
  patch<T>(endpoint: string, data: unknown) {
    return http.patch<T>(endpoint, data).then((r) => r.data);
  },
  delete<T>(endpoint: string) {
    return http.delete<T>(endpoint).then((r) => r.data);
  },
};

export const publicApi = {
  get<T>(endpoint: string) {
    return publicHttp.get<T>(endpoint).then((r) => r.data);
  },
  post<T>(endpoint: string, data?: unknown) {
    return publicHttp.post<T>(endpoint, data).then((r) => r.data);
  },
  put<T>(endpoint: string, data: unknown) {
    return publicHttp.put<T>(endpoint, data).then((r) => r.data);
  },
  patch<T>(endpoint: string, data: unknown) {
    return publicHttp.patch<T>(endpoint, data).then((r) => r.data);
  },
  delete<T>(endpoint: string) {
    return publicHttp.delete<T>(endpoint).then((r) => r.data);
  },
};

export const apiEndpoints = {
  auth: {
    login: "/v1/auth/login",
    register: "/v1/auth/register",
    logout: "/v1/auth/logout",
    forgotPassword: "/v1/auth/forgot-password",
    resetPassword: "/v1/auth/reset-password",
  },
  categories: {
    list: "/v1/categories",
    create: "/v1/categories",
    update: (id: string) => `/v1/categories/${id}`,
    delete: (id: string) => `/v1/categories/${id}`,
  },
  transactions: {
    list: "/v1/transactions",
    create: "/v1/transactions",
    update: (id: string) => `/v1/transactions/${id}`,
    delete: (id: string) => `/v1/transactions/${id}`,
  },
  summary: {
    balance: "/v1/summary/balance",
    categories: "/v1/summary/categories",
  },
  recurrences: {
    create: "/v1/recurrences",
    update: (id: string) => `/v1/recurrences/${id}`,
    delete: (id: string) => `/v1/recurrences/${id}`,
    active: "/v1/recurrences/active",
    generate: "/v1/recurrences/generate",
  },
  lgpd: {
    export: "/v1/lgpd/export",
    delete: "/v1/lgpd",
  },
  goals: {
    list: "/v1/goals",
    create: "/v1/goals",
    update: (id: string) => `/v1/goals/${id}`,
    delete: (id: string) => `/v1/goals/${id}`,
  },
  cards: {
    list: "/v1/cards",
    create: "/v1/cards",
    update: (id: string) => `/v1/cards/${id}`,
    delete: (id: string) => `/v1/cards/${id}`,
  },
  notifications: {
    list: "/v1/notifications",
    markRead: (id: string) => `/v1/notifications/${id}/read`,
    markAllRead: "/v1/notifications/read-all",
  },
  plans: {
    list: "/v1/plans",
    get: (id: string) => `/v1/plans/${id}`,
  },
  payments: {
    intent: "/v1/payments/intent",
    confirm: (paymentId: string) => `/v1/payments/${paymentId}/confirm`,
    status: (paymentId: string) => `/v1/payments/${paymentId}/status`,
  },
  admin: {
    stats: "/v1/admin/stats",
    revenue: "/v1/admin/revenue",
    revenueChart: "/v1/admin/revenue/chart",
    cashflow: "/v1/admin/cashflow",
    users: "/v1/admin/users",
    user: (id: string) => `/v1/admin/users/${id}`,
    userGrowth: "/v1/admin/users/growth",
    clients: "/v1/admin/clients",
    subscriptions: "/v1/admin/subscriptions",
    plans: "/v1/admin/plans",
    plan: (id: string) => `/v1/admin/plans/${id}`,
    planDistribution: "/v1/admin/plans/distribution",
    activity: "/v1/admin/activity",
    churn: "/v1/admin/churn",
    reportsExport: "/v1/admin/reports/export",
  },
} as const;
