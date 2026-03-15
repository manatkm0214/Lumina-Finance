import type {
  ExpenseItem,
  IncomeItem,
} from "@/types/finance"
import { sumExpenseItems, sumIncomeItems } from "@/lib/calc/basic"

export type ForecastPeriod = "3m" | "6m" | "1y" | "3y" | "5y";

export const FORECAST_MONTHS: Record<ForecastPeriod, number> = {
  "3m": 3,
  "6m": 6,
  "1y": 12,
  "3y": 36,
  "5y": 60,
};

function getMonths(period: ForecastPeriod) {
  return FORECAST_MONTHS[period];
}

function getMonthlyAverageFromDatedItems<T extends { date: string; amount: number }>(
  items: T[]
) {
  if (items.length === 0) return 0

  const monthKeys = new Set(
    items.map((item) => {
      const d = new Date(item.date)
      return `${d.getFullYear()}-${d.getMonth() + 1}`
    })
  )

  const monthCount = Math.max(monthKeys.size, 1)
  const total = items.reduce((sum, item) => sum + item.amount, 0)

  return total / monthCount
}

export function calculateForecast(
  incomes: IncomeItem[],
  expenses: ExpenseItem[],
  period: ForecastPeriod
) {
  const months = getMonths(period)

  const averageMonthlyIncome = getMonthlyAverageFromDatedItems(incomes)
  const averageMonthlyExpense = getMonthlyAverageFromDatedItems(expenses)

  const projectedIncome = averageMonthlyIncome * months
  const projectedExpense = averageMonthlyExpense * months
  const projectedBalance = projectedIncome - projectedExpense
  const projectedSavings = projectedBalance > 0 ? projectedBalance : 0

  const message =
    projectedBalance >= 0
      ? `このペースなら ${months}ヶ月後も黒字見込みです。`
      : `このペースだと ${months}ヶ月後は赤字見込みです。支出調整が必要です。`

  return {
    period,
    projectedIncome,
    projectedExpense,
    projectedBalance,
    projectedSavings,
    message,
  }
}

export function calculateSimpleMonthlyAverage(
  incomes: IncomeItem[],
  expenses: ExpenseItem[]
) {
  return {
    monthlyIncome: getMonthlyAverageFromDatedItems(incomes),
    monthlyExpense: getMonthlyAverageFromDatedItems(expenses),
    currentIncomeTotal: sumIncomeItems(incomes),
    currentExpenseTotal: sumExpenseItems(expenses),
  }
}