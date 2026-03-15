"use client"

import { useState } from "react"
import type {
  FinanceState,
  IncomeItem,
  ExpenseItem,
  SavingsRecordItem,
  AppSettings,
  UXMode,
} from "@/types/finance"

const initialSettings: AppSettings = {
  budgetPeriod: "monthly",
  household: {
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
  bucketRules: [],
  investmentUnlockCondition: {
    maxDeficitRate: 0.05,
    maxFixedCostRate: 0.5,
    minSavingsRate: 0.2,
    targetEmergencyFundMonths: 6,
  },
  monthlyLivingCost: 0,
  currentEmergencyFund: 0,
  savingsGoalAmount: 0,
  savingsGoalPeriod: "1m",
}

const initialState: FinanceState = {
  settings: initialSettings,
  incomes: [],
  expenses: [],
  emotions: [],         // ← 追加
  budgets: [],          // ← 追加
  savingsRecords: [],
  deficit: 0,           // ← 追加
  savingGoal: 0,        // ← 追加
  uxMode: "standard" as UXMode,
  forecastPeriod: "6m", // ← 追加
}

export function useFinance() {
  const [state, setState] = useState<FinanceState>(initialState)

  const setIncomes = (incomes: IncomeItem[]) => setState((prev) => ({ ...prev, incomes }))
  const setExpenses = (expenses: ExpenseItem[]) => setState((prev) => ({ ...prev, expenses }))
  const setSavingsRecords = (savingsRecords: SavingsRecordItem[]) =>
    setState((prev) => ({ ...prev, savingsRecords }))
  const setUXMode = (uxMode: UXMode) => setState((prev) => ({ ...prev, uxMode }))
  const setSettings = (settings: AppSettings) => setState((prev) => ({ ...prev, settings }))

  return {
    state,
    setState,
    setIncomes,
    setExpenses,
    setSavingsRecords,
    setUXMode,
    setSettings,
  }
}