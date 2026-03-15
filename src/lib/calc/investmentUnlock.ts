import type { ExpenseItem, IncomeItem, InvestmentUnlockCondition } from "@/types/finance"

import {
  sumExpenseItems,
  sumIncomeItems,
  deficitRate,
  fixedCostRate,
  savingsRate,
} from "@/lib/calc/basic"

export type InvestmentUnlockResult = {

  unlocked: boolean

  reasons: string[]

  shortageEmergencyFund: number

  currentDeficitRate: number

  currentFixedCostRate: number

  currentSavingsRate: number

}



export function calculateInvestmentUnlock(
  incomes: IncomeItem[],
  expenses: ExpenseItem[],
  condition: InvestmentUnlockCondition   // 3番目は condition のみ
): InvestmentUnlockResult {

  const income =
    sumIncomeItems(incomes)

  const expense =
    sumExpenseItems(expenses)

  const deficit =
    deficitRate(incomes, expenses)

  const fixedRate =
    fixedCostRate(expenses)

  const savings =
    savingsRate(incomes, expenses)



  const reasons: string[] = []



  /* 緊急資金 (生活費6ヶ月) */

  const emergencyTarget =
    expense * 6

  const currentSavings =
    Math.max(income - expense, 0)

  const shortage =
    Math.max(emergencyTarget - currentSavings, 0)



  if (shortage > 0) {

    reasons.push("緊急資金が不足しています")

  }



  /* 赤字率 */

  if (deficit > 0.05) {

    reasons.push("赤字率が高すぎます")

  }



  /* 固定費率 */

  if (fixedRate > 0.5) {

    reasons.push("固定費率が高すぎます")

  }



  /* 貯蓄率 */

  if (savings < 0.1) {

    reasons.push("貯蓄率が低すぎます")

  }



  return {

    unlocked: reasons.length === 0,

    reasons,

    shortageEmergencyFund: shortage,

    currentDeficitRate: deficit,

    currentFixedCostRate: fixedRate,

    currentSavingsRate: savings

  }

}