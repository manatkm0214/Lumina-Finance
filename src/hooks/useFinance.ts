import { useState } from "react"

export type UXMode = "standard" | "cheer" | "spartan"

export type ExpenseCategory =
  | "food"
  | "daily"
  | "housing"
  | "utility"
  | "communication"
  | "daily"
  | "transport"
  | "entertainment"
  | "medical"
  | "education"
  | "other"

export interface ExpenseItem {
  id: string
  amount: number
  category: ExpenseCategory
  date: string
  memo: string
}
export type SavingsGoalPeriod = "1m" | "12m"

export interface IncomeItem {
  id: string
  date: string
  source: string
  amount: number
  memo: string
}

const expenses: ExpenseItem[] = [
  {
    id: "1",
    amount: 1200,
    category: "food",
    date: "2026-03-15",
    memo: "ランチ"
  }
]

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

export function useFinance() {
  const [state, setState] = useState<FinanceState>({
    incomes: [],
    expenses: [],
    uxMode: "standard",
  })

  const setIncomes = (incomes: IncomeItem[]) => {
    setState((prev) => ({
      ...prev,
      incomes,
    }))
  }

  const setExpenses = (expenses: ExpenseItem[]) => {
    setState((prev) => ({
      ...prev,
      expenses,
    }))
  }

  const setUXMode = (mode: UXMode) => {
    setState((prev) => ({
      ...prev,
      uxMode: mode,
    }))
  }

  return {
    state,
    setIncomes,
    setExpenses,
    setUXMode,
  }
}