"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

import { FinanceDashboard } from "@/components/dashboard/FinanceDashboard"
import { DeficitAlertCard } from "@/components/dashboard/DeficitAlertCard"

import { IncomeForm } from "@/components/income/IncomeForm"
import { IncomeList } from "@/components/income/IncomeList"

import { ExpenseForm } from "@/components/expense/ExpenseForm"
import { ExpenseList } from "@/components/expense/ExpenseList"

import { SavingsRecordForm } from "@/components/saving/SavingsRecordForm"
import { SavingsRecordList } from "@/components/saving/SavingsRecordList"

import { expenseCategoryOptions } from "@/constants/options"

import type {
  ExpenseCategory,
  ExpenseItem,
  FinanceState,
  IncomeItem,
  SavingsRecordItem,
} from "@/types/finance"

type ForecastPeriod = "3m" | "6m" | "1y" | "3y" | "5y"
type SavingsGoalPeriod = "1m" | "12m"
type MoneyMode = "emergency" | "fullSave" | "normal"
type GuardRank = "S" | "A" | "B" | "C" | "D"
type DeficitLevel = "safe" | "caution" | "warning" | "danger"

type AppSettings = {
  monthlyLivingCost: number
  currentEmergencyFund: number
  savingsGoalAmount: number
  savingsGoalPeriod: SavingsGoalPeriod
}

const STORAGE_KEY = "rebalance-finance-state-v5"
const SETTINGS_KEY = "rebalance-finance-settings-v5"

const FORECAST_MONTH_MAP: Record<ForecastPeriod, number> = {
  "3m": 3,
  "6m": 6,
  "1y": 12,
  "3y": 36,
  "5y": 60,
}

const initialState: FinanceState = {
  incomes: [],
  expenses: [],
  savingsRecords: [],
  uxMode: "standard",
}

const initialSettings: AppSettings = {
  monthlyLivingCost: 0,
  currentEmergencyFund: 0,
  savingsGoalAmount: 0,
  savingsGoalPeriod: "1m",
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0)
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
      incomes: Array.isArray(parsed.incomes) ? parsed.incomes : [],
      expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
      savingsRecords: Array.isArray(parsed.savingsRecords)
        ? parsed.savingsRecords
        : [],
      uxMode: parsed.uxMode ?? "standard",
    }
  } catch {
    return initialState
  }
}

function loadSettings(): AppSettings {
  if (typeof window === "undefined") return initialSettings

  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return initialSettings

    const parsed = JSON.parse(raw) as Partial<AppSettings>

    return {
      ...initialSettings,
      ...parsed,
      monthlyLivingCost: Number(parsed.monthlyLivingCost ?? 0),
      currentEmergencyFund: Number(parsed.currentEmergencyFund ?? 0),
      savingsGoalAmount: Number(parsed.savingsGoalAmount ?? 0),
      savingsGoalPeriod: parsed.savingsGoalPeriod === "12m" ? "12m" : "1m",
    }
  } catch {
    return initialSettings
  }
}

function getMoneyMode(params: {
  emergencyMonths: number
  monthlyBalance: number
  savingsGoalAchievementRate: number
}): MoneyMode {
  const { emergencyMonths, monthlyBalance, savingsGoalAchievementRate } = params

  if (emergencyMonths < 6) return "emergency"
  if (monthlyBalance <= 0 || savingsGoalAchievementRate < 0.7) return "fullSave"
  return "normal"
}

function getEmergencyGuardRank(emergencyMonths: number): GuardRank {
  if (emergencyMonths >= 12) return "S"
  if (emergencyMonths >= 6) return "A"
  if (emergencyMonths >= 4) return "B"
  if (emergencyMonths >= 2) return "C"
  return "D"
}

function getSavingsGuardRank(rate: number): GuardRank {
  if (rate >= 1.5) return "S"
  if (rate >= 1.0) return "A"
  if (rate >= 0.8) return "B"
  if (rate >= 0.5) return "C"
  return "D"
}

function getRankLabel(rank: GuardRank) {
  switch (rank) {
    case "S":
      return "S: とても守れている"
    case "A":
      return "A: 守れている"
    case "B":
      return "B: ほぼ守れている"
    case "C":
      return "C: まだ弱い"
    case "D":
      return "D: 守れていない"
  }
}

