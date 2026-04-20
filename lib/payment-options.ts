export const PAYMENT_OPTIONS = {
  deposit: {
    label: "Deposit",
    amount: 500,
    description: "Code School of Guam deposit",
  },
  monthlyInstallment: {
    label: "Monthly Installment",
    amount: 2500,
    description: "Code School of Guam monthly installment",
  },
  fullTuition: {
    label: "Full Tuition",
    amount: 7500,
    description: "Code School of Guam full tuition",
  },
} as const

export type FixedPaymentOption = keyof typeof PAYMENT_OPTIONS
export type PaymentOption = FixedPaymentOption | "other"

export const CUSTOM_PAYMENT_LIMITS = {
  min: 1,
  max: 7500,
} as const

export function isFixedPaymentOption(value: unknown): value is FixedPaymentOption {
  return typeof value === "string" && value in PAYMENT_OPTIONS
}

export function sanitizePaymentDescription(value: unknown): string {
  if (typeof value !== "string") return "Code School of Guam custom payment"

  const normalized = value.replace(/\s+/g, " ").trim()
  if (!normalized) return "Code School of Guam custom payment"

  return normalized.slice(0, 120)
}
