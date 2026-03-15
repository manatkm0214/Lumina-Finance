"use client"

import { savingsRecordTypeOptions } from "@/constants/options"
import type { SavingsRecordItem } from "@/types/finance"

export type SavingsRecordListProps = {
  items: SavingsRecordItem[]
  onDeleteItemAction: (id: string) => void
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

function getTypeLabel(value: string) {
  return savingsRecordTypeOptions.find((item: { value: string }) => item.value === value)?.label ?? value
}

export function SavingsRecordList({ items, onDeleteItemAction }: SavingsRecordListProps) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-500">貯金記録がありません</p>
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
        >
          <div>
            <p className="font-bold text-slate-900">{item.amount.toLocaleString()}円</p>
            <p className="text-sm text-slate-500">{item.date}</p>
            {item.memo && <p className="text-sm text-slate-400">{item.memo}</p>}
          </div>

          <button
            type="button"
            onClick={() => onDeleteItemAction(item.id)}
            className="rounded-lg border border-rose-300 px-3 py-1 text-sm text-rose-600 hover:bg-rose-50"
          >
            削除
          </button>
        </li>
      ))}
    </ul>
  )
}