function getModeLabel(mode: MoneyMode) {
  switch (mode) {
    case "emergency":
      return "緊急モード"
    case "fullSave":
      return "全力貯金モード"
    case "normal":
      return "正常 / 先取り貯金モード"
  }
}

function getModeDescription(mode: MoneyMode) {
  switch (mode) {
    case "emergency":
      return "生活防衛資金6か月を下回る見込みです。まずは防衛資金の回復を優先します。"
    case "fullSave":
      return "赤字または貯金目標の達成率が弱いです。固定費・変動費を見直して全力で貯金を寄せます。"
    case "normal":
      return "防衛資金と先取り貯金が安定しています。このまま継続できています。"
  }
}

function getDeficitLevel(balance: number, income: number): DeficitLevel {
  if (income <= 0) return "danger"
  if (balance >= 0) return "safe"

  const deficitRate = Math.abs(balance) / income
  if (deficitRate >= 0.2) return "danger"
  if (deficitRate >= 0.1) return "warning"
  return "caution"
}

function getDeficitMessage(balance: number, income: number) {
  const level = getDeficitLevel(balance, income)

  switch (level) {
    case "safe":
      return "黒字です。このまま先取り貯金を継続できます。"
    case "caution":
      return "軽い赤字です。変動費を少し絞ると戻しやすいです。"
    case "warning":
      return "赤字警告です。固定費と娯楽費の見直しを優先してください。"
    case "danger":
      return "危険水準です。今月は支出制限を強くかける必要があります。"
  }
}

function getDeficitBgClass(level: DeficitLevel) {
  switch (level) {
    case "safe":
      return "bg-emerald-50 border-emerald-200"
    case "caution":
      return "bg-yellow-50 border-yellow-200"
    case "warning":
      return "bg-orange-50 border-orange-200"
    case "danger":
      return "bg-red-50 border-red-200"
  }
}

function getCategoryLabel(value: string) {
  return expenseCategoryOptions.find((item) => item.value === value)?.label ?? value
}

function getAiAdvice(
  expenses: ExpenseItem[],
  incomeTotal: number,
  expenseTotal: number
) {
  const balance = incomeTotal - expenseTotal

  const totals = expenses.reduce<Record<string, number>>((acc, item) => {
    const key = String(item.category ?? "other")
    acc[key] = (acc[key] ?? 0) + Number(item.amount || 0)
    return acc
  }, {})

  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1])
  const topCategory = sorted[0]?.[0]

  if (incomeTotal <= 0) {
    return [
      "収入データが不足しています。まずは毎月の固定収入を登録してください。",
      "収支判定が安定すると、節約の優先順位も出しやすくなります。",
    ]
  }

  if (balance < 0) {
    if (topCategory === "entertainment") {
      return [
        "娯楽費が最大です。今月はここを最優先で圧縮すると赤字改善が早いです。",
        "サブスク・カフェ・推し活・外食の回数上限を決めるのが効果的です。",
      ]
    }

    if (topCategory === "food") {
      return [
        "食費が最大です。外食頻度を下げて自炊回数を増やすと改善しやすいです。",
        "買い物前にメモを作るだけでも無駄買いを抑えやすくなります。",
      ]
    }

    if (topCategory === "communication") {
      return [
        "通信費が目立ちます。格安プランや不要オプションの見直しがおすすめです。",
        "固定費の削減は毎月効くので、最優先で確認すると強いです。",
      ]
    }

    return [
      `${topCategory ? getCategoryLabel(topCategory) : "支出"} が大きめです。ここを優先的に見直してください。`,
      "赤字の月は、まず固定費、その次に変動費の順で削ると失敗しにくいです。",
    ]
  }

  const savingsRate = incomeTotal > 0 ? (Math.max(balance, 0) / incomeTotal) * 100 : 0

  if (savingsRate >= 20) {
    return [
      "とても良い状態です。先取り貯金を先に確保してから使う流れを維持してください。",
      "余剰分の一部を生活防衛資金や投資準備に回すと安定感が上がります。",
    ]
  }

  return [
    "黒字ですが、まだ改善余地があります。",
    "食費・日用品・娯楽費の上限を先に決めると貯金率を上げやすいです。",
  ]
}

