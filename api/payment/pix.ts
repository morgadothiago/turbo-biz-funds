import type { VercelRequest, VercelResponse } from "@vercel/node";
import https from "https";
import axios from "axios";

const IS_PROD = process.env.EFI_ENV === "production";

const BASE_URL = IS_PROD
  ? "https://pix.api.efipay.com.br"
  : "https://pix-h.api.efipay.com.br";

const CLIENT_ID = IS_PROD
  ? process.env.EFI_CLIENT_ID_PROD!
  : process.env.EFI_CLIENT_ID_SANDBOX!;

const CLIENT_SECRET = IS_PROD
  ? process.env.EFI_CLIENT_SECRET_PROD!
  : process.env.EFI_CLIENT_SECRET_SANDBOX!;

const PIX_KEY = process.env.EFI_PIX_KEY!;

function getAgent() {
  const certBase64 = process.env.EFI_CERT_BASE64!;
  const certBuffer = Buffer.from(certBase64, "base64");
  return new https.Agent({ pfx: certBuffer, passphrase: "" });
}

async function getToken(agent: https.Agent): Promise<string> {
  const res = await axios.post(
    `${BASE_URL}/oauth/token`,
    { grant_type: "client_credentials" },
    {
      httpsAgent: agent,
      auth: { username: CLIENT_ID, password: CLIENT_SECRET },
      headers: { "Content-Type": "application/json" },
    }
  );
  return res.data.access_token;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { amount, description } = req.body as { amount: number; description: string };

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Valor inválido" });
  }

  try {
    const agent = getAgent();
    const token = await getToken(agent);

    // Cria cobrança imediata PIX (cob)
    const cobRes = await axios.post(
      `${BASE_URL}/v2/cob`,
      {
        calendario: { expiracao: 3600 },
        valor: { original: Number(amount).toFixed(2) },
        chave: PIX_KEY,
        solicitacaoPagador: description || "DoutorCash - Assinatura",
      },
      {
        httpsAgent: agent,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      }
    );

    const { txid, loc } = cobRes.data;

    // Busca QR code
    const qrRes = await axios.get(`${BASE_URL}/v2/loc/${loc.id}/qrcode`, {
      httpsAgent: agent,
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.status(200).json({
      txid,
      pixCopiaECola: qrRes.data.pixCopiaECola,
      qrcode: qrRes.data.imagemQrcode,
    });
  } catch (err: unknown) {
    console.error("[PIX] Erro:", err);
    const message =
      axios.isAxiosError(err)
        ? err.response?.data?.message ?? err.message
        : "Erro ao gerar PIX";
    return res.status(500).json({ error: message });
  }
}
