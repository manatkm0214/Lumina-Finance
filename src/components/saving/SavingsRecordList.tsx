"use client"

import { savingsRecordTypeOptions } from "@/constants/options"
import type { SavingsRecordItem } from "@/types/finance"

type SavingsRecordListProps = {
  items: SavingsRecordItem[]
  onDeleteItem: (id: string) => void
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

export function SavingsRecordList({
  items,
  onDeleteItem,
}: SavingsRecordListProps) {
  if (items.length === 0) {
    return <p className="text-slate-500">貯金記録がありません</p>
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-lg border border-slate-200 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-bold">{getTypeLabel(item.type)}</p>
              <p className="text-sm text-slate-500">{item.date}</p>
              <p className="text-sm text-slate-600">{item.memo}</p>
            </div>

            <div className="text-right">
              <p className="font-bold text-emerald-700">
                {formatCurrency(item.amount)}
              </p>

              <button
                type="button"
                onClick={() => onDeleteItem(item.id)}
                className="mt-2 rounded bg-red-600 px-3 py-1 text-sm font-bold text-white"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}