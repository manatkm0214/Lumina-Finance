import type { ExpenseItem, IncomeItem } from "@/types/finance"

export type InvestmentUnlockConditionInput = {
  targetEmergencyFundMonths?: number
  emergencyFundTargetMonths?: number
  maxDeficitRate: number
  maxFixedCostRate: number
  minSavingsRate: number
  monthlyLivingCost?: number
  currentEmergencyFund?: number
}

export type InvestmentUnlockStatus = {
  unlocked: boolean
  currentDeficitRate: number
  currentFixedCostRate: number
  currentSavingsRate: number
  shortageEmergencyFund: number
  reasons: string[]
}

export function calculateInvestmentUnlockStatus(
  incomes: IncomeItem[],
  expenses: ExpenseItem[],
  condition: InvestmentUnlockConditionInput
): InvestmentUnlockStatus {
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0)
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0)
  const fixedExpense = expenses
    .filter((e) => e.type === "fixed")
    .reduce((s, e) => s + e.amount, 0)

  const currentDeficitRate =
    totalIncome > 0 ? Math.max((totalExpense - totalIncome) / totalIncome, 0) : totalExpense > 0 ? 1 : 0
  const currentFixedCostRate = totalExpense > 0 ? fixedExpense / totalExpense : 0
  const currentSavingsRate = totalIncome > 0 ? Math.max((totalIncome - totalExpense) / totalIncome, 0) : 0

  const targetMonths =
    condition.targetEmergencyFundMonths ?? condition.emergencyFundTargetMonths ?? 6
  const monthlyLivingCost = condition.monthlyLivingCost ?? fixedExpense
  const targetEmergencyFund = monthlyLivingCost * targetMonths
  const currentEmergencyFund = condition.currentEmergencyFund ?? 0
  const shortageEmergencyFund = Math.max(targetEmergencyFund - currentEmergencyFund, 0)

  const reasons: string[] = []
  if (currentDeficitRate > condition.maxDeficitRate) reasons.push("赤字率が基準を超えています")
  if (currentFixedCostRate > condition.maxFixedCostRate) reasons.push("固定費率が基準を超えています")
  if (currentSavingsRate < condition.minSavingsRate) reasons.push("貯蓄率が基準を下回っています")
  if (shortageEmergencyFund > 0) reasons.push("緊急資金が不足しています")

  return {
    unlocked: reasons.length === 0,
    currentDeficitRate,
    currentFixedCostRate,
    currentSavingsRate,
    shortageEmergencyFund,
    reasons,
  }
}