"use client"

import {
  deficitRate,
  formatPercent,
  getDeficitAlertLevel,
  getDeficitAlertMessage,
} from "@/lib/calc/basic"
import type {
  IncomeItem,
  ExpenseItem,
  DeficitLevel,
  ExpenseCategory,
} from "@/types/finance"

const state: { incomes: IncomeItem[]; expenses: ExpenseItem[] } = {
  incomes: [
    {
      id: "1",
      amount: 1000,
      category: "salary",
      source: "salary",
      date: "2024-06-01",
      memo: "",
      createdAt: "2024-06-01T00:00:00.000Z",
      updatedAt: "2024-06-01T00:00:00.000Z",
    },
    {
      id: "2",
      amount: 2000,
      category: "sideJob",
      source: "sideJob",
      date: "2024-06-01",
      memo: "",
      createdAt: "2024-06-01T00:00:00.000Z",
      updatedAt: "2024-06-01T00:00:00.000Z",
    },
  ],
  expenses: [
    {
      id: "1",
      amount: 1200,
      category: "housing" as ExpenseCategory,
      date: "2024-06-01",
      memo: "",
      type: "fixed",
      necessity: "need",
      costType: "monthly",
      paymentMethod: "bankTransfer",
      account: "mainBank",
      createdAt: "2024-06-01T00:00:00.000Z",
      updatedAt: "2024-06-01T00:00:00.000Z",
    },
    {
      id: "2",
      amount: 800,
      category: "food" as ExpenseCategory,
      date: "2024-06-01",
      memo: "",
      type: "variable",
      necessity: "need",
      costType: "monthly",
      paymentMethod: "cash",
      account: "cash",
      createdAt: "2024-06-01T00:00:00.000Z",
      updatedAt: "2024-06-01T00:00:00.000Z",
    },
  ],
}

export function DeficitAlertCard() {
  const currentDeficitRate: number = deficitRate(state.incomes, state.expenses)
  const level: DeficitLevel = getDeficitAlertLevel(currentDeficitRate)
  const message: string = getDeficitAlertMessage(currentDeficitRate)

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