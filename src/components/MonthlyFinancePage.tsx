"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

type IncomeItem = {
  id: string
  date: string
  source: string
  amount: number
  memo: string
}

type ExpenseItem = {
  id: string
  date: string
  category: string
  amount: number
  memo: string
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value)
}

export default function MonthlyFinancePage() {
  const [incomes] = useState<IncomeItem[]>([
    {
      id: "i1",
      date: "2026-03-01",
      source: "給与",
      amount: 250000,
      memo: "3月給与",
    },
    {
      id: "i2",
      date: "2026-03-10",
      source: "副業",
      amount: 20000,
      memo: "案件",
    },
  ])

  const [expenses] = useState<ExpenseItem[]>([
    {
      id: "e1",
      date: "2026-03-03",
      category: "食費",
      amount: 18000,
      memo: "スーパー",
    },
    {
      id: "e2",
      date: "2026-03-08",
      category: "通信費",
      amount: 8000,
      memo: "スマホ",
    },
  ])

  const totalIncome = useMemo(
    () => incomes.reduce((sum, item) => sum + item.amount, 0),
    [incomes]
  )

  const totalExpense = useMemo(
    () => expenses.reduce((sum, item) => sum + item.amount, 0),
    [expenses]
  )

  const balance = totalIncome - totalExpense

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">

        <section className="rounded-2xl bg-white p-6 shadow">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">1か月家計管理</h1>
              <p className="text-slate-500 text-sm">
                日々の家計管理・節約判断におすすめ
              </p>
            </div>

            <Link
              href="/yearly-finance"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold"
            >
              年管理を見る
            </Link>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-4">

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-slate-500">収入</p>
            <p className="text-xl font-bold text-blue-700">
              {formatCurrency(totalIncome)}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-slate-500">支出</p>
            <p className="text-xl font-bold text-red-700">
              {formatCurrency(totalExpense)}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-slate-500">収支</p>
            <p className="text-xl font-bold text-green-700">
              {formatCurrency(balance)}
            </p>
          </div>

        </section>

        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold mb-4">収入一覧</h2>

          {incomes.map((item) => (
            <div key={item.id} className="flex justify-between border-b py-3">
              <div>
                <p className="font-bold">{item.source}</p>
                <p className="text-sm text-slate-500">{item.date}</p>
              </div>

              <p className="font-bold text-blue-700">
                {formatCurrency(item.amount)}
              </p>
            </div>
          ))}
        </section>

        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold mb-4">支出一覧</h2>

          {expenses.map((item) => (
            <div key={item.id} className="flex justify-between border-b py-3">
              <div>
                <p className="font-bold">{item.category}</p>
                <p className="text-sm text-slate-500">{item.date}</p>
              </div>

              <p className="font-bold text-red-700">
                {formatCurrency(item.amount)}
              </p>
            </div>
          ))}
        </section>

      </div>
    </main>
  )
}