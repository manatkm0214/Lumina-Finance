export type UXMode = "standard" | "cheer" | "spartan"

export type ExpenseCategory =
  | "food"
  | "housing"
  | "utility"
  | "communication"
  | "daily"
  | "transport"
  | "entertainment"
  | "medical"
  | "other"

export type SavingsGoalPeriod = "1m" | "12m"

export interface IncomeItem {
  id: string
  date: string
  source: string
  amount: number
  memo: string
}

export interface ExpenseItem {
  id: string
  date: string
  category: ExpenseCategory
  amount: number
  memo: string
}

export interface FinanceState {
  incomes: IncomeItem[]
  expenses: ExpenseItem[]
  uxMode: UXMode
}

export interface AppSettings {
  monthlyLivingCost: number
  currentEmergencyFund: number
  savingsGoalAmount: number
  savingsGoalPeriod: SavingsGoalPeriod
}