
export class PaypalUrlProvider {
  private readonly oauthBaseUrl: string;
  private readonly ordersBaseUrl: string;

  constructor() {
    const { PAYPAL_OAUTH_URL, PAYPAL_ORDERS_URL } = process.env;

    if (!PAYPAL_OAUTH_URL || !PAYPAL_ORDERS_URL) {
      throw new Error( "Hay variables de entorno que no están declaradas." );
    }
    this.oauthBaseUrl = PAYPAL_OAUTH_URL;
    this.ordersBaseUrl = PAYPAL_ORDERS_URL;
  }
  /** Obtiene la URL para obtener el Token de Paypal */
  public oauthUrl(): string {
    return this.oauthBaseUrl;
  }

  /** Devuelve la URL base de órdenes */
  public getListOrdersDetailsUrl(): string {
    return this.ordersBaseUrl;
  
  }
  /** Devuelve la URL base de órdenes */
  public getOrderDetailsUrl( transationId: string ): string {
    return `${this.ordersBaseUrl}/${transationId}`;
  }
}

const paypalUrlProvider = new PaypalUrlProvider();
export default paypalUrlProvider;