"use client"

type HeaderProps = {
  title?: string
  subtitle?: string
}

export function Header({
  title = "ReBalance",
  subtitle = "家計の可視化・支出管理・未来予測・貯金判断をまとめて確認できます",
}: HeaderProps) {
  return (
    <header className="card-base p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
            Finance Dashboard
          </p>

          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
            {title}
          </h1>

          <p className="max-w-2xl text-sm text-slate-500 md:text-base">
            {subtitle}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs text-slate-500">今日の確認ポイント</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            支出・貯蓄・赤字率
          </p>
        </div>
      </div>
    </header>
  )
}