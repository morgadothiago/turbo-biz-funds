import type { VercelRequest, VercelResponse } from "@vercel/node";
import https from "https";
import axios from "axios";

const IS_PROD = process.env.EFI_ENV === "production";
const BASE_URL = IS_PROD ? "https://pix.api.efipay.com.br" : "https://pix-h.api.efipay.com.br";
const CLIENT_ID = IS_PROD ? process.env.EFI_CLIENT_ID_PROD! : process.env.EFI_CLIENT_ID_SANDBOX!;
const CLIENT_SECRET = IS_PROD ? process.env.EFI_CLIENT_SECRET_PROD! : process.env.EFI_CLIENT_SECRET_SANDBOX!;

function getAgent() {
  const certBuffer = Buffer.from(process.env.EFI_CERT_BASE64!, "base64");
  return new https.Agent({ pfx: certBuffer, passphrase: "" });
}

async function getToken(agent: https.Agent) {
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
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { txid } = req.query;
  if (!txid || typeof txid !== "string") return res.status(400).json({ error: "txid obrigatório" });

  try {
    const agent = getAgent();
    const token = await getToken(agent);

    const cobRes = await axios.get(`${BASE_URL}/v2/cob/${txid}`, {
      httpsAgent: agent,
      headers: { Authorization: `Bearer ${token}` },
    });

    const { status } = cobRes.data;
    // status: ATIVA | CONCLUIDA | REMOVIDA_PELO_USUARIO_RECEBEDOR | REMOVIDA_PELO_PSP
    return res.status(200).json({ status, paid: status === "CONCLUIDA" });
  } catch (err) {
    console.error("[PIX STATUS] Erro:", err);
    return res.status(500).json({ error: "Erro ao consultar PIX" });
  }
}
