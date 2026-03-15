"use client"

import { useMemo, useState } from "react"
import { useFinanceContext } from "@/hooks/useFinanceContext"
import {
  formatCurrency,
  formatPercent,
} from "@/lib/calc/basic"
import {
  evaluateSavingCommand,
  getSavingCommandStyle,
} from "@/lib/calc/savingCommand"

function buildMonthKey(date: string) {
  const d = new Date(date)
  return `${d.getFullYear()}-${d.getMonth() + 1}`
}

function getCurrentMonthActualSaving(
  incomes: { date: string; amount: number }[],
  expenses: { date: string; amount: number }[]
) {
  const now = new Date()
  const currentKey = `${now.getFullYear()}-${now.getMonth() + 1}`

  const monthlyIncome = incomes
    .filter((item) => buildMonthKey(item.date) === currentKey)
    .reduce((sum, item) => sum + item.amount, 0)

  const monthlyExpense = expenses
    .filter((item) => buildMonthKey(item.date) === currentKey)
    .reduce((sum, item) => sum + item.amount, 0)

  return monthlyIncome - monthlyExpense
}

export function SavingCommandCard() {
  const { state } = useFinanceContext()
  const [targetSavingAmount, setTargetSavingAmount] = useState("50000")

  const actualSavingAmount = useMemo(() => {
    return getCurrentMonthActualSaving(state.incomes, state.expenses)
  }, [state.incomes, state.expenses])

  const result = useMemo(() => {
    return evaluateSavingCommand(
      Number(targetSavingAmount || 0),
      actualSavingAmount
    )
  }, [actualSavingAmount, targetSavingAmount])

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-900">先取り貯金指令</h3>
        <p className="text-sm text-slate-500">
          毎月の先取り貯金目標に対して、今月の達成状況を判定します
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="target-saving-amount"
            className="text-sm font-medium text-slate-700"
          >
            毎月の目標貯金額
          </label>
          <input
            id="target-saving-amount"
            type="number"
            min="0"
            value={targetSavingAmount}
            onChange={(e) => setTargetSavingAmount(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">今月の実際の貯金額</p>
          <p
            className={[
              "mt-2 text-xl font-bold",
              actualSavingAmount >= 0 ? "text-emerald-700" : "text-rose-600",
            ].join(" ")}
          >
            {formatCurrency(actualSavingAmount)}
          </p>
        </div>
      </div>

      <div
        className={[
          "rounded-xl border p-4",
          getSavingCommandStyle(result.level),
        ].join(" ")}
      >
        <p className="text-base font-semibold">{result.title}</p>
        <p className="mt-2 text-sm leading-6">{result.message}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">目標金額</p>
          <p className="mt-2 text-lg font-bold text-slate-900">
            {formatCurrency(result.targetSavingAmount)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">不足額</p>
          <p className="mt-2 text-lg font-bold text-rose-600">
            {formatCurrency(result.shortageAmount)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">達成率</p>
          <p className="mt-2 text-lg font-bold text-slate-900">
            {formatPercent(result.achievementRate)}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">今月の指令</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {result.suggestions.map((suggestion) => (
            <li key={suggestion}>・{suggestion}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}