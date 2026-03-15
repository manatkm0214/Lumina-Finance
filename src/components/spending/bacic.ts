// src/lib/calc/basic.ts

import type { ExpenseItem, IncomeItem } from "@/types/finance"

export function sumIncomeItems(items: IncomeItem[]): number {
  return items.reduce((sum, item) => sum + item.amount, 0)
}

export function sumExpenseItems(items: ExpenseItem[]): number {
  return items.reduce((sum, item) => sum + item.amount, 0)
}

export function calculateBalance(incomes: IncomeItem[], expenses: ExpenseItem[]): number {
  return sumIncomeItems(incomes) - sumExpenseItems(expenses)
}

export function savingsRate(incomes: IncomeItem[], expenses: ExpenseItem[]): number {
  const totalIncome = sumIncomeItems(incomes)
  const totalExpense = sumExpenseItems(expenses)

  if (totalIncome <= 0) return 0

  return (totalIncome - totalExpense) / totalIncome
}

export function deficitRate(incomes: IncomeItem[], expenses: ExpenseItem[]): number {
  const totalIncome = sumIncomeItems(incomes)
  const totalExpense = sumExpenseItems(expenses)

  if (totalIncome <= 0) {
    return totalExpense > 0 ? 1 : 0
  }

  if (totalExpense <= totalIncome) return 0

  return (totalExpense - totalIncome) / totalIncome
}

export function fixedCostRate(expenses: ExpenseItem[]): number {
  const totalExpense = sumExpenseItems(expenses)

  if (totalExpense <= 0) return 0

  const fixedExpenseTotal = expenses
    .filter((item) => item.costType === "fixed")
    .reduce((sum, item) => sum + item.amount, 0)

  return fixedExpenseTotal / totalExpense
}

export function formatPercent(rate: number): string {
  return `${Math.round(rate * 100)}%`
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getDeficitAlertLevel(rate: number): "safe" | "caution" | "warning" | "danger" {
  if (rate >= 0.2) return "danger"
  if (rate >= 0.1) return "warning"
  if (rate >= 0.05) return "caution"
  return "safe"
}

export function getDeficitAlertMessage(rate: number): string {
  const level = getDeficitAlertLevel(rate)

  switch (level) {
    case "danger":
      return "危険：赤字率が20%以上です。支出の見直しを急ぎましょう。"
    case "warning":
      return "警告：赤字率が10%以上です。固定費と変動費を確認しましょう。"
    case "caution":
      return "注意：赤字傾向があります。早めに調整すると立て直しやすいです。"
    default:
      return "安全：収支は安定しています。"
  }
}

export function filterItemsByYearMonth<T extends { date: string }>(
  items: T[],
  year: number,
  month: number
): T[] {
  return items.filter((item) => {
    const date = new Date(item.date)
    return date.getFullYear() === year && date.getMonth() + 1 === month
  })
}