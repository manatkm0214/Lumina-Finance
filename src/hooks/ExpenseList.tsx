"use client"

import { useFinanceContext } from "@/hooks/useFinanceContext"
import {
  accountOptions,
  costTypeOptions,
  expenseCategoryOptions,
  necessityOptions,
  paymentMethodOptions,
} from "@/constants/options"
import { expenseSubCategories } from "@/constants/categories"
import type { ExpenseItem } from "@/types/finance"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(date: string) {
  if (!date) return "-"
  return new Date(date).toLocaleDateString("ja-JP")
}

function getLabel<T extends string>(
  options: { value: T; label: string }[],
  value: string
) {
  return options.find((option) => option.value === value)?.label ?? value
}

export function ExpenseList() {
  const { state, deleteExpense } = useFinanceContext()

  const expenses: ExpenseItem[] = state.expenses
  const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0)

  if (expenses.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900">支出一覧</h2>
          <p className="text-sm text-slate-500">まだ支出データがありません</p>
        </div>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900">支出一覧</h2>
          <p className="text-sm text-slate-500">登録件数: {expenses.length}件</p>
        </div>

        <div className="rounded-xl bg-slate-50 px-4 py-3 text-right">
          <p className="text-xs text-slate-500">合計支出</p>
          <p className="text-lg font-bold text-rose-600">
            {formatCurrency(totalAmount)}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {expenses.map((item) => {
          const subCategoryLabel =
            expenseSubCategories[item.category as keyof typeof expenseSubCategories]?.find(
              (option: { value: string; label: string }) => option.value === item.subCategory
            )?.label ?? item.subCategory

          return (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
                      {getLabel(expenseCategoryOptions, item.category)}
                    </span>

                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                      {subCategoryLabel}
                    </span>

                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                      {getLabel(paymentMethodOptions, item.paymentMethod)}
                    </span>
                  </div>

                  <div className="grid gap-1 text-sm text-slate-600">
                    <p>日付: {formatDate(item.date)}</p>
                    <p>口座: {getLabel(accountOptions, item.account)}</p>
                    <p>費用タイプ: {getLabel(costTypeOptions, item.costType)}</p>
                    <p>必要度: {getLabel(necessityOptions, item.necessity)}</p>
                    {item.memo ? <p>メモ: {item.memo}</p> : null}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <p className="text-xl font-bold text-rose-600">
                    {formatCurrency(item.amount)}
                  </p>

                  <button
                    type="button"
                    onClick={() => deleteExpense(item.id)}
                    className="rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                  >
                    削除
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}