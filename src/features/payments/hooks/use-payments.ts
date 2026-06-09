import { useMutation } from "@tanstack/react-query";
import { api, apiEndpoints } from "@/lib/api/client";

export interface PaymentIntentPayload {
  plan: string;
  method: "cartao" | "pix";
}

export interface PaymentIntent {
  paymentId: string;
  method: "cartao" | "pix";
  status: string;
  expiresAt?: string;
  pix?: {
    qrCodeBase64: string;
    qrCodeText: string;
    expiresInSeconds: number;
  };
  amount: number;
  currency: string;
}

export interface ConfirmCardPayload {
  paymentToken: string;
  holderName: string;
  cpf: string;
  installments: number;
}

export function useCreatePaymentIntent() {
  return useMutation({
    mutationFn: (payload: PaymentIntentPayload) =>
      api.post<{ data: PaymentIntent }>(apiEndpoints.payments.intent, payload),
  });
}

export function useConfirmCardPayment() {
  return useMutation({
    mutationFn: ({ paymentId, ...payload }: ConfirmCardPayload & { paymentId: string }) =>
      api.post<{ data: { paymentId: string; status: string; subscription: unknown } }>(
        apiEndpoints.payments.confirm(paymentId),
        payload
      ),
  });
}

export function useCheckPaymentStatus() {
  return useMutation({
    mutationFn: (paymentId: string) =>
      api.get<{ data: { paymentId: string; status: string; method: string; subscription?: unknown } }>(
        apiEndpoints.payments.status(paymentId)
      ),
  });
}
