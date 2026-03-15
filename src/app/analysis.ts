import type { ExpenseItem, IncomeItem } from "@/types/finance"
import { sumExpenseItems, sumIncomeItems } from "@/lib/calc/basic"

export type ExpenseAnalysisResult = {
  topCategory: string | null
  topCategoryAmount: number
  fixedCostTotal: number
  variableCostTotal: number
  impulseBuyCount: number
  impulseBuyAmount: number
  riskLevel: "low" | "medium" | "high"
  insights: string[]
}

function buildMonthKey(date: string) {
  const d = new Date(date)
  return `${d.getFullYear()}-${d.getMonth() + 1}`
}

function getMonthlyAverageExpense(expenses: ExpenseItem[]) {
  if (expenses.length === 0) return 0

  const monthKeys = new Set(expenses.map((item) => buildMonthKey(item.date)))
  const total = sumExpenseItems(expenses)

  return total / Math.max(monthKeys.size, 1)
}

export function analyzeExpenses(
  incomes: IncomeItem[],
  expenses: ExpenseItem[]
): ExpenseAnalysisResult {
  const insights: string[] = []

  if (expenses.length === 0) {
    return {
      topCategory: null,
      topCategoryAmount: 0,
      fixedCostTotal: 0,
      variableCostTotal: 0,
      impulseBuyCount: 0,
      impulseBuyAmount: 0,
      riskLevel: "low",
      insights: ["まだ支出データが少ないため、分析結果はこれから充実します。"],
    }
  }

  const categoryMap = new Map<string, number>()

  for (const item of expenses) {
    categoryMap.set(item.category, (categoryMap.get(item.category) ?? 0) + item.amount)
  }

  let topCategory: string | null = null
  let topCategoryAmount = 0

  for (const [category, amount] of categoryMap.entries()) {
    if (amount > topCategoryAmount) {
      topCategory = category
      topCategoryAmount = amount
    }
  }

  const fixedCostTotal = expenses
    .filter((item) => item.type === "fixed")
    .reduce((sum, item) => sum + item.amount, 0)

  const variableCostTotal = expenses
    .filter((item) => item.type === "variable")
    .reduce((sum, item) => sum + item.amount, 0)

  // Use the correct value from NecessityLevel type or enum
  const impulseItems = expenses.filter((item) => item.necessity === "impulse" as typeof item.necessity)
  const impulseBuyCount = impulseItems.length
  const impulseBuyAmount = impulseItems.reduce((sum, item) => sum + item.amount, 0)

  const totalExpense = sumExpenseItems(expenses)
  const totalIncome = sumIncomeItems(incomes)
  const averageMonthlyExpense = getMonthlyAverageExpense(expenses)

  if (topCategory) {
    insights.push(`最も支出が大きいカテゴリは ${topCategory} です。`)
  }

  if (totalExpense > 0 && fixedCostTotal / totalExpense >= 0.5) {
    insights.push("固定費の比率が高めです。毎月の自動で出る支出を優先して見直すと効果が出やすいです。")
  }

  if (impulseBuyAmount > 0) {
    insights.push("衝動買いに分類された支出があります。感情ログと一緒に振り返ると改善しやすいです。")
  }

  if (totalIncome > 0 && totalExpense > totalIncome) {
    insights.push("支出が収入を上回っています。短期的には変動費の抑制、長期的には固定費の見直しが有効です。")
  }

  if (averageMonthlyExpense > 0 && impulseBuyAmount >= averageMonthlyExpense * 0.1) {
    insights.push("衝動買いの割合が高めです。先に予算上限を決めてから買う運用がおすすめです。")
  }

  let riskLevel: "low" | "medium" | "high" = "low"

  if (
    (totalIncome > 0 && totalExpense > totalIncome) ||
    (totalExpense > 0 && fixedCostTotal / totalExpense >= 0.6)
  ) {
    riskLevel = "high"
  } else if (
    (totalExpense > 0 && fixedCostTotal / totalExpense >= 0.45) ||
    impulseBuyAmount > 0
  ) {
    riskLevel = "medium"
  }

  return {
    topCategory,
    topCategoryAmount,
    fixedCostTotal,
    variableCostTotal,
    impulseBuyCount,
    impulseBuyAmount,
    riskLevel,
    insights,
  }
}