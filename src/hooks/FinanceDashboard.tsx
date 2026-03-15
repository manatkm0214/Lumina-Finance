"use client"

import { useFinanceContext } from "@/hooks/useFinanceContext"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value)
}

function getMonthKey(dateStr: string) {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

export function FinanceDashboard() {
  const { state } = useFinanceContext()

  type IncomeItem = {
    amount: number
    date: string
  }

  type ExpenseItem = {
    amount: number
    date: string
    costType: string
  }

  const totalIncome = state.incomes.reduce(
    (sum: number, item: IncomeItem) => sum + item.amount,
    0
  )
  const totalExpense = state.expenses.reduce(
    (sum: number, item: ExpenseItem) => sum + item.amount,
    0
  )
  const balance = totalIncome - totalExpense
  const savingsRate = totalIncome <= 0 ? 0 : Math.max(0, Math.round((balance / totalIncome) * 100))
  const fixedExpense = state.expenses
    .filter((item: ExpenseItem) => item.costType === "fixed")
    .reduce((sum: number, item: ExpenseItem) => sum + item.amount, 0)

  const deficitRate =
    totalIncome <= 0 || balance >= 0 ? 0 : Math.round((Math.abs(balance) / totalIncome) * 100)

  const fixedCostRate =
    totalExpense <= 0 ? 0 : Math.round((fixedExpense / totalExpense) * 100)

  const now = new Date()
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`

  const monthlyIncome = state.incomes
    .filter((item: IncomeItem) => getMonthKey(item.date) === currentMonthKey)
    .reduce((sum: number, item: IncomeItem) => sum + item.amount, 0)

  const monthlyExpense = state.expenses
    .filter((item: ExpenseItem) => getMonthKey(item.date) === currentMonthKey)
    .reduce((sum: number, item: ExpenseItem) => sum + item.amount, 0)

  const monthlyBalance = monthlyIncome - monthlyExpense

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-2xl font-bold text-slate-900">家計ダッシュボード</h2>
      <p className="mb-6 text-slate-600">今の家計状態をひと目で確認できます</p>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">総収入</p>
          <p className="mt-2 text-2xl font-bold text-emerald-700">{formatCurrency(totalIncome)}</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">総支出</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(totalExpense)}</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">収支</p>
          <p className="mt-2 text-2xl font-bold">{formatCurrency(balance)}</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">貯蓄率</p>
          <p className="mt-2 text-2xl font-bold">{savingsRate}%</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">赤字率</p>
          <p className="mt-2 text-xl font-bold">{deficitRate}%</p>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">固定費率</p>
          <p className="mt-2 text-xl font-bold">{fixedCostRate}%</p>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">登録収入件数</p>
          <p className="mt-2 text-xl font-bold">{state.incomes.length}件</p>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">登録支出件数</p>
          <p className="mt-2 text-xl font-bold">{state.expenses.length}件</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 p-4">
        <p className="text-sm text-slate-500">今月の収支</p>
        <p className="mt-2 text-xl font-bold">{formatCurrency(monthlyBalance)}</p>
        <p className="mt-1 text-sm text-slate-600">
          収入 {formatCurrency(monthlyIncome)} / 支出 {formatCurrency(monthlyExpense)}
        </p>
      </div>
    </section>
  )
}