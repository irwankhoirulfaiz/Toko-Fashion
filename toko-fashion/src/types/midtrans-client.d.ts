declare module "midtrans-client" {
  type SnapConfig = { isProduction: boolean; serverKey: string; clientKey?: string };

  type TransactionParams = {
    transaction_details: { order_id: string; gross_amount: number };
    customer_details?: { first_name?: string; phone?: string; email?: string };
    item_details?: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
  };

  class Snap {
    constructor(config: SnapConfig);
    createTransaction(
      params: TransactionParams
    ): Promise<{ token: string; redirect_url: string }>;
  }

  const midtransClient: { Snap: typeof Snap };
  export default midtransClient;
}
