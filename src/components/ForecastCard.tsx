"use client"

import { useContext, useMemo, useState } from "react"
import { FinanceContext } from "@/contexts/FinanceContext"
import { calculateForecast } from "@/lib/calc/forecast"
import { formatCurrency } from "@/lib/calc/basic"
import type { ForecastPeriod } from "@/types/finance"
import { SelectField } from "@/components/common/SelectField"

const forecastPeriodOptions: { label: string; value: ForecastPeriod }[] = [
  { label: "1ヶ月", value: "1month" },
  { label: "3ヶ月", value: "3months" },
  { label: "6ヶ月", value: "6months" },
  { label: "1年", value: "1year" },
  { label: "3年", value: "3years" },
  { label: "5年", value: "5years" },
]

export function ForecastCard() {
  const finance = useContext(FinanceContext)
  if (!finance) throw new Error("FinanceContext.Provider でラップしてください")

  const { state } = finance
  const [period, setPeriod] = useState<ForecastPeriod>("3months")

  const result = useMemo(() => {
    return calculateForecast(state.incomes, state.expenses, period)
  }, [period, state.expenses, state.incomes])

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-900">未来予測</h3>
        <p className="text-sm text-slate-500">3ヶ月 / 1年などの見込みを確認します</p>
      </div>

      <SelectField
        label="予測期間"
        value={period}
        options={[
          { value: "3months", label: "3ヶ月" },
          { value: "6months", label: "6ヶ月" },
          { value: "1year", label: "1年" },
        ]}
        onChangeAction={setPeriod}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">予測収入</p>
          <p className="mt-2 text-xl font-bold text-sky-700">{formatCurrency(result.projectedIncome)}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">予測支出</p>
          <p className="mt-2 text-xl font-bold text-rose-600">{formatCurrency(result.projectedExpense)}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">予測収支</p>
          <p className="mt-2 text-xl font-bold text-slate-900">{formatCurrency(result.projectedBalance)}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">見込み貯蓄</p>
          <p className="mt-2 text-xl font-bold text-violet-700">{formatCurrency(result.projectedSavings)}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        {result.message}
      </div>
    </section>
  )
}