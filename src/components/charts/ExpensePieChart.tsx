"use client"

import { expenseCategoryOptions } from "@/constants/options"
import type { ExpenseItem } from "@/types/finance"
import { Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"

type Props = {
  items: ExpenseItem[]
}

const COLORS = [
  "#0f172a",
  "#334155",
  "#475569",
  "#64748b",
  "#94a3b8",
  "#cbd5e1",
  "#16a34a",
  "#2563eb",
  "#7c3aed",
  "#ea580c",
  "#dc2626",
  "#0891b2",
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value)
}

export function ExpensePieChart({ items }: Props) {
  const data = expenseCategoryOptions
    .map((category, index) => {
      const total = items
        .filter((item) => item.category === category.value)
        .reduce((sum, item) => sum + item.amount, 0)

      return {
        name: category.label,
        value: total,
        fill: COLORS[index % COLORS.length],
      }
    })
    .filter((item) => item.value > 0)

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-slate-900">支出カテゴリ円グラフ</h2>

      {data.length === 0 ? (
        <p className="text-slate-500">支出データがありません。</p>
      ) : (
        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" outerRadius={110} label />
              <Tooltip
                formatter={(value) => {
                  const n = Array.isArray(value) ? Number(value[0]) : Number(value)
                  return formatCurrency(Number.isFinite(n) ? n : 0)
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}