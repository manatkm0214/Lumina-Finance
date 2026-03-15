"use client"

import {
  deficitRate,
  formatPercent,
  getDeficitAlertLevel,
  getDeficitAlertMessage,
} from "@/lib/calc/basic"

function getStyle(level: "safe" | "caution" | "warning" | "danger") {
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

export function DeficitAlertCard() {
  const state = {
    incomes: [
      { id: "1", amount: 1000, source: "給与", date: "2024-06-01", memo: "" },
      { id: "2", amount: 2000, source: "副業", date: "2024-06-01", memo: "" },
    ],
    expenses: [
      { id: "1", amount: 1200, category: "家賃", date: "2024-06-01", memo: "" },
      { id: "2", amount: 800, category: "食費", date: "2024-06-01", memo: "" },
    ],
  }

  const currentDeficitRate = deficitRate(state.incomes, state.expenses)
  const level = getDeficitAlertLevel(currentDeficitRate)
  const message = getDeficitAlertMessage(currentDeficitRate)

  return (
    <section className={["rounded-2xl border p-6 shadow-sm", getStyle(level)].join(" ")}>
      <div className="space-y-1">
        <h3 className="text-lg font-bold">赤字警告UI</h3>
        <p className="text-sm">現在の赤字率: {formatPercent(currentDeficitRate)}</p>
      </div>

      <p className="mt-4 text-sm leading-6">{message}</p>

      <div className="mt-4 text-sm">
        <p>基準</p>
        <ul className="mt-2 space-y-1">
          <li>注意: 5%以上</li>
          <li>警告: 10%以上</li>
          <li>危険: 20%以上</li>
        </ul>
      </div>
    </section>
  )
}