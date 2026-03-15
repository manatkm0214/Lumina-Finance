"use client"

import {
  expenseCategoryOptions,
  paymentMethodOptions,
  accountOptions,
  costTypeOptions,
  necessityOptions,
} from "@/constants/options"
import { expenseSubCategories } from "@/constants/categories"
import type { ExpenseCategory, ExpenseItem } from "@/types/finance"

type Props = {
  items: ExpenseItem[]
  onEditAction: (e: ExpenseItem) => void
  onDeleteAction: (id: string) => void
}

type Option = { value: string; label: string }

function yen(v: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(v)
}

function label(options: Option[], value: string) {
  return options.find((o) => o.value === value)?.label ?? value
}

export function ExpenseList({ items, onEditAction, onDeleteAction }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">支出一覧</h2>

      {items.length === 0 && <p className="text-slate-500">データがありません</p>}

      {items.map((e) => {
        const subOptions = expenseSubCategories[e.category] ?? []
        const subLabel = subOptions.find((o) => o.value === e.subCategory)?.label ?? e.subCategory

        return (
          <div key={e.id} className="flex justify-between rounded-xl border p-4">
            <div className="space-y-1 text-sm">
              <p>
                {label(expenseCategoryOptions, e.category)} / {subLabel}
              </p>
              <p>支払方法: {label(paymentMethodOptions, e.paymentMethod)}</p>
              <p>口座: {label(accountOptions, e.account)}</p>
              <p>タイプ: {label(costTypeOptions, e.costType)}</p>
              <p>必要度: {label(necessityOptions, e.necessity)}</p>
              <p>日付: {e.date}</p>
              {e.memo && <p>メモ: {e.memo}</p>}
            </div>

            <div className="flex flex-col items-end gap-3">
              <p className="font-bold text-red-600">{yen(e.amount)}</p>
              <div className="flex gap-3">
                <button onClick={() => onEditAction(e)} className="text-sm text-sky-600">
                  編集
                </button>
                <button onClick={() => onDeleteAction(e.id)} className="text-sm text-red-500">
                  削除
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}