import type {
  ExpenseItem,
  IncomeItem,
} from "@/types/finance"
// Define missing types locally if needed
type CategoryBreakdownItem = {
  category: string
  amount: number
  ratio: number
}
type FinanceSummary = {
  totalIncome: number
  totalExpense: number
  balance: number
  deficitRate: number
  savingsRate: number
  fixedCostRate: number
}
type MonthlyReport = {
  year: number
  month: number
  summary: FinanceSummary
  categoryBreakdown: CategoryBreakdownItem[]
  topExpenseCategories: CategoryBreakdownItem[]
  budgetStatuses: any[]
  latestEmotion?: any
  forecast?: any
}
import {
  calculateBalance,
  deficitRate,
  filterItemsByYearMonth,
  fixedCostRate,
  savingsRate,
  sumExpenseItems,
  sumIncomeItems,
} from "@/lib/calc/basic"

function buildCategoryBreakdown(expenses: ExpenseItem[]): CategoryBreakdownItem[] {
  const totalExpense = sumExpenseItems(expenses)
  const categoryMap = new Map<string, number>()

  for (const item of expenses) {
    categoryMap.set(item.category, (categoryMap.get(item.category) ?? 0) + item.amount)
  }

  return Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category: category as CategoryBreakdownItem["category"],
      amount,
      ratio: totalExpense > 0 ? amount / totalExpense : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
}

function buildSummary(incomes: IncomeItem[], expenses: ExpenseItem[]): FinanceSummary {
  return {
    totalIncome: sumIncomeItems(incomes),
    totalExpense: sumExpenseItems(expenses),
    balance: calculateBalance(incomes, expenses),
    deficitRate: deficitRate(incomes, expenses),
    savingsRate: savingsRate(incomes, expenses),
    fixedCostRate: fixedCostRate(expenses),
  }
}

export function buildMonthlyReport(
  incomes: IncomeItem[],
  expenses: ExpenseItem[],
  year: number,
  month: number
): MonthlyReport {
  const monthlyIncomes = filterItemsByYearMonth(incomes, year, month)
  const monthlyExpenses = filterItemsByYearMonth(expenses, year, month)

  const summary = buildSummary(monthlyIncomes, monthlyExpenses)
  const categoryBreakdown = buildCategoryBreakdown(monthlyExpenses)

  return {
    year,
    month,
    summary,
    categoryBreakdown,
    topExpenseCategories: categoryBreakdown.slice(0, 3),
    budgetStatuses: [],
    latestEmotion: undefined,
    forecast: undefined,
  }
}

export function buildCurrentMonthReport(
  incomes: IncomeItem[],
  expenses: ExpenseItem[]
): MonthlyReport {
  const now = new Date()

  return buildMonthlyReport(
    incomes,
    expenses,
    now.getFullYear(),
    now.getMonth() + 1
  )
}