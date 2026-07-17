export type PaymentProvider = "billplz" | "toyyibpay" | "stripe" | "tng" | "grabpay" | "duitnow" | "shopeepay";

export type CreateBillParams = {
  amount: number; // in MYR
  currency: "MYR" | "USD";
  email: string;
  name: string;
  description: string;
  redirectUrl?: string;
  callbackUrl?: string;
};

export type Bill = {
  id: string;
  url: string;
  provider: PaymentProvider;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed";
  createdAt: string;
};

export type PaymentCallback = {
  billId: string;
  provider: PaymentProvider;
  amount: number;
  status: "paid" | "failed";
  transactionId?: string;
  signatureValid: boolean;
};
