"use client"

import { useFinanceContext } from "@/hooks/useFinanceContext"

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.href = url
  link.download = filename
  link.click()

  URL.revokeObjectURL(url)
}

function buildExportFileName() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")

  return `rebalance-backup-${y}-${m}-${d}.json`
}

export function AppActions() {
  const { state } = useFinanceContext()

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    downloadJson(buildExportFileName(), state)
  }

  const handleDeleteAll = () => {
    const ok = window.confirm(
      "家計データをすべて削除します。よろしいですか？"
    )

    if (!ok) return

    localStorage.clear()
    window.alert("家計データを削除しました。")
  }

  return (
    <section className="card-base no-print p-4">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handlePrint}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          印刷
        </button>

        <button
          type="button"
          onClick={handleExport}
          className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          保存
        </button>

        <button
          type="button"
          onClick={handleDeleteAll}
          className="rounded-xl border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
        >
          削除
        </button>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        保存は JSON バックアップです。削除は localStorage の全家計データを消します。
      </p>
    </section>
  )
}