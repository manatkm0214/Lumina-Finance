"use client"

import { useContext } from "react"
import { FinanceContext } from "@/lib/context/FinanceContext"

export function useFinanceContext() {
  const ctx = useContext(FinanceContext)
  if (!ctx) throw new Error("FinanceContext.Provider でラップしてください")
  return ctx
}