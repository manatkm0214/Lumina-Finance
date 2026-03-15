"use client"

import { useState } from "react"
import { savingsRecordTypeOptions } from "@/constants/options"
import type { DateString, SavingsRecordItem, SavingsRecordType } from "@/types/finance"

type SavingsRecordFormProps = {
  onAddItemAction: (item: SavingsRecordItem) => void
}

type FormValue = {
  date: DateString
  type: SavingsRecordType
  amount: string
  memo: string
}

function getToday(): DateString {
  return new Date().toISOString().slice(0, 10) as DateString
}

function createInitialForm(): FormValue {
  return {
    date: getToday(),
    type: "regularSavings",
    amount: "",
    memo: "",
  }
}

export function SavingsRecordForm({ onAddItemAction }: SavingsRecordFormProps) {
  const [form, setForm] = useState<FormValue>(createInitialForm())

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const amount = Number(form.amount)
    if (!Number.isFinite(amount) || amount <= 0) {
      alert("金額を正しく入力してください")
      return
    }

    onAddItemAction({
      id: crypto.randomUUID(),
      date: form.date,
      type: form.type,
      amount,
      memo: form.memo.trim(),
    })

    setForm(createInitialForm())
  }

  return (
    <section className="rounded-xl bg-white p-6 shadow print:hidden">
      <h2 className="mb-4 text-lg font-bold text-slate-800">貯金記録を追加</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <input
          type="date"
          value={form.date}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, date: e.target.value as DateString }))
          }
          className="w-full rounded border px-3 py-2"
        />

        <select
          value={form.type}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              type: e.target.value as SavingsRecordType,
            }))
          }
          className="w-full rounded border px-3 py-2"
        >
          {savingsRecordTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <input
          type="number"
          min={0}
          value={form.amount}
          onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
          placeholder="金額"
          className="w-full rounded border px-3 py-2"
        />

        <input
          type="text"
          value={form.memo}
          onChange={(e) => setForm((prev) => ({ ...prev, memo: e.target.value }))}
          placeholder="メモ"
          className="w-full rounded border px-3 py-2"
        />

        <div className="md:col-span-2">
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-4 py-2 font-bold text-white"
          >
            貯金記録を追加
          </button>
        </div>
      </form>
    </section>
  )
}