"use client"

import { useMemo } from "react"
import {
  calculateBalance,
  deficitRate,
  filterItemsByYearMonth,
  fixedCostRate,
  formatCurrency,
  formatPercent,
  savingsRate,
  sumExpenseItems,
  sumIncomeItems,
} from "@/lib/calc/basic"
import { expenseCategoryOptions } from "@/constants/options"
import { useEffect, useState } from "react"

function getCategoryLabel(value: string) {
  return expenseCategoryOptions.find((option) => option.value === value)?.label ?? value
}

export function MonthlyReportCard() {
  const { state, isLoaded } = useFinance()

  const current = useMemo(() => {
    const now = new Date()
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    }
  }, [])

  const report = useMemo(() => {
    const monthlyIncomes = filterItemsByYearMonth(state.incomes, current.year, current.month) as typeof state.incomes
    const monthlyExpenses = filterItemsByYearMonth(state.expenses, current.year, current.month) as typeof state.expenses

    const totalIncome = sumIncomeItems(monthlyIncomes)
    const totalExpense = sumExpenseItems(monthlyExpenses)
    const balance = calculateBalance(monthlyIncomes, monthlyExpenses)
    const currentSavingsRate = savingsRate(monthlyIncomes, monthlyExpenses)
    const currentDeficitRate = deficitRate(monthlyIncomes, monthlyExpenses)
    const currentFixedCostRate = fixedCostRate(monthlyExpenses)

    const categoryMap = new Map<string, number>()

    for (const item of monthlyExpenses) {
      categoryMap.set(item.category, (categoryMap.get(item.category) ?? 0) + item.amount)
    }

    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        ratio: totalExpense > 0 ? amount / totalExpense : 0,
      }))
      .sort((a, b) => b.amount - a.amount)

    return {
      totalIncome,
      totalExpense,
      balance,
      currentSavingsRate,
      currentDeficitRate,
      currentFixedCostRate,
      categoryBreakdown,
      incomeCount: monthlyIncomes.length,
      expenseCount: monthlyExpenses.length,
    }
  }, [current.month, current.year, state.expenses, state.incomes])

  if (!isLoaded) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">月次レポートを読み込み中...</p>
      </section>
    )
  }

  return (
    <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900">
          月次レポート ({current.year}年{current.month}月)
        </h2>
        <p className="text-sm text-slate-500">
          今月の収支状況とカテゴリ別の支出をまとめています
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">今月の収入</p>
          <p className="mt-2 text-2xl font-bold text-sky-700">
            {formatCurrency(report.totalIncome)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">今月の支出</p>
          <p className="mt-2 text-2xl font-bold text-rose-600">
            {formatCurrency(report.totalExpense)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">今月の収支</p>
          <p
            className={[
              "mt-2 text-2xl font-bold",
              report.balance >= 0 ? "text-emerald-700" : "text-rose-600",
            ].join(" ")}
          >
            {formatCurrency(report.balance)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">今月の貯蓄率</p>
          <p className="mt-2 text-2xl font-bold text-violet-700">
            {formatPercent(report.currentSavingsRate)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">赤字率</p>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {formatPercent(report.currentDeficitRate)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">固定費率</p>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {formatPercent(report.currentFixedCostRate)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">件数</p>
          <p className="mt-2 text-sm font-medium text-slate-900">
            収入 {report.incomeCount}件 / 支出 {report.expenseCount}件
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 p-4">
        <h3 className="text-base font-semibold text-slate-900">カテゴリ別支出</h3>

        {report.categoryBreakdown.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">今月の支出データはまだありません。</p>
        ) : (
          <div className="mt-4 space-y-3">
            {report.categoryBreakdown.map((item) => (
              <div
                key={item.category}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    {getCategoryLabel(item.category)}
                  </p>
                  <p className="text-sm text-slate-500">
                    構成比 {formatPercent(item.ratio)}
                  </p>
                </div>

                <p className="font-semibold text-slate-900">
                  {formatCurrency(item.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
import type { IncomeItem, ExpenseItem } from "@/types/finance"
import { } from "@/constants/options"

type FinanceState = {
  incomes: IncomeItem[]
  expenses: ExpenseItem[]
}

function useFinance(): { state: { incomes: IncomeItem[]; expenses: ExpenseItem[] }; isLoaded: boolean } {
  const [state, setState] = useState<{ incomes: IncomeItem[]; expenses: ExpenseItem[] }>({ incomes: [], expenses: [] })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      const incomes: IncomeItem[] = [
        {
          id: "1",
          amount: 300000,
          date: "2024-06-01",
          category: "salary",
          source: "",
          memo: "",
          createdAt: "2024-06-01T00:00:00.000Z",
          updatedAt: "2024-06-01T00:00:00.000Z",
        },
        {
          id: "2",
          amount: 5000,
          date: "2024-06-10",
          category: "sideJob",
          source: "",
          memo: "",
          createdAt: "2024-06-10T00:00:00.000Z",
          updatedAt: "2024-06-10T00:00:00.000Z",
        },
      ]

      const expenses: ExpenseItem[] = [
        {
          id: "1",
          amount: 80000,
          date: "2024-06-02",
          category: expenseCategoryOptions[0].value as ExpenseItem["category"],
          memo: "",
          paymentMethod: "cash",
          account: "mainBank",
          type: "fixed",
          costType: "monthly",
          necessity: "need",
          createdAt: "2024-06-02T00:00:00.000Z",
          updatedAt: "2024-06-02T00:00:00.000Z",
        },
        {
          id: "2",
          amount: 20000,
          date: "2024-06-05",
          category: expenseCategoryOptions[1].value as ExpenseItem["category"],
          memo: "",
          paymentMethod: "cash",
          account: "mainBank",
          type: "variable",
          costType: "temporary",
          necessity: "want",
          createdAt: "2024-06-05T00:00:00.000Z",
          updatedAt: "2024-06-05T00:00:00.000Z",
        },
        {
          id: "3",
          amount: 10000,
          date: "2024-06-15",
          category: expenseCategoryOptions[2].value as ExpenseItem["category"],
          memo: "",
          paymentMethod: "cash",
          account: "mainBank",
          type: "variable",
          costType: "temporary",
          necessity: "impulse",
          createdAt: "2024-06-15T00:00:00.000Z",
          updatedAt: "2024-06-15T00:00:00.000Z",
        },
      ]
      setState({ incomes, expenses })
      setIsLoaded(true)
    }
    fetchData()
  }, [])

  return { state, isLoaded }
}

// Remove duplicate and unused function implementation
