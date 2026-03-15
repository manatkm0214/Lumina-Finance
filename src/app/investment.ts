import type {
  ExpenseItem,
  IncomeItem
} from "@/types/finance"
import { deficitRate, fixedCostRate, savingsRate } from "@/lib/calc/basic"

function getEmergencyFundTarget(
  expenses: ExpenseItem[],
  targetMonths: number
) {
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0)
  if (totalExpense <= 0) return 0

  const monthKeys = new Set(
    expenses.map((item) => {
      const d = new Date(item.date)
      return `${d.getFullYear()}-${d.getMonth() + 1}`
    })
  )

  const monthCount = Math.max(monthKeys.size, 1)
  const averageMonthlyExpense = totalExpense / monthCount

  return averageMonthlyExpense * targetMonths
}

function getCurrentEmergencyFund(incomes: IncomeItem[], expenses: ExpenseItem[]) {
  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0)
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0)
  return Math.max(totalIncome - totalExpense, 0)
}

type NewType = {
  emergencyFundTargetMonths: number
  maxDeficitRate: number
  maxFixedCostRate: number
  minSavingsRate: number
}

export function calculateInvestmentUnlockStatus(
  incomes: IncomeItem[],
  expenses: ExpenseItem[],
  condition: NewType
): {
  unlocked: boolean
  reasons: string[]
  shortageEmergencyFund: number
  currentDeficitRate: number
  currentFixedCostRate: number
  currentSavingsRate: number
} {
  const currentDeficitRate = deficitRate(incomes, expenses)
  const currentFixedCostRate = fixedCostRate(expenses)
  const currentSavingsRate = savingsRate(incomes, expenses)

  const emergencyFundTarget = getEmergencyFundTarget(
    expenses,
    condition.emergencyFundTargetMonths
  )
  const currentEmergencyFund = getCurrentEmergencyFund(incomes, expenses)
  const shortageEmergencyFund = Math.max(
    emergencyFundTarget - currentEmergencyFund,
    0
  )

  const reasons: string[] = []

  if (shortageEmergencyFund > 0) {
    reasons.push("緊急資金が不足しています")
  }

  if (currentDeficitRate > condition.maxDeficitRate) {
    reasons.push("赤字率が基準を超えています")
  }

  if (currentFixedCostRate > condition.maxFixedCostRate) {
    reasons.push("固定費率が高すぎます")
  }

  if (currentSavingsRate < condition.minSavingsRate) {
    reasons.push("貯蓄率が基準未満です")
  }

  return {
    unlocked: reasons.length === 0,
    reasons,
    shortageEmergencyFund,
    currentDeficitRate,
    currentFixedCostRate,
    currentSavingsRate,
  }
}