export type SelectOption<T extends string> = {
  value: T
  label: string
}

export type UXMode = "standard" | "cheer" | "spartan"

export type IncomeCategory =
  | "salary"
  | "bonus"
  | "sideJob"
  | "allowance"
  | "pension"
  | "other"

export type ExpenseCategory =
  | "food"
  | "daily"
  | "housing"
  | "utility"
  | "communication"
  | "transport"
  | "medical"
  | "education"
  | "entertainment"
  | "beautyClothing"
  | "insurance"
  | "tax"
  | "other"

export type ExpenseSubCategory =
  | "homeCooking"
  | "eatingOut"
  | "cafe"
  | "groceries"
  | "convenienceStore"
  | "snacks"
  | "drinks"
  | "delivery"
  | "consumables"
  | "materials"
  | "paperGoods"
  | "kitchenGoods"
  | "bathToiletGoods"
  | "babyGoods"
  | "petGoods"
  | "detergent"
  | "rent"
  | "mortgage"
  | "managementFee"
  | "repairReserve"
  | "electricity"
  | "gas"
  | "water"
  | "mobile"
  | "internet"
  | "landline"
  | "train"
  | "bus"
  | "parking"
  | "inspection"
  | "furniture"
  | "appliances"
  | "device"
  | "moving"
  | "clothing"
  | "shoes"
  | "bag"
  | "hospital"
  | "dental"
  | "medicine"
  | "contactsGlasses"
  | "books"
  | "tuition"
  | "cramSchool"
  | "qualification"
  | "seminar"
  | "movie"
  | "music"
  | "game"
  | "travel"
  | "event"
  | "hobby"
  | "oshiKatsu"
  | "cosmetics"
  | "hairSalon"
  | "nail"
  | "skinCare"
  | "bodyCare"
  | "tops"
  | "lifeInsurance"
  | "medicalInsurance"
  | "cancerInsurance"
  | "carInsurance"
  | "fireInsurance"
  | "personalPension"
  | "nationalPension"
  | "nationalHealthInsurance"
  | "residentTax"
  | "incomeTax"
  | "misc"
  | "other"

export type PaymentMethod =
  | "cash"
  | "debitCard"
  | "creditCard"
  | "bankTransfer"
  | "mobilePay"
  | "points"

export type CostType = "monthly" | "yearly" | "temporary"

export type Necessity = "need" | "want" | "impulse"
export type NecessityLevel = Necessity

export type AccountType = "cash" | "mainBank" | "subBank" | "credit" | "eMoney"

export type ExpenseType = "fixed" | "variable"

export type SavingsRecordType =
  | "regularSavings"
  | "fixedDeposit"
  | "ordinaryDeposit"
  | "investmentProfit"

export type DateString = string & { readonly _brand: "DateString" }

export type ForecastPeriod =
  | "1month"
  | "3months"
  | "6months"
  | "1year"
  | "3years"
  | "5years"

export type ForecastShortPeriod = "3m" | "6m" | "1y" | "5y"
export type ForecastMonthsMap = Record<ForecastShortPeriod, number>

export type BudgetPeriod = "monthly" | "yearly"
export type BucketType = "living" | "emergency" | "investment" | "free"
export type HousingType = "rent" | "own"
export type FamilySize = "1" | "2" | "3" | "4" | "5+"
export type SavingsGoalPeriod = "1m" | "12m"
export type DeficitLevel = "safe" | "caution" | "warning" | "danger"

export type EmotionType =
  | "happy"
  | "sad"
  | "angry"
  | "anxious"
  | "guilty"
  | "satisfied"
  | "regret"
  | "neutral"

export type EmotionTrigger =
  | "impulse"
  | "stress"
  | "reward"
  | "necessity"
  | "social"
  | "habit"
  | "other"

export type BucketRule = {
  bucket: BucketType
  percent: number
}

export type HousingSettings = {
  type: HousingType
  monthlyRent: number
  monthlyMortgage: number
  monthlyManagementFee: number
  monthlyRepairReserve: number
  monthlyParkingFee: number
}

export type HouseholdSettings = {
  familySize: FamilySize
  housing: HousingSettings
}

export type InvestmentUnlockCondition = {
  targetEmergencyFundMonths: number
  maxDeficitRate: number
  maxFixedCostRate: number
  minSavingsRate: number
}

export type AppSettings = {
  budgetPeriod: BudgetPeriod
  household: HouseholdSettings
  investmentUnlockCondition: InvestmentUnlockCondition
  bucketRules: BucketRule[]
  monthlyLivingCost: number
  currentEmergencyFund: number
  savingsGoalAmount: number
  savingsGoalPeriod: SavingsGoalPeriod
}

export type IncomeItem = {
  id: string
  amount: number
  date: string
  category: IncomeCategory
  source?: string
  memo: string
  createdAt: string
  updatedAt: string
}

export type ExpenseItem = {
  id: string
  amount: number
  date: string
  category: ExpenseCategory
  subCategory?: ExpenseSubCategory
  memo: string
  paymentMethod: PaymentMethod
  account: AccountType
  type?: ExpenseType
  costType: CostType
  necessity: NecessityLevel
  createdAt: string
  updatedAt: string
}

export type EmotionLogItem = {
  id: string
  date: string
  emotion: EmotionType
  trigger?: EmotionTrigger
  intensity: number
  note?: string
  relatedExpenseId?: string
  createdAt: string
  updatedAt: string
}

export type EmotionItem = EmotionLogItem

export type BudgetItem = {
  id: string
  category: ExpenseCategory
  amount: number
  period: BudgetPeriod
  alertThresholdPercent: number
  createdAt: string
  updatedAt: string
}

export type SavingsRecordItem = {
  id: string
  amount: number
  date: DateString
  type: SavingsRecordType
  memo: string
}

export type IncomeFormValue = {
  date: string
  category: IncomeCategory
  amount: number | string
  source?: string
  memo: string
}

export type ExpenseFormValue = {
  date: string
  category: ExpenseCategory
  subCategory?: ExpenseSubCategory
  amount: number | string
  paymentMethod: PaymentMethod
  account: AccountType
  costType: CostType
  necessity: NecessityLevel
  memo: string
}

export type EmotionFormValue = {
  date: string
  emotion: EmotionType
  trigger?: EmotionTrigger
  intensity: number
  note?: string
  relatedExpenseId?: string
}

export interface FinanceState {
  incomes: IncomeItem[]
  expenses: ExpenseItem[]
  emotions: EmotionLogItem[]
  budgets: BudgetItem[]
  savingsRecords: SavingsRecordItem[]
  deficit: number
  savingGoal: number
  uxMode: UXMode
  forecastPeriod: ForecastShortPeriod
  settings: AppSettings
}

export interface MonthlySummary {
  month: string
  income: number
  expense: number
  balance: number
}
