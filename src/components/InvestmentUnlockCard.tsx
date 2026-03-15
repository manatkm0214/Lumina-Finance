"use client"

import { useMemo } from "react"
import { useFinance } from "@/hooks/useFinance"
import { calculateInvestmentUnlock } from "@/lib/calc/investmentUnlock"
import { formatCurrency, formatPercent } from "@/lib/calc/basic"

export function InvestmentUnlockCard() {
  const { state } = useFinance()

  const status = useMemo(() => {
    return calculateInvestmentUnlock(
      state.incomes,
      state.expenses,
      state.settings.investmentUnlockCondition
    )
  }, [state.expenses, state.incomes, state.settings.investmentUnlockCondition])

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-900">投資解放条件</h3>
        <p className="text-sm text-slate-500">投資を始めてよい状態か確認します</p>
      </div>

      <div
        className={[
          "rounded-xl border p-4",
          status.unlocked
            ? "border-emerald-300 bg-emerald-50 text-emerald-700"
            : "border-amber-300 bg-amber-50 text-amber-700",
        ].join(" ")}
      >
        {status.unlocked
          ? "投資解放条件を満たしています。"
          : "まだ投資解放条件を満たしていません。"}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">赤字率</p>
          <p className="mt-2 text-lg font-bold text-slate-900">
            {formatPercent(status.currentDeficitRate)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">固定費率</p>
          <p className="mt-2 text-lg font-bold text-slate-900">
            {formatPercent(status.currentFixedCostRate)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">貯蓄率</p>
          <p className="mt-2 text-lg font-bold text-slate-900">
            {formatPercent(status.currentSavingsRate)}
          </p>
        </div>
      </div>

      {!status.unlocked ? (
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">不足緊急資金</p>
            <p className="mt-2 text-lg font-bold text-rose-600">
              {formatCurrency(status.shortageEmergencyFund)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">未達成項目</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {status.reasons.map((reason: string, idx: number) => (
                <li key={idx}>・{reason}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </section>
  )
}