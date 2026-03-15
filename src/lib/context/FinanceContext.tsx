"use client"

import { createContext, useMemo, useState } from "react"
import type {
  AppSettings,
  ExpenseItem,
  FinanceState,
  IncomeItem,
  SavingsRecordItem,
  UXMode,
} from "@/types/finance"

type FinanceContextValue = {
  state: FinanceState
  setState: React.Dispatch<React.SetStateAction<FinanceState>>
  setIncomes: (incomes: IncomeItem[]) => void
  setExpenses: (expenses: ExpenseItem[]) => void
  setSavingsRecords: (savingsRecords: SavingsRecordItem[]) => void
  setUXMode: (uxMode: UXMode) => void
  setSettings: (settings: AppSettings) => void
  deleteExpense: (id: string) => void
  updateIncome: (item: IncomeItem) => void
}

export const FinanceContext = createContext<FinanceContextValue | null>(null)

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<FinanceState>({
    incomes: [],
    expenses: [],
    emotions: [],
    budgets: [],
    savingsRecords: [],
    deficit: 0,
    savingGoal: 0,
    uxMode: "standard",
    forecastPeriod: "6m",
    settings: {
      budgetPeriod: "monthly",        // ← 追加
      household: {                    // ← 追加
        familySize: "1",
        housing: {
          type: "rent",
          monthlyRent: 0,
          monthlyMortgage: 0,
          monthlyManagementFee: 0,
          monthlyRepairReserve: 0,
          monthlyParkingFee: 0,
        },
      },
      bucketRules: [],                // ← 追加
      investmentUnlockCondition: {
        maxDeficitRate: 0.2,
        maxFixedCostRate: 0.6,
        minSavingsRate: 0.1,
        targetEmergencyFundMonths: 6,
      },
      monthlyLivingCost: 0,
      currentEmergencyFund: 0,
      savingsGoalAmount: 0,
      savingsGoalPeriod: "1m",
    },
  })

  const setIncomes = (incomes: IncomeItem[]) => setState((prev) => ({ ...prev, incomes }))
  const setExpenses = (expenses: ExpenseItem[]) => setState((prev) => ({ ...prev, expenses }))
  const setSavingsRecords = (savingsRecords: SavingsRecordItem[]) =>
    setState((prev) => ({ ...prev, savingsRecords }))
  const setUXMode = (uxMode: UXMode) => setState((prev) => ({ ...prev, uxMode }))
  const setSettings = (settings: AppSettings) => setState((prev) => ({ ...prev, settings }))

  const deleteExpense = (id: string) =>
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((x: ExpenseItem) => x.id !== id),
    }))

  const updateIncome = (item: IncomeItem) =>
    setState((prev) => ({
      ...prev,
      incomes: prev.incomes.map((x: IncomeItem) => (x.id === item.id ? item : x)),
    }))

  const value: FinanceContextValue = useMemo(
    () => ({
      state,
      setState,
      setIncomes,
      setExpenses,
      setSavingsRecords,
      setUXMode,
      setSettings,
      deleteExpense,
      updateIncome,
    }),
    [state]
  )

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}