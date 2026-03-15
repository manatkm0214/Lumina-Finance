"use client"

import { useContext, useMemo } from "react"
import type { ReactNode } from "react"
import { FinanceContext } from "@/lib/context/FinanceContext"
import { useFinance } from "@/hooks/useFinance"
import type { ExpenseItem, IncomeItem } from "@/types/finance"

export function FinanceProvider({ children }: { children: ReactNode }) {
  const finance = useFinance()

  const value = useMemo(
    () => ({
      ...finance,
      deleteExpense: (id: string) => {
        finance.setState((prev) => ({
          ...prev,
          expenses: prev.expenses.filter((x: ExpenseItem) => x.id !== id),
        }))
      },
      updateIncome: (item: IncomeItem) => {
        finance.setState((prev) => ({
          ...prev,
          incomes: prev.incomes.map((x: IncomeItem) => (x.id === item.id ? item : x)),
        }))
      },
    }),
    [finance]
  )

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

export function useFinanceProvider() {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error("FinanceContext.Provider でラップしてください")
  }

  return {
    ...context,
    setUxMode: context.setUXMode,
  }
}