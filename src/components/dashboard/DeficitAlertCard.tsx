"use client"

import type { FinanceState } from "@/types/finance"
import {
  deficitRate,
  getDeficitAlertLevel,
  getDeficitAlertMessage,
} from "@/lib/calc/basic"

type DeficitAlertCardProps = {
  state: FinanceState
}

function getAlertClassName(level: "safe" | "caution" | "warning" | "danger") {
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

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`
}

export function DeficitAlertCard({ state }: DeficitAlertCardProps) {
  const currentDeficitRate = deficitRate(state.incomes, state.expenses)
  const level = getDeficitAlertLevel(currentDeficitRate)
  const message = getDeficitAlertMessage(currentDeficitRate)

  return (
    <section
      className={[
        "rounded-2xl border p-6 shadow-sm",
        getAlertClassName(level),
      ].join(" ")}
    >
      <div className="space-y-2">
        <h2 className="text-xl font-bold">赤字警告</h2>
        <p className="text-sm leading-6">{message}</p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl bg-white/70 p-4">
          <p className="text-sm opacity-80">現在の赤字率</p>
          <p className="mt-2 text-2xl font-bold">
            {formatPercent(currentDeficitRate)}
          </p>
        </div>

        <div className="rounded-xl bg-white/70 p-4">
          <p className="text-sm opacity-80">判定</p>
          <p className="mt-2 text-2xl font-bold">
            {level === "safe" && "安全"}
            {level === "caution" && "注意"}
            {level === "warning" && "警告"}
            {level === "danger" && "危険"}
          </p>
        </div>
      </div>

      <div className="mt-4 text-sm">
        <p className="font-semibold">基準</p>
        <ul className="mt-2 space-y-1">
          <li>注意: 5%以上</li>
          <li>警告: 10%以上</li>
          <li>危険: 20%以上</li>
        </ul>
      </div>
    </section>
  )
}