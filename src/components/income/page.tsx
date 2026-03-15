"use client"
import { SavingsRecordForm } from "@/components/savings/SavingsRecordForm"
import { SavingsRecordList } from "@/components/savings/SavingsRecordList"
import type { SavingsRecordItem } from "@/types/finance"
import { useMemo, useState } from "react"
import { FinanceProvider, useFinanceProvider } from "@/hooks/useFinanceProvider"

import { FinanceDashboard } from "@/components/dashboard/FinanceDashboard"
import { DeficitAlertCard } from "@/components/dashboard/DeficitAlertCard"

import { IncomeForm } from "@/components/income/IncomeForm"
import { IncomeList } from "@/components/income/IncomeList"

import { ExpenseForm } from "@/components/expense/ExpenseForm"
import { ExpenseList } from "@/components/expense/ExpenseList"

import { ExpensePieChart } from "@/components/charts/ExpensePieChart"
import { MonthlyTrendChart } from "@/components/charts/MonthlyTrendChart"

import { expenseCategoryOptions } from "@/constants/options"

import type {
  ExpenseCategory,
  ForecastPeriod,
  IncomeItem,
  ExpenseItem,
  FinanceState,
} from "@/types/finance"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value)
}

const FORECAST_MONTH_MAP = {
  "3m": 3,
  "6m": 6,
  "1y": 12,
  "5y": 60,
} as const

function MainPageContent() {
  const { state, setUxMode } =
    useFinanceProvider()

  const [editingIncome, setEditingIncome] = useState<IncomeItem | null>(null)
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null)

  const [incomeSearch, setIncomeSearch] = useState("")
  const [expenseSearch, setExpenseSearch] = useState("")

  const [expenseCategoryFilter, setExpenseCategoryFilter] =
    useState<ExpenseCategory | "all">("all")

  const [forecastPeriod, setForecastPeriod] =
    useState<ForecastPeriod>("3m")

  const totalIncome = state.incomes.reduce(
    (sum: number, item: IncomeItem) => sum + item.amount,
    0
  )

  const totalExpense = state.expenses.reduce(
    (sum: number, item: ExpenseItem) => sum + item.amount,
    0
  )

  const months = FORECAST_MONTH_MAP[forecastPeriod]

  const forecastIncome = totalIncome * months
  const forecastExpense = totalExpense * months
  const forecastBalance = forecastIncome - forecastExpense
  const forecastSaving = Math.max(forecastBalance, 0)

  const filteredIncomes = useMemo(() => {
    const keyword = incomeSearch.toLowerCase()

    return state.incomes.filter((item: IncomeItem) =>
      item.memo.toLowerCase().includes(keyword)
    )
  }, [state.incomes, incomeSearch])

  const filteredExpenses = useMemo(() => {
    const keyword = expenseSearch.toLowerCase()

    return state.expenses.filter((item: ExpenseItem) => {
      const categoryOk =
        expenseCategoryFilter === "all" ||
        item.category === expenseCategoryFilter

      const keywordOk =
        !keyword ||
        item.memo.toLowerCase().includes(keyword)

      return categoryOk && keywordOk
    })
  }, [state.expenses, expenseSearch, expenseCategoryFilter])

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        <section className="rounded-3xl bg-white p-6 shadow">
          <h1 className="text-3xl font-bold">ReBalance</h1>
          <p className="text-slate-600">
            家計の可視化・支出管理・未来予測・貯金判断をまとめて確認できる家計アプリ
          </p>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setUxMode("standard")}
              className="px-4 py-2 rounded bg-slate-900 text-white"
            >
              通常
            </button>

            <button
              onClick={() => setUxMode("cheer")}
              className="px-4 py-2 rounded bg-pink-500 text-white"
            >
              応援
            </button>

            <button
              onClick={() => setUxMode("spartan")}
              className="px-4 py-2 rounded bg-red-600 text-white"
            >
              スパルタ
            </button>
          </div>
        </section>

        <FinanceDashboard state={state} />

        <DeficitAlertCard state={state} />

        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">
            未来予測
          </h2>

          <select
            value={forecastPeriod}
            onChange={(e) =>
              setForecastPeriod(e.target.value as ForecastPeriod)
            }
            className="border rounded px-3 py-2"
          >
            <option value="3m">3ヶ月</option>
            <option value="6m">6ヶ月</option>
            <option value="1y">1年</option>
            <option value="5y">5年</option>
          </select>

          <div className="grid grid-cols-2 gap-4 mt-4">

            <div>
              <p>予測収入</p>
              <p className="font-bold">
                {formatCurrency(forecastIncome)}
              </p>
            </div>

            <div>
              <p>予測支出</p>
              <p className="font-bold">
                {formatCurrency(forecastExpense)}
              </p>
            </div>

            <div>
              <p>予測収支</p>
              <p className="font-bold">
                {formatCurrency(forecastBalance)}
              </p>
            </div>

            <div>
              <p>見込み貯蓄</p>
              <p className="font-bold">
                {formatCurrency(forecastSaving)}
              </p>
            </div>

          </div>
        </section>

        <IncomeForm
          editingItem={editingIncome}
          onEditFinish={() => setEditingIncome(null)} onAddItem={function (item: IncomeItem): void {
            throw new Error("Function not implemented.")
          } } onUpdateItem={function (item: IncomeItem): void {
            throw new Error("Function not implemented.")
          } }        />

        <ExpenseForm editingItem={editingExpense} onAddItem={function (item: ExpenseItem): void {
          throw new Error("Function not implemented.")
        } } onUpdateItem={function (item: ExpenseItem): void {
          throw new Error("Function not implemented.")
        } } onEditFinishAction={function (): void {
          throw new Error("Function not implemented.")
        } } />

        <section className="bg-white p-4 rounded shadow">

          <input
            value={incomeSearch}
            onChange={(e) =>
              setIncomeSearch(e.target.value)
            }
            placeholder="収入検索"
            className="border p-2 rounded w-full"
          />

          <IncomeList
              items={filteredIncomes}
            />

        </section>

        <section className="bg-white p-4 rounded shadow">

          <input
            value={expenseSearch}
            onChange={(e) =>
              setExpenseSearch(e.target.value)
            }
            placeholder="支出検索"
            className="border p-2 rounded w-full mb-3"
          />

          <select
            value={expenseCategoryFilter}
            onChange={(e) =>
              setExpenseCategoryFilter(
                e.target.value as ExpenseCategory | "all"
              )
            }
            className="border p-2 rounded mb-3"
          >
            <option value="all">全カテゴリ</option>

            {expenseCategoryOptions.map((c) => (
              <option
                key={c.value}
                value={c.value}
              >
                {c.label}
              </option>
            ))}
          </select>

          <ExpenseList
            items={filteredExpenses}
          />

        </section>

        <ExpensePieChart items={filteredExpenses} />

        <MonthlyTrendChart />

      </div>
    </main>
  )
}

export default function Page() {
  return (
    <FinanceProvider>
      <MainPageContent />
    </FinanceProvider>
  )
}
