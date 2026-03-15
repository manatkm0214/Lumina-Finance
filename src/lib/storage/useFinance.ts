"use client"

import { useEffect, useMemo, useState } from "react"
import {
  clearFinanceState,
  createDefaultFinanceState,
  loadFinanceState,
  saveFinanceState,
} from "@/lib/storage/financeStorage" // ← constants ではなく実ファイルに合わせる
import type {
  EmotionFormValue,
  EmotionLogItem,
  ExpenseFormValue,
  ExpenseItem,
  FinanceState,
  IncomeFormValue,
  IncomeItem,// 追加
  BudgetItem,      // 追加
} from "@/types/finance"

function generateId() {
  return crypto.randomUUID()
}

function nowIso() {
  return new Date().toISOString()
}

export function useFinance() {
  const [state, setState] = useState<FinanceState>(createDefaultFinanceState()) // 明示
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loadedState: FinanceState = loadFinanceState()
    setState(loadedState)
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    saveFinanceState(state)
  }, [state, isLoaded])

  const totalIncome = useMemo(() => {
    return state.incomes.reduce((sum, item) => sum + item.amount, 0)
  }, [state.incomes])

  const totalExpense = useMemo(() => {
    return state.expenses.reduce((sum, item) => sum + item.amount, 0)
  }, [state.expenses])

  const balance = useMemo(() => {
    return totalIncome - totalExpense
  }, [totalIncome, totalExpense])

  const addIncome = (input: IncomeFormValue) => {
    const timestamp = nowIso()

    const newItem: IncomeItem = {
      id: generateId(),
      date: input.date,
      category: input.category,
      amount: Number(input.amount),
      memo: input.memo,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    setState((prev) => ({
      ...prev,
      incomes: [newItem, ...prev.incomes],
    }))

    return newItem
  }

  const updateIncome = (id: string, input: IncomeFormValue) => {
    setState((prev) => ({
      ...prev,
      incomes: prev.incomes.map((item) =>
        item.id === id
          ? {
              ...item,
              date: input.date,
              category: input.category,
              amount: Number(input.amount),
              memo: input.memo,
              updatedAt: nowIso(),
            }
          : item
      ),
    }))
  }

  const deleteIncome = (id: string) => {
    setState((prev) => ({
      ...prev,
      incomes: prev.incomes.filter((item) => item.id !== id),
    }))
  }

  const addExpense = (input: ExpenseFormValue) => {
    const timestamp = nowIso()

    const newItem: ExpenseItem = {
      id: generateId(),
      date: input.date,
      category: input.category,
      subCategory: input.subCategory,
      amount: Number(input.amount),
      paymentMethod: input.paymentMethod,
      account: input.account,
      costType: input.costType,
      necessity: input.necessity,
      memo: input.memo,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    setState((prev) => ({
      ...prev,
      expenses: [newItem, ...prev.expenses],
    }))

    return newItem
  }

  const updateExpense = (id: string, input: ExpenseFormValue) => {
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.map((item) =>
        item.id === id
          ? {
              ...item,
              date: input.date,
              category: input.category,
              subCategory: input.subCategory,
              amount: Number(input.amount),
              paymentMethod: input.paymentMethod,
              account: input.account,
              costType: input.costType,
              necessity: input.necessity,
              memo: input.memo,
              updatedAt: nowIso(),
            }
          : item
      ),
    }))
  }

  const deleteExpense = (id: string) => {
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((item) => item.id !== id),
      emotions: prev.emotions.map((emotion) =>
        emotion.relatedExpenseId === id
          ? { ...emotion, relatedExpenseId: undefined, updatedAt: nowIso() }
          : emotion
      ),
    }))
  }

  const addEmotion = (input: EmotionFormValue) => {
    const timestamp = nowIso()

    const newItem: EmotionLogItem = {
      id: generateId(),
      date: input.date,
      emotion: input.emotion,
      trigger: input.trigger,
      intensity: input.intensity,
      note: input.note,
      relatedExpenseId: input.relatedExpenseId,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    setState((prev) => ({
      ...prev,
      emotions: [newItem, ...prev.emotions],
    }))

    return newItem
  }

  const updateEmotion = (id: string, input: EmotionFormValue) => {
    setState((prev) => ({
      ...prev,
      emotions: prev.emotions.map((item) =>
        item.id === id
          ? {
              ...item,
              date: input.date,
              emotion: input.emotion,
              trigger: input.trigger,
              intensity: input.intensity,
              note: input.note,
              relatedExpenseId: input.relatedExpenseId,
              updatedAt: nowIso(),
            }
          : item
      ),
    }))
  }

  const deleteEmotion = (id: string) => {
    setState((prev) => ({
      ...prev,
      emotions: prev.emotions.filter((item) => item.id !== id),
    }))
  }

  interface BudgetFormValue {
    category: string
    amount: number | string
    period: string
    alertThresholdPercent: number | string
  }

  const addBudget = (input: BudgetFormValue): BudgetItem => {
    const timestamp = nowIso()

    const newItem: BudgetItem = {
      id: generateId(),
      category: input.category as BudgetItem["category"],
      amount: Number(input.amount),
      period: input.period as BudgetItem["period"],
      alertThresholdPercent: Number(input.alertThresholdPercent),
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    setState((prev) => ({
      ...prev,
      budgets: [newItem, ...prev.budgets],
    }))

    return newItem
  }

  const updateBudget = (id: string, input: BudgetFormValue) => {
    setState((prev) => ({
      ...prev,
      budgets: prev.budgets.map((item: BudgetItem) =>
        item.id === id
          ? {
              ...item,
              category: input.category as BudgetItem["category"],
              amount: Number(input.amount),
              period: input.period as BudgetItem["period"],
              alertThresholdPercent: Number(input.alertThresholdPercent),
              updatedAt: nowIso(),
            }
          : item
      ),
    }))
  }

  const deleteBudget = (id: string) => {
    setState((prev) => ({
      ...prev,
      budgets: prev.budgets.filter((item) => item.id !== id),
    }))
  }

  const updateSettings = (nextSettings: FinanceState["settings"]) => {
    setState((prev) => ({
      ...prev,
      settings: nextSettings,
    }))
  }

  const resetAll = () => {
    clearFinanceState()
    setState(createDefaultFinanceState())
  }

  return {
    state,
    setState,
    isLoaded,

    totalIncome,
    totalExpense,
    balance,

    addIncome,
    updateIncome,
    deleteIncome,

    addExpense,
    updateExpense,
    deleteExpense,

    addEmotion,
    updateEmotion,
    deleteEmotion,

    addBudget,
    updateBudget,
    deleteBudget,

    updateSettings,
    resetAll,
  }
}