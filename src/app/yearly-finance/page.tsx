"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import type { AppSettings, FinanceState } from "@/types/finance"
import { formatCurrency } from "@/lib/calc/basic" // ← 追加

const STORAGE_KEY = "rebalance-finance-state-v4"

const initialSettings: AppSettings = {
  budgetPeriod: "monthly",        // ← 追加
  household: {                    // ← 追加
    familySize: "1",
    housing: {
      type: "rent",
      monthlyRent: 0,
      monthlyMortgage: 0,
      monthlyManagementFee: 0,
      monthlyRepairReserve: 0,
      monthlyParkingFee: 0,
    },
  },
  bucketRules: [],                // ← 追加
  investmentUnlockCondition: {
    maxDeficitRate: 0.05,
    maxFixedCostRate: 0.5,
    minSavingsRate: 0.2,
    targetEmergencyFundMonths: 6,
  },
  monthlyLivingCost: 0,
  currentEmergencyFund: 0,
  savingsGoalAmount: 0,
  savingsGoalPeriod: "1m",
}

const initialState: FinanceState = {
  settings: initialSettings,
  incomes: [],
  expenses: [],
  emotions: [],       // ← 追加
  budgets: [],        // ← 追加
  savingsRecords: [],
  deficit: 0,         // ← 追加
  savingGoal: 0,      // ← 追加
  uxMode: "standard",
  forecastPeriod: "6m", // ← 追加
}

function loadState(): FinanceState {
  if (typeof window === "undefined") return initialState

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState

    const parsed = JSON.parse(raw) as Partial<FinanceState>
    return {
      ...initialState,
      ...parsed,
      settings: {
        ...initialSettings,
        ...(parsed.settings ?? {}),
        investmentUnlockCondition: {
          ...initialSettings.investmentUnlockCondition,
          ...(parsed.settings?.investmentUnlockCondition ?? {}),
        },
      },
      incomes: parsed.incomes ?? [],
      expenses: parsed.expenses ?? [],
      savingsRecords: parsed.savingsRecords ?? [],
      deficit: parsed.deficit ?? 0,
      savingGoal: parsed.savingGoal ?? 0,
    }
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