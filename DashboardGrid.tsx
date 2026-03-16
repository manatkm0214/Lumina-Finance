type Props = {
  deficitRate: number
}

function getDeficitStatus(rate: number) {
  if (rate >= 20) {
    return {
      title: "危険",
      message: "かなり厳しい状態です。固定費と変動費を緊急見直し。",
      badgeClass: "bg-red-100 text-red-700",
    }
  }
  if (rate >= 10) {
    return {
      title: "警告",
      message: "赤字傾向です。支出を減らす必要があります。",
      badgeClass: "bg-orange-100 text-orange-700",
    }
  }
  if (rate >= 5) {
    return {
      title: "注意",
      message: "やや危険です。早めに調整しましょう。",
      badgeClass: "bg-yellow-100 text-yellow-700",
    }
  }
  return {
    title: "安全",
    message: "収支は安定しています。",
    badgeClass: "bg-emerald-100 text-emerald-700",
  }
}

export function DeficitAlertCard({ deficitRate }: Props) {
  const status = getDeficitStatus(deficitRate)

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-slate-900">赤字警告UI</h2>

      <p className="text-sm text-slate-500">現在の赤字率: {deficitRate}%</p>

      <div className={`mt-4 inline-flex rounded-full px-3 py-1 text-sm font-bold ${status.badgeClass}`}>
        {status.title}
      </div>

      <p className="mt-3 text-slate-700">{status.message}</p>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
        <p>基準</p>
        <p className="mt-2">注意: 5%以上</p>
        <p>警告: 10%以上</p>
        <p>危険: 20%以上</p>
      </div>
    </section>
  )
}