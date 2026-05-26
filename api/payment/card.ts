import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

const IS_PROD = process.env.EFI_ENV === "production";
const BASE_URL = IS_PROD ? "https://cobrancas.api.efipay.com.br" : "https://cobrancas-h.api.efipay.com.br";
const CLIENT_ID = IS_PROD ? process.env.EFI_CLIENT_ID_PROD! : process.env.EFI_CLIENT_ID_SANDBOX!;
const CLIENT_SECRET = IS_PROD ? process.env.EFI_CLIENT_SECRET_PROD! : process.env.EFI_CLIENT_SECRET_SANDBOX!;

async function getToken() {
  const res = await axios.post(
    `${BASE_URL}/v1/authorize`,
    { grant_type: "client_credentials" },
    {
      auth: { username: CLIENT_ID, password: CLIENT_SECRET },
      headers: { "Content-Type": "application/json" },
    }
  );
  return res.data.access_token;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { amount, installments, paymentToken, customer, billingAddress } = req.body as {
    amount: number;
    installments: number;
    paymentToken: string;
    customer: {
      name: string;
      email: string;
      cpf: string;
      phone: string;
      birth: string;
    };
    billingAddress: {
      street: string;
      number: string;
      neighborhood: string;
      zipcode: string;
      city: string;
      state: string;
    };
  };

  if (!amount || !paymentToken || !customer?.cpf) {
    return res.status(400).json({ error: "Dados obrigatórios ausentes" });
  }

  try {
    const token = await getToken();

    // Cria a cobrança
    const chargeRes = await axios.post(
      `${BASE_URL}/v1/charge`,
      { items: [{ name: "DoutorCash - Assinatura", value: Math.round(amount * 100), amount: 1 }] },
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );

    const chargeId = chargeRes.data.data.charge_id;

    // Paga com cartão
    const payRes = await axios.post(
      `${BASE_URL}/v1/charge/${chargeId}/pay`,
      {
        payment: {
          banking_billet: undefined,
          credit_card: {
            installments,
            payment_token: paymentToken,
            billing_address: billingAddress,
            customer,
          },
        },
      },
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );

    return res.status(200).json({
      chargeId,
      status: payRes.data.data.status,
      installments,
    });
  } catch (err: unknown) {
    console.error("[CARD] Erro:", err);
    const message = axios.isAxiosError(err)
      ? err.response?.data?.message ?? err.message
      : "Erro ao processar cartão";
    return res.status(500).json({ error: message });
  }
}
