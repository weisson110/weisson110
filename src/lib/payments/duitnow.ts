/**
 * DuitNow QR / TNG / GrabPay – e-Wallet QR for micro payments RM5/RM10
 * Malaysia: DuitNow QR is national QR standard, works with all e-Wallets
 * 
 * Real integration: Use Billplz's DuitNow QR or Razer Merchant Services
 * For demo: generates mock QR data URI
 */

import { CreateBillParams, Bill } from "./types";

export async function createDuitNowQR(params: CreateBillParams & { provider: "tng" | "grabpay" | "duitnow" | "shopeepay" }): Promise<Bill & { qrData: string }> {
  // In real integration:
  // - Billplz: set bill with category that enables DuitNow QR, then get QR image
  // - Or use Fiuu (formerly Razer) DuitNow QR API
  
  const mockQrData = `DuitNowQR:${params.provider.toUpperCase()}:AMOUNT=${params.amount}:CURRENCY=${params.currency}:REF=OPENROUTER_${Date.now()}:MERCHANT=OpenRouterClone`;

  return {
    id: `${params.provider}_qr_${Date.now()}`,
    url: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(mockQrData)}`,
    provider: params.provider as any,
    amount: params.amount,
    currency: params.currency,
    status: "pending",
    createdAt: new Date().toISOString(),
    qrData: mockQrData,
  };
}

export const FPX_BANKS = [
  { code: "MAYBANK", name: "Maybank2u", logo: "MBB", popular: true },
  { code: "CIMB", name: "CIMB Clicks", logo: "CIMB", popular: true },
  { code: "PUBLIC_BANK", name: "Public Bank", logo: "PBB", popular: true },
  { code: "RHB", name: "RHB Now", logo: "RHB", popular: true },
  { code: "BANK_ISLAM", name: "Bank Islam", logo: "BIMB", popular: true },
  { code: "BSN", name: "BSN", logo: "BSN", popular: false },
  { code: "BANK_MUAMALAT", name: "Bank Muamalat", logo: "BMMB", popular: false },
  { code: "HONG_LEONG", name: "Hong Leong", logo: "HLB", popular: true },
  { code: "AFFIN_BANK", name: "Affin Bank", logo: "AFFIN", popular: false },
  { code: "ALLIANCE", name: "Alliance Bank", logo: "ALLIANCE", popular: false },
  { code: "UOB", name: "UOB", logo: "UOB", popular: false },
  { code: "OCBC", name: "OCBC", logo: "OCBC", popular: false },
  { code: "HSBC", name: "HSBC", logo: "HSBC", popular: false },
  { code: "STANDARD_CHARTERED", name: "Standard Chartered", logo: "SC", popular: false },
  { code: "AM_BANK", name: "AmBank", logo: "AMBANK", popular: false },
  { code: "BANK_RAKYAT", name: "Bank Rakyat", logo: "BKRM", popular: false },
  { code: "AGRO_BANK", name: "Agrobank", logo: "AGRO", popular: false },
];

export const EWALLETS = [
  { code: "tng", name: "Touch 'n Go eWallet", color: "bg-blue-600", popular: true, minAmount: 1 },
  { code: "grabpay", name: "GrabPay", color: "bg-green-600", popular: true, minAmount: 1 },
  { code: "shopeepay", name: "ShopeePay", color: "bg-orange-500", popular: true, minAmount: 1 },
  { code: "boost", name: "Boost", color: "bg-red-600", popular: false, minAmount: 1 },
  { code: "duitnow", name: "DuitNow QR (All)", color: "bg-purple-600", popular: true, minAmount: 1 },
];
