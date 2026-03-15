"use client"

import { createContext } from "react"
import type { FinanceState } from "@/types/finance"

export type FinanceContextType = {

  state: FinanceState

  totalIncome: number
  totalExpense: number
  balance: number

  addIncome: (input: any) => void
  updateIncome: (id: string, input: any) => void
  deleteIncome: (id: string) => void

  addExpense: (input: any) => void
  updateExpense: (id: string, input: any) => void
  deleteExpense: (id: string) => void

  addEmotion: (input: any) => void
  deleteEmotion: (id: string) => void

  addBudget: (input: any) => void
  deleteBudget: (id: string) => void

  resetAll: () => void
}

export const FinanceContext =
  createContext<FinanceContextType | null>(null)