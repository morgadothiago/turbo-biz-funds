interface EfiPayCreditCardParams {
  brand: string;
  number: string;
  cvv: string;
  expirationMonth: string;
  expirationYear: string;
  holderName: string;
}

interface EfiPayInstance {
  CreditCard: {
    getPaymentToken(params: EfiPayCreditCardParams): Promise<{ data: { payment_token: string; card_mask: string } }>;
  };
}

declare const EfiJs: new (clientId: string) => EfiPayInstance;
declare const EfiPay: new (clientId: string) => EfiPayInstance;
