import type { FinanceState } from "@/types/finance"

export const FINANCE_STORAGE_KEY = "rebalance-finance-state"

const DEFAULT_FINANCE_STATE: FinanceState = {
  deficit: 0,
  savingGoal: 0, // もし型が number でない場合は FinanceState 定義に合わせて変更
  uxMode: "standard",
  incomes: [],
  expenses: [],
  emotions: [],
  budgets: [], // FinanceState で型が効く
  settings: {
    uxMode: "standard",
    forecastPeriod: "6m",
    budgetPeriod: "monthly",
    household: {
      familySize: "1",
      housing: {
        type: "rent",
        monthlyRent: 0,
        monthlyMortgage: 0,
        monthlyManagementFee: 0,
        monthlyRepairReserve: 0,
        monthlyParkingFee: 0,
      },
    },
    investmentUnlockCondition: {
      emergencyFundTargetMonths: 6,
      maxDeficitRate: 0.05,
      maxFixedCostRate: 0.5,
      minSavingsRate: 0.1,
    },
    bucketRules: [
      { bucket: "living", percent: 60 },
      { bucket: "emergency", percent: 20 },
      { bucket: "investment", percent: 10 },
      { bucket: "free", percent: 10 },
    ],
  },
}

function canUseStorage() {
  return typeof window !== "undefined"
}

export function createDefaultFinanceState(): FinanceState {
  return {
    incomes: [],
    expenses: [],
    emotions: [],
    budgets: [], // FinanceState で型が効く
    deficit: 0,
    savingGoal: 0,
    uxMode: "standard",
    settings: {
      uxMode: "standard",
      forecastPeriod: "6m",
      budgetPeriod: "monthly",
      household: {
        familySize: "1",
        housing: {
          type: "rent",
          monthlyRent: 0,
          monthlyMortgage: 0,
          monthlyManagementFee: 0,
          monthlyRepairReserve: 0,
          monthlyParkingFee: 0,
        },
      },
      investmentUnlockCondition: {
        emergencyFundTargetMonths: 6,
        maxDeficitRate: 0.05,
        maxFixedCostRate: 0.5,
        minSavingsRate: 0.1,
      },
      bucketRules: [
        { bucket: "living", percent: 60 },
        { bucket: "emergency", percent: 20 },
        { bucket: "investment", percent: 10 },
        { bucket: "free", percent: 10 },
      ],
    },
  }
}

export function loadFinanceState(): FinanceState {
  if (!canUseStorage()) {
    return createDefaultFinanceState()
  }

  try {
    const raw = window.localStorage.getItem(FINANCE_STORAGE_KEY)

    if (!raw) {
      return createDefaultFinanceState()
    }

    const parsed = JSON.parse(raw) as Partial<FinanceState>
    return mergeFinanceState(parsed)
  } catch (error) {
    console.error("Failed to load finance state:", error)
    return createDefaultFinanceState()
  }
}

export function saveFinanceState(state: FinanceState) {
  if (!canUseStorage()) return

  try {
    window.localStorage.setItem(FINANCE_STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error("Failed to save finance state:", error)
  }
}

export function clearFinanceState() {
  if (!canUseStorage()) return

  try {
    window.localStorage.removeItem(FINANCE_STORAGE_KEY)
  } catch (error) {
    console.error("Failed to clear finance state:", error)
  }
}

function mergeFinanceState(partial: Partial<FinanceState>): FinanceState {
  const defaults = createDefaultFinanceState()

  return {
    deficit: typeof partial.deficit === "number" ? partial.deficit : defaults.deficit,
    savingGoal:
      typeof partial.savingGoal === "number" ? partial.savingGoal : defaults.savingGoal,
    uxMode: partial.uxMode ?? defaults.uxMode,
    incomes: Array.isArray(partial.incomes) ? partial.incomes : defaults.incomes,
    expenses: Array.isArray(partial.expenses) ? partial.expenses : defaults.expenses,
    emotions: Array.isArray(partial.emotions) ? partial.emotions : defaults.emotions,
    budgets: Array.isArray(partial.budgets) ? partial.budgets : defaults.budgets,
    settings: {
      uxMode: partial.settings?.uxMode ?? defaults.settings.uxMode,
      forecastPeriod: partial.settings?.forecastPeriod ?? defaults.settings.forecastPeriod,
      budgetPeriod: partial.settings?.budgetPeriod ?? defaults.settings.budgetPeriod,
      household: {
        familySize:
          partial.settings?.household?.familySize ??
          defaults.settings.household.familySize,
        housing: {
          type:
            partial.settings?.household?.housing?.type ??
            defaults.settings.household.housing.type,
          monthlyRent:
            partial.settings?.household?.housing?.monthlyRent ??
            defaults.settings.household.housing.monthlyRent,
          monthlyMortgage:
            partial.settings?.household?.housing?.monthlyMortgage ??
            defaults.settings.household.housing.monthlyMortgage,
          monthlyManagementFee:
            partial.settings?.household?.housing?.monthlyManagementFee ??
            defaults.settings.household.housing.monthlyManagementFee,
          monthlyRepairReserve:
            partial.settings?.household?.housing?.monthlyRepairReserve ??
            defaults.settings.household.housing.monthlyRepairReserve,
          monthlyParkingFee:
            partial.settings?.household?.housing?.monthlyParkingFee ??
            defaults.settings.household.housing.monthlyParkingFee,
        },
      },
      investmentUnlockCondition: {
        emergencyFundTargetMonths:
          partial.settings?.investmentUnlockCondition?.emergencyFundTargetMonths ??
          defaults.settings.investmentUnlockCondition.emergencyFundTargetMonths,
        maxDeficitRate:
          partial.settings?.investmentUnlockCondition?.maxDeficitRate ??
          defaults.settings.investmentUnlockCondition.maxDeficitRate,
        maxFixedCostRate:
          partial.settings?.investmentUnlockCondition?.maxFixedCostRate ??
          defaults.settings.investmentUnlockCondition.maxFixedCostRate,
        minSavingsRate:
          partial.settings?.investmentUnlockCondition?.minSavingsRate ??
          defaults.settings.investmentUnlockCondition.minSavingsRate,
      },
      bucketRules: Array.isArray(partial.settings?.bucketRules)
        ? partial.settings!.bucketRules
        : defaults.settings.bucketRules,
    },
  }
}