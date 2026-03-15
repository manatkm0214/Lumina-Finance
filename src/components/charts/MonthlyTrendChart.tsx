"use client"

import useFinanceContext from "@/hooks/useFinanceContext"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value)
}

function getMonthKey(dateStr: string) {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

export function MonthlyTrendChart() {
  const { state } = useFinanceContext()

  const monthMap = new Map<
    string,
    {
      month: string
      income: number
      expense: number
    }
  >()

  type IncomeExpenseItem = { date: string; amount: number }

  state.incomes.forEach((item: IncomeExpenseItem) => {
    const month = getMonthKey(item.date)
    const prev = monthMap.get(month) ?? { month, income: 0, expense: 0 }
    prev.income += item.amount
    monthMap.set(month, prev)
  })

  state.expenses.forEach((item: IncomeExpenseItem) => {
    const month = getMonthKey(item.date)
    const prev = monthMap.get(month) ?? { month, income: 0, expense: 0 }
    prev.expense += item.amount
    monthMap.set(month, prev)
  })

  const data = Array.from(monthMap.values()).sort((a, b) => a.month.localeCompare(b.month))
  const maxValue = Math.max(...data.flatMap((item) => [item.income, item.expense]), 0)

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-slate-900">月次推移グラフ</h2>

      {data.length === 0 ? (
        <p className="text-slate-500">月次データがありません。</p>
      ) : (
        <div className="space-y-5">
          {data.map((item) => {
            const incomeWidth = maxValue <= 0 ? 0 : Math.round((item.income / maxValue) * 100)
            const expenseWidth = maxValue <= 0 ? 0 : Math.round((item.expense / maxValue) * 100)

            return (
              <div key={item.month} className="rounded-2xl bg-slate-50 p-4">
                <p className="mb-3 font-semibold text-slate-800">{item.month}</p>

                <div className="space-y-3">
                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-emerald-700">収入</span>
                      <span>{formatCurrency(item.income)}</span>
                    </div>
                    <div className="h-4 rounded-full bg-slate-100">
                      <div
                        className="h-4 rounded-full bg-emerald-500"
                        style={{ width: `${incomeWidth}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-slate-700">支出</span>
                      <span>{formatCurrency(item.expense)}</span>
                    </div>
                    <div className="h-4 rounded-full bg-slate-100">
                      <div
                        className="h-4 rounded-full bg-slate-700"
                        style={{ width: `${expenseWidth}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}