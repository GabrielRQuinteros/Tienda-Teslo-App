import { PaypalLoginResponse, PaypalOrderDetails } from "../interfaces";
import paypalUrlProvider from "../PaypalUrlProvider";

export class PaypalClient {
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor() {
    const { NEXT_PUBLIC_PAYPAL_CLIENT_ID, PAYPAL_SECRET } = process.env;
    if (!NEXT_PUBLIC_PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
      throw new Error("Faltan las credenciales de Paypal");
    }

    this.clientId = NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    this.clientSecret = PAYPAL_SECRET;
  }

  /** Obtiene un access token de PayPal */
  async getAccessToken(): Promise<string> {

    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64");

    const response = await fetch(paypalUrlProvider.oauthUrl(), {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      cache: 'no-store',
      body: new URLSearchParams({ grant_type: "client_credentials" }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Error al obtener token de PayPal: ${text}`);
    }
    const data = (await response.json() as PaypalLoginResponse);
    return data.access_token;
  }

  
  async getOrderDetails(paypalTransactionId: string): Promise<PaypalOrderDetails> {
    const token = await this.getAccessToken();
    const response = await fetch(paypalUrlProvider.getOrderDetailsUrl(paypalTransactionId), {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Error al capturar orden PayPal: ${text} ${paypalUrlProvider.getOrderDetailsUrl(paypalTransactionId)} ${token} ${response}`);
    }
    return (await response.json() as PaypalOrderDetails);
  }
}

const paypalClient = new PaypalClient();
export default paypalClient;