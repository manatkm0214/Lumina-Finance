"use client"

import { useEffect, useState } from "react"
import type { IncomeItem } from "@/types/finance"

type IncomeFormProps = {
  editingItem: IncomeItem | null
  onAddItem: (item: IncomeItem) => void
  onUpdateItem: (item: IncomeItem) => void
  onEditFinish: () => void
}

type IncomeFormValue = {
  date: string
  source: string
  amount: string
  memo: string
}

function getToday() {
  return new Date().toISOString().slice(0, 10)
}

function createInitialForm(): IncomeFormValue {
  return {
    date: getToday(),
    source: "",
    amount: "",
    memo: "",
  }
}

export function IncomeForm({
  editingItem,
  onAddItem,
  onUpdateItem,
  onEditFinish,
}: IncomeFormProps) {
  const [form, setForm] = useState<IncomeFormValue>(createInitialForm())

  useEffect(() => {
    if (editingItem) {
      setForm({
        date: editingItem.date ?? getToday(),
        source: String((editingItem as any).source ?? ""),
        amount: String(editingItem.amount ?? ""),
        memo: String(editingItem.memo ?? ""),
      })
      return
    }

    setForm(createInitialForm())
  }, [editingItem])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const source = form.source.trim()
    const memo = form.memo.trim()
    const amount = Number(form.amount)

    if (!source) {
      alert("収入名を入力してください")
      return
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      alert("金額を正しく入力してください")
      return
    }

    const nextItem: IncomeItem = {
      ...(editingItem ?? {}),
      id: editingItem?.id ?? crypto.randomUUID(),
      date: form.date,
      source,
      amount,
      memo,
    } as IncomeItem

    if (editingItem) {
      onUpdateItem(nextItem)
    } else {
      onAddItem(nextItem)
    }

    setForm(createInitialForm())
    onEditFinish()
  }

  const handleCancel = () => {
    setForm(createInitialForm())
    onEditFinish()
  }

  return (
    <section className="rounded-xl bg-white p-6 shadow print:hidden">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-800">
          {editingItem ? "収入を編集" : "収入を追加"}
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
          <span className="mb-1 block text-sm font-medium text-slate-700">収入名</span>
          <input
            type="text"
            value={form.source}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                source: e.target.value,
              }))
            }
            placeholder="例: 給与 / 副業 / ボーナス"
            className="w-full rounded border px-3 py-2"
          />
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
            placeholder="例: 250000"
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
            placeholder="例: 3月給与"
            className="w-full rounded border px-3 py-2"
          />
        </label>

        <div className="md:col-span-2 flex flex-wrap gap-3">
          <button
            type="submit"
            className={`rounded-lg px-4 py-2 font-bold text-white ${
              editingItem ? "bg-amber-600" : "bg-blue-600"
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