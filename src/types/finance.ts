export type SelectOption<T extends string> = {
  value: T
  label: string
}

export type UXMode = "standard" | "cheer" | "spartan"

export type IncomeCategory =
  | "salary"
  | "bonus"
  | "sideJob"
  | "allowance"
  | "pension"
  | "other"

export type ExpenseCategory =
  | "food"
  | "daily"
  | "housing"
  | "utilities"
  | "communication"
  | "transportation"
  | "medical"
  | "education"
  | "entertainment"
  | "beautyClothing"
  | "insurance"
  | "tax"
  | "other"
  // 既存コード互換（必要なら残す）
  | "utility"
  | "transport"
  | "social"
  | "subscription"
  | "special"

export type ExpenseSubCategory =
  | "homeCooking"
  | "eatingOut"
  | "cafe"
  | "groceries"
  | "detergent"
  | "rent"
  | "electricity"
  | "gas"
  | "water"
  | "mobile"
  | "internet"
  | "train"
  | "bus"
  | "hospital"
  | "medicine"
  | "books"
  | "movie"
  | "cosmetics"
  | "tops"
  | "lifeInsurance"
  | "residentTax"
  | "misc"

export type PaymentMethod =
  | "cash"
  | "debitCard"
  | "creditCard"
  | "bankTransfer"
  | "mobilePay"
  | "points"

export type AccountType =
  | "cash"
  | "mainBank"
  | "subBank"
  | "credit"
  | "eMoney"

export type CostType = "fixed" | "variable"

export type NecessityLevel = "essential" | "important" | "optional"

export type ForecastPeriod = "3m" | "6m" | "1y" | "3y" | "5y"

export type SavingsGoalPeriod = "1m" | "12m"

export type MoneyMode = "emergency" | "fullSave" | "normal"

export type GuardRank = "S" | "A" | "B" | "C" | "D"

export type DeficitLevel = "safe" | "caution" | "warning" | "danger"

export interface IncomeItem {
  id: string
  date: string
  source: string
  amount: number
  memo: string
}

export interface ExpenseItem {
  type: "fixed" | "variable"
  necessity: any
  costType: string
  id: string
  date: string
  category: ExpenseCategory
  amount: number
  memo: string
}

export type SavingsRecordType =
  | "regularSavings"
  | "fixedDeposit"
  | "ordinaryDeposit"
  | "investmentProfit"

export interface SavingsRecordItem {
  id: string
  date: string
  type: SavingsRecordType
  amount: number
  memo: string
}

export interface FinanceState {
  incomes: IncomeItem[]
  expenses: ExpenseItem[]
  savingsRecords: SavingsRecordItem[]
  uxMode: UXMode
}

export interface AppSettings {
  monthlyLivingCost: number
  currentEmergencyFund: number
  savingsGoalAmount: number
  savingsGoalPeriod: SavingsGoalPeriod
}

export interface MonthlySummary {
  month: string
  income: number
  expense: number
  balance: number
}