function getExpenseRanking(expenses: ExpenseItem[]) {
  const totals = expenses.reduce<Record<string, number>>((acc, item) => {
    const key = String(item.category ?? "other")
    acc[key] = (acc[key] ?? 0) + Number(item.amount || 0)
    return acc
  }, {})

  return Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .map(([category, amount], index) => ({
      rank: index + 1,
      category,
      label: getCategoryLabel(category),
      amount,
    }))
}

export default function Home() {
  const [state, setState] = useState<FinanceState>(initialState)
  const [settings, setSettings] = useState<AppSettings>(initialSettings)
  const [isLoaded, setIsLoaded] = useState(false)

  const [editingIncome, setEditingIncome] = useState<IncomeItem | null>(null)
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null)

  const [incomeSearch, setIncomeSearch] = useState("")
  const [expenseSearch, setExpenseSearch] = useState("")
  const [expenseCategoryFilter, setExpenseCategoryFilter] =
    useState<ExpenseCategory | "all">("all")
  const [forecastPeriod, setForecastPeriod] = useState<ForecastPeriod>("3m")

  useEffect(() => {
    setState(loadState())
    setSettings(loadSettings())
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state, isLoaded])

  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  }, [settings, isLoaded])

  const addIncome = (item: IncomeItem) => {
    setState((prev) => ({
      ...prev,
      incomes: [item, ...prev.incomes],
    }))
  }

  const updateIncome = (updated: IncomeItem) => {
    setState((prev) => ({
      ...prev,
      incomes: prev.incomes.map((item) =>
        item.id === updated.id ? updated : item
      ),
    }))
    setEditingIncome(null)
  }

  const deleteIncome = (id: string) => {
    setState((prev) => ({
      ...prev,
      incomes: prev.incomes.filter((item) => item.id !== id),
    }))
    setEditingIncome((prev) => (prev?.id === id ? null : prev))
  }

  const addExpense = (item: ExpenseItem) => {
    setState((prev) => ({
      ...prev,
      expenses: [item, ...prev.expenses],
    }))
  }

  const updateExpense = (updated: ExpenseItem) => {
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.map((item) =>
        item.id === updated.id ? updated : item
      ),
    }))
    setEditingExpense(null)
  }

  const deleteExpense = (id: string) => {
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((item) => item.id !== id),
    }))
    setEditingExpense((prev) => (prev?.id === id ? null : prev))
  }

  const addSavingsRecord = (item: SavingsRecordItem) => {
    setState((prev) => ({
      ...prev,
      savingsRecords: [item, ...(prev.savingsRecords ?? [])],
    }))
  }

  const deleteSavingsRecord = (id: string) => {
    setState((prev) => ({
      ...prev,
      savingsRecords: (prev.savingsRecords ?? []).filter((item) => item.id !== id),
    }))
  }

  const resetIncomes = () => {
    const ok = window.confirm("収入データをすべて削除します。よろしいですか？")
    if (!ok) return

    setState((prev) => ({
      ...prev,
      incomes: [],
    }))
    setEditingIncome(null)
  }

  const resetExpenses = () => {
    const ok = window.confirm("支出データをすべて削除します。よろしいですか？")
    if (!ok) return

    setState((prev) => ({
      ...prev,
      expenses: [],
    }))
    setEditingExpense(null)
  }

  const resetAll = () => {
    const ok = window.confirm("すべての収入・支出・貯金記録・設定をリセットします。よろしいですか？")
    if (!ok) return

    setState(initialState)
    setSettings(initialSettings)
    setEditingIncome(null)
    setEditingExpense(null)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(SETTINGS_KEY)
  }

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    alert("保存しました")
  }

  const handlePrint = () => {
    window.print()
  }

  const totalIncome = useMemo(
    () => state.incomes.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [state.incomes]
  )

  const totalExpense = useMemo(
    () => state.expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [state.expenses]
  )

  const totalSavingsRecordAmount = useMemo(
    () =>
      (state.savingsRecords ?? []).reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      ),
    [state.savingsRecords]
  )

  const monthlyBalance = totalIncome - totalExpense
  const savingsRate =
    totalIncome > 0 ? (Math.max(monthlyBalance, 0) / totalIncome) * 100 : 0

  const deficitLevel = getDeficitLevel(monthlyBalance, totalIncome)
  const deficitMessage = getDeficitMessage(monthlyBalance, totalIncome)
  const aiAdvice = getAiAdvice(state.expenses, totalIncome, totalExpense)
  const expenseRanking = useMemo(
    () => getExpenseRanking(state.expenses),
    [state.expenses]
  )

  const months = FORECAST_MONTH_MAP[forecastPeriod]
  const forecastIncome = totalIncome * months
  const forecastExpense = totalExpense * months
  const forecastBalance = forecastIncome - forecastExpense
  const forecastSaving = Math.max(forecastBalance, 0)

  const sixMonthEmergencyTarget = settings.monthlyLivingCost * 6
  const oneMonthEmergencyTarget = settings.monthlyLivingCost
  const projectedEmergencyFund =
    settings.currentEmergencyFund + forecastBalance + totalSavingsRecordAmount
  const projectedEmergencyMonths =
    settings.monthlyLivingCost > 0
      ? projectedEmergencyFund / settings.monthlyLivingCost
      : 0

  const savingsGoalRequiredPerMonth =
    settings.savingsGoalPeriod === "12m"
      ? settings.savingsGoalAmount / 12
      : settings.savingsGoalAmount

  const actualSavingsPerMonth =
    Math.max(monthlyBalance, 0) + totalSavingsRecordAmount

  const savingsGoalAchievementRate =
    savingsGoalRequiredPerMonth > 0
      ? actualSavingsPerMonth / savingsGoalRequiredPerMonth
      : actualSavingsPerMonth > 0
      ? 1
      : 0

  const moneyMode = getMoneyMode({
    emergencyMonths: projectedEmergencyMonths,
    monthlyBalance,
    savingsGoalAchievementRate,
  })

  const emergencyRank = getEmergencyGuardRank(projectedEmergencyMonths)
  const savingsRank = getSavingsGuardRank(savingsGoalAchievementRate)
  const emergencyGuardOk = projectedEmergencyMonths >= 6
  const savingsGuardOk = savingsGoalAchievementRate >= 1

  const filteredIncomes = useMemo(() => {
    const keyword = incomeSearch.trim().toLowerCase()

    return state.incomes.filter((item) => {
      const memo = String(item.memo ?? "").toLowerCase()
      const source = String(item.source ?? "").toLowerCase()
      return memo.includes(keyword) || source.includes(keyword)
    })
  }, [state.incomes, incomeSearch])

  const filteredExpenses = useMemo(() => {
    const keyword = expenseSearch.trim().toLowerCase()

    return state.expenses.filter((item) => {
      const categoryOk =
        expenseCategoryFilter === "all" || item.category === expenseCategoryFilter
      const memo = String(item.memo ?? "").toLowerCase()
      const categoryLabel = getCategoryLabel(String(item.category)).toLowerCase()

      return categoryOk && (memo.includes(keyword) || categoryLabel.includes(keyword))
    })
  }, [state.expenses, expenseSearch, expenseCategoryFilter])

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 md:px-8 print:bg-white print:px-0 print:py-0">
      <div className="mx-auto max-w-7xl space-y-6 print:max-w-none">
        <section className="flex flex-wrap gap-3 print:hidden">
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
            12か月管理表
          </Link>

          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-blue-600 px-4 py-2 font-bold text-white"
          >
            保存
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="rounded-lg bg-slate-700 px-4 py-2 font-bold text-white"
          >
            印刷
          </button>

          <button
            type="button"
            onClick={resetIncomes}
            className="rounded-lg bg-amber-600 px-4 py-2 font-bold text-white"
          >
            収入を全削除
          </button>

          <button
            type="button"
            onClick={resetExpenses}
            className="rounded-lg bg-orange-600 px-4 py-2 font-bold text-white"
          >
            支出を全削除
          </button>

          <button
            type="button"
            onClick={resetAll}
            className="rounded-lg bg-red-700 px-4 py-2 font-bold text-white"
          >
            すべてリセット
          </button>
        </section>

        <FinanceDashboard state={state} />
        <DeficitAlertCard state={state} />

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">今月の収入</p>
            <p className="mt-1 text-xl font-bold text-blue-700">
              {formatCurrency(totalIncome)}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">今月の支出</p>
            <p className="mt-1 text-xl font-bold text-rose-700">
              {formatCurrency(totalExpense)}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">今月の収支</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {formatCurrency(monthlyBalance)}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">貯金率</p>
            <p className="mt-1 text-xl font-bold text-emerald-600">
              {savingsRate.toFixed(1)}%
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">貯金記録合計</p>
            <p className="mt-1 text-xl font-bold text-emerald-700">
              {formatCurrency(totalSavingsRecordAmount)}
            </p>
          </div>
        </section>

        <section className={`rounded-xl border p-6 shadow ${getDeficitBgClass(deficitLevel)}`}>
          <h2 className="mb-2 text-lg font-bold text-slate-800">赤字警告</h2>
          <p className="text-slate-700">{deficitMessage}</p>
        </section>

        <section className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-bold text-slate-800">AI支出アドバイス</h2>
          <div className="space-y-3">
            {aiAdvice.map((text, index) => (
              <div key={index} className="rounded-lg bg-slate-50 p-4 text-slate-700">
                {text}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-bold text-slate-800">支出ランキングAI</h2>

          {expenseRanking.length === 0 ? (
            <p className="text-slate-500">支出データがありません</p>
          ) : (
            <div className="space-y-3">
              {expenseRanking.map((item) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
                      {item.rank}位
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">{item.label}</p>
                      <p className="text-sm text-slate-500">
                        {item.rank === 1
                          ? "最優先で見直し候補"
                          : item.rank === 2
                          ? "次に見直す候補"
                          : "支出の比重を確認"}
                      </p>
                    </div>
                  </div>

                  <p className="font-bold text-rose-700">
                    {formatCurrency(item.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-bold text-slate-800">先取り貯金の判定基準</h2>

          <div className="space-y-2 text-sm text-slate-700">
            <p>対象に含む: 先取り貯金 / 定期預金 / 普通預金 / 投資の利益</p>
            <p>S: 目標の150%以上</p>
            <p>A: 目標の100%以上</p>
            <p>B: 目標の80%以上</p>
            <p>C: 目標の50%以上</p>
            <p>D: 目標の50%未満</p>
          </div>
        </section>

        <section className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-bold text-slate-800">目標設定</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                1か月の生活費
              </span>
              <input
                type="number"
                min={0}
                value={settings.monthlyLivingCost}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    monthlyLivingCost: Number(e.target.value || 0),
                  }))
                }
                className="w-full rounded border px-3 py-2"
                placeholder="例: 180000"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                現在の生活防衛資金
              </span>
              <input
                type="number"
                min={0}
                value={settings.currentEmergencyFund}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    currentEmergencyFund: Number(e.target.value || 0),
                  }))
                }
                className="w-full rounded border px-3 py-2"
                placeholder="例: 500000"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                先取り貯金の目標金額
              </span>
              <input
                type="number"
                min={0}
                value={settings.savingsGoalAmount}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    savingsGoalAmount: Number(e.target.value || 0),
                  }))
                }
                className="w-full rounded border px-3 py-2"
                placeholder="例: 30000"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                目標の期間
              </span>
              <select
                value={settings.savingsGoalPeriod}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    savingsGoalPeriod: e.target.value as SavingsGoalPeriod,
                  }))
                }
                className="w-full rounded border px-3 py-2"
              >
                <option value="1m">1か月目標</option>
                <option value="12m">12か月目標</option>
              </select>
            </label>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">1か月生活費</p>
              <p className="mt-1 text-lg font-bold">
                {formatCurrency(oneMonthEmergencyTarget)}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">生活防衛資金 6か月目標</p>
              <p className="mt-1 text-lg font-bold">
                {formatCurrency(sixMonthEmergencyTarget)}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">月あたり先取り貯金目標</p>
              <p className="mt-1 text-lg font-bold">
                {formatCurrency(savingsGoalRequiredPerMonth)}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">実際の達成対象額</p>
              <p className="mt-1 text-lg font-bold">
                {formatCurrency(actualSavingsPerMonth)}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl bg-white p-6 shadow">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-lg font-bold text-slate-800">将来予測</h2>

            <select
              value={forecastPeriod}
              onChange={(e) => setForecastPeriod(e.target.value as ForecastPeriod)}
              className="rounded border px-3 py-2"
            >
              <option value="3m">3ヶ月</option>
              <option value="6m">6ヶ月</option>
              <option value="1y">1年</option>
              <option value="3y">3年</option>
              <option value="5y">5年</option>
            </select>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">予測収入</p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {formatCurrency(forecastIncome)}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">予測支出</p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {formatCurrency(forecastExpense)}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">予測収支</p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {formatCurrency(forecastBalance)}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">見込み貯蓄</p>
              <p className="mt-1 text-lg font-bold text-emerald-600">
                {formatCurrency(forecastSaving)}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-bold text-slate-800">判定結果</h2>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-sm text-slate-500">現在の家計モード</p>
              <p className="mt-1 text-xl font-bold">{getModeLabel(moneyMode)}</p>
              <p className="mt-2 text-sm text-slate-600">
                {getModeDescription(moneyMode)}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-sm text-slate-500">防衛資金の見込み</p>
              <p className="mt-1 text-xl font-bold">
                {projectedEmergencyMonths.toFixed(1)}か月分
              </p>
              <p className="mt-2 text-sm">
                判定: <span className="font-bold">{emergencyGuardOk ? "守れた" : "守れない"}</span>
              </p>
              <p className="mt-1 text-sm">
                ランク: <span className="font-bold">{getRankLabel(emergencyRank)}</span>
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-sm text-slate-500">先取り貯金の達成度</p>
              <p className="mt-1 text-xl font-bold">
                {(savingsGoalAchievementRate * 100).toFixed(0)}%
              </p>
              <p className="mt-2 text-sm">
                判定: <span className="font-bold">{savingsGuardOk ? "守れた" : "守れない"}</span>
              </p>
              <p className="mt-1 text-sm">
                ランク: <span className="font-bold">{getRankLabel(savingsRank)}</span>
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">防衛資金の将来残高</p>
              <p className="mt-1 text-lg font-bold">
                {formatCurrency(projectedEmergencyFund)}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">先取り貯金の目標に対する月間必要額</p>
              <p className="mt-1 text-lg font-bold">
                {formatCurrency(savingsGoalRequiredPerMonth)}
              </p>
            </div>
          </div>
        </section>

        <IncomeForm
          editingItem={editingIncome}
          onAddItem={addIncome}
          onUpdateItem={updateIncome}
          onEditFinish={() => setEditingIncome(null)}
        />

        <section className="rounded-xl bg-white p-4 shadow">
          <input
            value={incomeSearch}
            onChange={(e) => setIncomeSearch(e.target.value)}
            placeholder="収入検索"
            className="w-full rounded border p-2"
          />

          <div className="mt-4">
            <IncomeList
              items={filteredIncomes}
              onEditItem={setEditingIncome}
              onDeleteItemAction={deleteIncome}
            />
          </div>
        </section>

        <ExpenseForm
          editingItem={editingExpense}
          onAddItem={addExpense}
          onUpdateItem={updateExpense}
          onEditFinishAction={() => setEditingExpense(null)}
        />

        <section className="rounded-xl bg-white p-4 shadow">
          <input
            value={expenseSearch}
            onChange={(e) => setExpenseSearch(e.target.value)}
            placeholder="支出検索"
            className="mb-3 w-full rounded border p-2"
          />

          <select
            value={expenseCategoryFilter}
            onChange={(e) =>
              setExpenseCategoryFilter(e.target.value as ExpenseCategory | "all")
            }
            className="mb-3 rounded border p-2"
          >
            <option value="all">全カテゴリ</option>
            {expenseCategoryOptions.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          <ExpenseList
            items={filteredExpenses}
            onEditItemAction={setEditingExpense}
            onDeleteItemAction={deleteExpense}
          />
        </section>

        <SavingsRecordForm onAddItem={addSavingsRecord} />

        <section className="rounded-xl bg-white p-4 shadow">
          <h2 className="mb-4 text-lg font-bold text-slate-800">貯金記録一覧</h2>
          <SavingsRecordList
            items={state.savingsRecords ?? []}
            onDeleteItem={deleteSavingsRecord}
          />
        </section>
      </div>
    </main>
  )
}