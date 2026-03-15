"use client"

import { useMemo } from "react"
import type { FinanceState } from "@/types/finance"
import {
  sumIncomeItems,
  sumExpenseItems,
  calculateBalance,
  savingsRate,
  deficitRate,
  fixedCostRate,
  getDeficitAlertLevel,
  getDeficitAlertMessage,
  formatCurrency,
  formatPercent,
} from "@/lib/calc/basic"

function levelStyles(level: "safe" | "caution" | "warning" | "danger") {
  switch (level) {
    case "danger":
      return "border-rose-300 bg-rose-50 text-rose-700"
    case "warning":
      return "border-amber-300 bg-amber-50 text-amber-700"
    case "caution":
      return "border-yellow-300 bg-yellow-50 text-yellow-700"
    default:
      return "border-emerald-300 bg-emerald-50 text-emerald-700"
  }
}

type FinanceDashboardProps = {
  state: FinanceState
}

export function FinanceDashboard({ state }: FinanceDashboardProps) {
  const summary = useMemo(() => {
    const totalIncome = sumIncomeItems(state.incomes)
    const totalExpense = sumExpenseItems(state.expenses)
    const balance = calculateBalance(state.incomes, state.expenses)
    const currentSavingsRate = savingsRate(state.incomes, state.expenses)
    const currentDeficitRate = deficitRate(state.incomes, state.expenses)
    const currentFixedCostRate = fixedCostRate(state.expenses)
    const deficitLevel = getDeficitAlertLevel(currentDeficitRate)

    return {
      totalIncome,
      totalExpense,
      balance,
      currentSavingsRate,
      currentDeficitRate,
      currentFixedCostRate,
      deficitLevel,
      deficitMessage: getDeficitAlertMessage(currentDeficitRate),
    }
  }, [state])

  return (
    <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900">家計ダッシュボード</h2>
        <p className="text-sm text-slate-500">
          今の家計状態をひと目で確認できます
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">総収入</p>
          <p className="mt-2 text-2xl font-bold text-sky-700">
            {formatCurrency(summary.totalIncome)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">総支出</p>
          <p className="mt-2 text-2xl font-bold text-rose-600">
            {formatCurrency(summary.totalExpense)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">収支</p>
          <p
            className={[
              "mt-2 text-2xl font-bold",
              summary.balance >= 0 ? "text-emerald-700" : "text-rose-600",
            ].join(" ")}
          >
            {formatCurrency(summary.balance)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">貯蓄率</p>
          <p className="mt-2 text-2xl font-bold text-violet-700">
            {formatPercent(summary.currentSavingsRate)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="text-base font-semibold text-slate-900">家計指標</h3>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">赤字率</span>
              <span className="font-semibold text-slate-900">
                {formatPercent(summary.currentDeficitRate)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">固定費率</span>
              <span className="font-semibold text-slate-900">
                {formatPercent(summary.currentFixedCostRate)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">登録収入件数</span>
              <span className="font-semibold text-slate-900">
                {state.incomes.length}件
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">登録支出件数</span>
              <span className="font-semibold text-slate-900">
                {state.expenses.length}件
              </span>
            </div>
          </div>
        </div>

        <div
          className={[
            "rounded-2xl border p-4",
            levelStyles(summary.deficitLevel),
          ].join(" ")}
        >
          <h3 className="text-base font-semibold">赤字警告システム</h3>
          <p className="mt-3 text-sm leading-6">{summary.deficitMessage}</p>

          <div className="mt-4 text-sm">
            <p>基準</p>
            <ul className="mt-2 space-y-1">
              <li>注意: 5%以上</li>
              <li>警告: 10%以上</li>
              <li>危険: 20%以上</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}