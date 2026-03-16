export type UXMode = "standard" | "support" | "spartan"

export type ForecastPeriod = "3m" | "6m" | "1y"
export type BudgetPeriod = "monthly" | "yearly"

export type FamilySize = "1" | "2" | "3" | "4" | "5+"

export type HousingType =
  | "rent"
  | "ownHouse"
  | "ownedMansion"
  | "withParents"
  | "companyHousing"

export type BucketType = "living" | "emergency" | "investment" | "free"

export type ExpenseCategory =
  | "food"
  | "daily"
  | "housing"
  | "utilities"
  | "communication"
  | "transportation"
  | "medical"
  | "insurance"
  | "education"
  | "entertainment"
  | "beauty"
  | "social"
  | "subscription"
  | "other"

export type IncomeCategory =
  | "salary"
  | "bonus"
  | "sideJob"
  | "pension"
  | "allowance"
  | "other"

export type EmotionType =
  | "happy"
  | "calm"
  | "sad"
  | "anxious"
  | "stressed"
  | "motivated"

export interface IncomeItem {
  id: string
  amount: number
  category: IncomeCategory
  date: string
  memo: string
}

export interface ExpenseItem {
  id: string
  amount: number
  category: ExpenseCategory
  date: string
  memo: string
  type: ExpenseType
}

export interface EmotionItem {
  id: string
  emotion: EmotionType
  date: string
  memo: string
}

export interface BudgetItem {
  id: string
  category: ExpenseCategory
  amount: number
  period: BudgetPeriod
}

export interface HousingSettings {
  type: HousingType
  monthlyRent: number
  monthlyMortgage: number
  monthlyManagementFee: number
  monthlyRepairReserve: number
  monthlyParkingFee: number
}

export interface HouseholdSettings {
  familySize: FamilySize
  housing: HousingSettings
}

export interface InvestmentUnlockCondition {
  targetEmergencyFundMonths: number
  maxDeficitRate: number
  maxFixedCostRate: number
  minSavingsRate: number
}

export interface BucketRule {
  bucket: BucketType
  percent: number
}

export interface FinanceSettings {
  forecastPeriod: ForecastPeriod
  budgetPeriod: BudgetPeriod
  household: HouseholdSettings
  investmentUnlockCondition: InvestmentUnlockCondition
  bucketRules: BucketRule[]
}

export interface FinanceState {
  deficit: number
  incomes: IncomeItem[]
  expenses: ExpenseItem[]
  emotions: EmotionItem[]
  budgets: BudgetItem[]
  savingGoal: number
  uxMode: UXMode
  settings: FinanceSettings
}

export type ExpenseType = "fixed" | "variable"

export function calculateCostTotals(expenses: ExpenseItem[]) {
  const fixedCostTotal = expenses
    .filter((item) => item.type === "fixed")
    .reduce((sum, item) => sum + item.amount, 0)

  const variableCostTotal = expenses
    .filter((item) => item.type === "variable")
    .reduce((sum, item) => sum + item.amount, 0)

  return { fixedCostTotal, variableCostTotal }
}