"use client"

import type { IncomeItem } from "@/types/finance"

type IncomeListProps = {
  items: IncomeItem[]
  onEditItem: (item: IncomeItem) => void
  onDeleteItemAction: (id: string) => void
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

export function IncomeList({
  items,
  onEditItem,
  onDeleteItemAction,
}: IncomeListProps) {
  if (items.length === 0) {
    return <p className="text-slate-500">収入データがありません</p>
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-lg border border-slate-200 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-bold">{(item as any).source ?? "収入"}</p>
              <p className="text-sm text-slate-500">{item.date}</p>
              <p className="text-sm text-slate-600">{item.memo}</p>
            </div>

            <div className="text-right">
              <p className="font-bold text-blue-700">
                {formatCurrency(item.amount)}
              </p>

              <div className="mt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => onEditItem(item)}
                  className="rounded bg-amber-500 px-3 py-1 text-sm font-bold text-white"
                >
                  編集
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteItemAction(item.id)}
                  className="rounded bg-red-600 px-3 py-1 text-sm font-bold text-white"
                >
                  削除
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}