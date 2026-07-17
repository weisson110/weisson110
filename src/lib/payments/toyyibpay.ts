/**
 * ToyyibPay Provider – Malaysia FPX alternative to Billplz
 * Docs: https://toyyibpay.com/apidoc/
 * Popular for SME, supports same FPX banks
 */

import { CreateBillParams, Bill } from "./types";

const TOYYIBPAY_API = "https://toyyibpay.com/index.php/api/createBill";

export async function createToyyibPayBill(params: CreateBillParams): Promise<Bill> {
  const apiKey = process.env.TOYYIBPAY_API_KEY;
  const categoryCode = process.env.TOYYIBPAY_CATEGORY_CODE;

  if (!apiKey || !categoryCode) {
    console.log("[ToyyibPay Mock] Creating bill:", params);
    return {
      id: `toyyibpay_${Date.now()}`,
      url: `/credits?mock_toyyibpay=success&amount=${params.amount}`,
      provider: "toyyibpay",
      amount: params.amount,
      currency: params.currency,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
  }

  try {
    const formData = new FormData();
    formData.append("userSecretKey", apiKey);
    formData.append("categoryCode", categoryCode);
    formData.append("billName", params.description.slice(0, 30));
    formData.append("billDescription", params.description);
    formData.append("billPriceSetting", "1");
    formData.append("billPayorInfo", "1");
    formData.append("billAmount", (params.amount * 100).toString());
    formData.append("billReturnUrl", params.redirectUrl || `${process.env.NEXT_PUBLIC_APP_URL}/credits?payment=success`);
    formData.append("billCallbackUrl", params.callbackUrl || `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/toyyibpay`);
    formData.append("billExternalReferenceNo", `OPENROUTER_${Date.now()}`);
    formData.append("billTo", params.name);
    formData.append("billEmail", params.email);
    formData.append("billPhone", "0123456789");

    const res = await fetch(TOYYIBPAY_API, { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok || !data[0]?.BillCode) throw new Error(`ToyyibPay error: ${JSON.stringify(data)}`);

    return {
      id: data[0].BillCode,
      url: `https://toyyibpay.com/${data[0].BillCode}`,
      provider: "toyyibpay",
      amount: params.amount,
      currency: params.currency,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
  } catch (e: any) {
    console.error("ToyyibPay failed, fallback mock:", e.message);
    return {
      id: `toyyibpay_mock_${Date.now()}`,
      url: `/credits?mock_toyyibpay=success&amount=${params.amount}`,
      provider: "toyyibpay",
      amount: params.amount,
      currency: params.currency,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
  }
}
