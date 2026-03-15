import type { FinanceState } from "@/types/finance"
// Ensure that FinanceState includes the 'deficit' property in its definition

export const FINANCE_STORAGE_KEY = "rebalance-finance-state"

const DEFAULT_FINANCE_STATE: FinanceState = {
  deficit: 0,
  incomes: [],
  expenses: [],
  emotions: [],
  budgets: [],
  savingGoal: 0, // Add default value for savingGoal
  uxMode: "standard", // Add default value for uxMode
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
    emotions: [], // EmotionLogItem[] として扱われる
    budgets: [],
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

function normalizeForecastPeriod(
  value: unknown,
  fallback: FinanceState["settings"]["forecastPeriod"],
): FinanceState["settings"]["forecastPeriod"] {
  if (value === "3m" || value === "6m" || value === "1y") return value
  if (value === "3months") return "3m"
  if (value === "6months") return "6m"
  if (value === "12months" || value === "1year") return "1y"
  return fallback
}

function mergeFinanceState(partial: Partial<FinanceState>): FinanceState {
  const defaultState = createDefaultFinanceState()
  const rawBucketRules = partial.settings?.bucketRules

return {
  deficit: typeof partial.deficit === "number" ? partial.deficit : defaultState.deficit,
  incomes: Array.isArray(partial.incomes) ? partial.incomes : defaultState.incomes,
  expenses: Array.isArray(partial.expenses) ? partial.expenses : defaultState.expenses,
  emotions: Array.isArray(partial.emotions) ? partial.emotions : defaultState.emotions,
  budgets: Array.isArray(partial.budgets) ? partial.budgets : defaultState.budgets,
  savingGoal: partial.savingGoal ?? defaultState.savingGoal,
  uxMode: partial.uxMode ?? defaultState.uxMode,
  settings: {
    uxMode: partial.settings?.uxMode ?? defaultState.settings.uxMode,
    forecastPeriod: normalizeForecastPeriod(
      partial.settings?.forecastPeriod,
      defaultState.settings.forecastPeriod
    ),
    budgetPeriod: partial.settings?.budgetPeriod ?? defaultState.settings.budgetPeriod,
    household: {
      familySize: partial.settings?.household?.familySize ??
        defaultState.settings.household.familySize,
      housing: {
        type: partial.settings?.household?.housing?.type ??
          defaultState.settings.household.housing.type,
        monthlyRent: partial.settings?.household?.housing?.monthlyRent ??
          defaultState.settings.household.housing.monthlyRent,
        monthlyMortgage: partial.settings?.household?.housing?.monthlyMortgage ??
          defaultState.settings.household.housing.monthlyMortgage,
        monthlyManagementFee: partial.settings?.household?.housing?.monthlyManagementFee ??
          defaultState.settings.household.housing.monthlyManagementFee,
        monthlyRepairReserve: partial.settings?.household?.housing?.monthlyRepairReserve ??
          defaultState.settings.household.housing.monthlyRepairReserve,
        monthlyParkingFee: partial.settings?.household?.housing?.monthlyParkingFee ??
          defaultState.settings.household.housing.monthlyParkingFee,
      },
    },
    investmentUnlockCondition: {
      emergencyFundTargetMonths: partial.settings?.investmentUnlockCondition?.emergencyFundTargetMonths ??
        defaultState.settings.investmentUnlockCondition.emergencyFundTargetMonths,
      maxDeficitRate: partial.settings?.investmentUnlockCondition?.maxDeficitRate ??
        defaultState.settings.investmentUnlockCondition.maxDeficitRate,
      maxFixedCostRate: partial.settings?.investmentUnlockCondition?.maxFixedCostRate ??
        defaultState.settings.investmentUnlockCondition.maxFixedCostRate,
      minSavingsRate: partial.settings?.investmentUnlockCondition?.minSavingsRate ??
        defaultState.settings.investmentUnlockCondition.minSavingsRate,
    },
    bucketRules: Array.isArray(rawBucketRules)
      ? rawBucketRules
      : defaultState.settings.bucketRules,
  }
}
}