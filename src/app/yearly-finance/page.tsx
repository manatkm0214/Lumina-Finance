"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import type { FinanceState } from "@/types/finance"

const STORAGE_KEY = "rebalance-finance-state-v4"

const initialState: FinanceState = {
  incomes: [],
  expenses: [],
  savingsRecords: [],
  uxMode: "standard",
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value)
}

function loadState(): FinanceState {
  if (typeof window === "undefined") return initialState

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    return JSON.parse(raw)
  } catch {
    return initialState
  }
}

export default function YearlyFinancePage() {

  const [state, setState] = useState<FinanceState>(initialState)

  useEffect(() => {
    setState(loadState())
  }, [])

  const totalIncome = state.incomes.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  )

  const totalExpense = state.expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  )

  const balance = totalIncome - totalExpense

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">

      <div className="mx-auto max-w-6xl space-y-6">

        {/* 切替ボタン */}
        <section className="flex gap-3">

          <Link
            href="/"
            className="rounded-lg bg-indigo-600 px-4 py-2 font-bold text-white"
          >
            1か月管理表
          </Link>

          <Link
            href="/yearly-finance"
            className="rounded-lg bg-violet-600 px-4 py-2 font-bold text-white"
          >
            1年管理表
          </Link>

        </section>

        {/* タイトル */}
        <section className="rounded-xl bg-white p-6 shadow">
          <h1 className="text-2xl font-bold">1年管理表</h1>
          <p className="text-slate-500 mt-2">
            年間の収入・支出をまとめて表示
          </p>
        </section>

        {/* 年間合計 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">年間収入</p>
            <p className="text-xl font-bold text-blue-700">
              {formatCurrency(totalIncome)}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">年間支出</p>
            <p className="text-xl font-bold text-rose-700">
              {formatCurrency(totalExpense)}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">年間収支</p>
            <p className="text-xl font-bold">
              {formatCurrency(balance)}
            </p>
          </div>

        </section>

      </div>

    </main>
  )
}