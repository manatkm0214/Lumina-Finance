"use client"

import { useEffect, useState } from "react"
import { expenseCategoryOptions } from "@/constants/options"
import type { ExpenseCategory, ExpenseItem } from "@/types/finance"

type ExpenseFormProps = {
  editingItem: ExpenseItem | null
  onAddItem: (item: ExpenseItem) => void
  onUpdateItem: (item: ExpenseItem) => void
  onEditFinishAction: () => void
}

type ExpenseFormValue = {
  date: string
  category: ExpenseCategory
  amount: string
  memo: string
}

function getToday() {
  return new Date().toISOString().slice(0, 10)
}

function createInitialForm(): ExpenseFormValue {
  return {
    date: getToday(),
    category: "food",
    amount: "",
    memo: "",
  }
}

export function ExpenseForm({
  editingItem,
  onAddItem,
  onUpdateItem,
  onEditFinishAction,
}: ExpenseFormProps) {
  const [form, setForm] = useState<ExpenseFormValue>(createInitialForm())

  useEffect(() => {
    if (editingItem) {
      setForm({
        date: editingItem.date ?? getToday(),
        category: (editingItem.category ?? "food") as ExpenseCategory,
        amount: String(editingItem.amount ?? ""),
        memo: String(editingItem.memo ?? ""),
      })
      return
    }

    setForm(createInitialForm())
  }, [editingItem])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const amount = Number(form.amount)
    const memo = form.memo.trim()

    if (!Number.isFinite(amount) || amount <= 0) {
      alert("金額を正しく入力してください")
      return
    }

    const nextItem: ExpenseItem = {
      ...(editingItem ?? {}),
      id: editingItem?.id ?? crypto.randomUUID(),
      date: form.date,
      category: form.category,
      amount,
      memo,
    } as ExpenseItem

    if (editingItem) {
      onUpdateItem(nextItem)
    } else {
      onAddItem(nextItem)
    }

    setForm(createInitialForm())
    onEditFinishAction()
  }

  const handleCancel = () => {
    setForm(createInitialForm())
    onEditFinishAction()
  }

  return (
    <section className="rounded-xl bg-white p-6 shadow print:hidden">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-800">
          {editingItem ? "支出を編集" : "支出を追加"}
        </h2>

        {editingItem && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">
            編集中
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">日付</span>
          <input
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                date: e.target.value,
              }))
            }
            className="w-full rounded border px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">カテゴリ</span>
          <select
            value={form.category}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                category: e.target.value as ExpenseCategory,
              }))
            }
            className="w-full rounded border px-3 py-2"
          >
            {expenseCategoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">金額</span>
          <input
            type="number"
            min={0}
            value={form.amount}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                amount: e.target.value,
              }))
            }
            placeholder="例: 1200"
            className="w-full rounded border px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">メモ</span>
          <input
            type="text"
            value={form.memo}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                memo: e.target.value,
              }))
            }
            placeholder="例: スーパー / 家賃 / カフェ"
            className="w-full rounded border px-3 py-2"
          />
        </label>

        <div className="md:col-span-2 flex flex-wrap gap-3">
          <button
            type="submit"
            className={`rounded-lg px-4 py-2 font-bold text-white ${
              editingItem ? "bg-amber-600" : "bg-rose-600"
            }`}
          >
            {editingItem ? "更新する" : "追加する"}
          </button>

          {editingItem && (
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg bg-slate-300 px-4 py-2 font-bold text-slate-800"
            >
              キャンセル
            </button>
          )}
        </div>
      </form>
    </section>
  )
}