// src/lib/storage/financeStorage.ts

import type { FinanceState } from "@/types/finance"

// Extend FinanceState to include missing properties if not present in the original type
type FinanceSettings = {
  uxMode: string
  forecastPeriod: string
  budgetPeriod: string
  household: {
    familySize: string
    housing: {
      type: string
      monthlyRent: number
      monthlyMortgage: number
      monthlyManagementFee: number
      monthlyRepairReserve: number
      monthlyParkingFee: number
    }
  }
  investmentUnlockCondition: {
    emergencyFundTargetMonths: number
    maxDeficitRate: number
    maxFixedCostRate: number
    minSavingsRate: number
  }
  bucketRules: { bucket: string; percent: number }[]
}

type ExtendedFinanceState = {
  incomes: unknown[]
  expenses: unknown[]
  emotions: unknown[]
  budgets: unknown[]
  settings: FinanceSettings
  deficit: number
}

// Use ExtendedFinanceState instead of FinanceState throughout this file

export const FINANCE_STORAGE_KEY = "rebalance-finance-state"

const DEFAULT_FINANCE_STATE: ExtendedFinanceState = {
  incomes: [],
  expenses: [],
  emotions: [],
  budgets: [],
  settings: {
    uxMode: "standard",
    forecastPeriod: "6m", // <- "6months" から修正
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
  deficit: 0,
}

function isBrowser() {
  return typeof window !== "undefined"
}

export function createDefaultFinanceState(): ExtendedFinanceState {
  return structuredClone(DEFAULT_FINANCE_STATE)
}

export function loadFinanceState(): ExtendedFinanceState {
  if (!isBrowser()) {
    return createDefaultFinanceState()
  }

  try {
    const raw = window.localStorage.getItem(FINANCE_STORAGE_KEY)

    if (!raw) {
      return createDefaultFinanceState()
    }

    const parsed = JSON.parse(raw) as Partial<ExtendedFinanceState>

    return mergeFinanceState(parsed)
  } catch (error) {
    console.error("Failed to load finance state:", error)
    return createDefaultFinanceState()
  }
}

export function saveFinanceState(state: ExtendedFinanceState) {
  if (!isBrowser()) return

  try {
    window.localStorage.setItem(FINANCE_STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error("Failed to save finance state:", error)
  }
}

export function clearFinanceState() {
  if (!isBrowser()) return

  try {
    window.localStorage.removeItem(FINANCE_STORAGE_KEY)
  } catch (error) {
    console.error("Failed to clear finance state:", error)
  }
}

function normalizeForecastPeriod(
  value: unknown,
  fallback: ExtendedFinanceState["settings"]["forecastPeriod"],
): ExtendedFinanceState["settings"]["forecastPeriod"] {
  if (value === "3m" || value === "6m" || value === "1y") return value as ExtendedFinanceState["settings"]["forecastPeriod"]
  if (value === "3months") return "3m"
  if (value === "6months") return "6m"
  if (value === "12months" || value === "1year") return "1y"
  return fallback
}

function mergeFinanceState(partial: Partial<ExtendedFinanceState>): ExtendedFinanceState {
  const defaultState = createDefaultFinanceState()

  return {
    incomes: Array.isArray(partial.incomes) ? partial.incomes : defaultState.incomes,
    expenses: Array.isArray(partial.expenses) ? partial.expenses : defaultState.expenses,
    emotions: Array.isArray(partial.emotions) ? partial.emotions : defaultState.emotions,
    budgets: Array.isArray(partial.budgets) ? partial.budgets : defaultState.budgets,
    settings: {
      uxMode: partial.settings?.uxMode ?? defaultState.settings.uxMode,
      forecastPeriod: normalizeForecastPeriod(
        partial.settings?.forecastPeriod,
        defaultState.settings.forecastPeriod,
      ),
      budgetPeriod: partial.settings?.budgetPeriod ?? defaultState.settings.budgetPeriod,
      household: {
        familySize:
          partial.settings?.household?.familySize ?? defaultState.settings.household.familySize,
        housing: {
          type:
            partial.settings?.household?.housing?.type ??
            defaultState.settings.household.housing.type,
          monthlyRent:
            partial.settings?.household?.housing?.monthlyRent ??
            defaultState.settings.household.housing.monthlyRent,
          monthlyMortgage:
            partial.settings?.household?.housing?.monthlyMortgage ??
            defaultState.settings.household.housing.monthlyMortgage,
          monthlyManagementFee:
            partial.settings?.household?.housing?.monthlyManagementFee ??
            defaultState.settings.household.housing.monthlyManagementFee,
          monthlyRepairReserve:
            partial.settings?.household?.housing?.monthlyRepairReserve ??
            defaultState.settings.household.housing.monthlyRepairReserve,
          monthlyParkingFee:
            partial.settings?.household?.housing?.monthlyParkingFee ??
            defaultState.settings.household.housing.monthlyParkingFee,
        },
      },
      investmentUnlockCondition: {
        emergencyFundTargetMonths:
          partial.settings?.investmentUnlockCondition?.emergencyFundTargetMonths ??
          defaultState.settings.investmentUnlockCondition.emergencyFundTargetMonths,
        maxDeficitRate:
          partial.settings?.investmentUnlockCondition?.maxDeficitRate ??
          defaultState.settings.investmentUnlockCondition.maxDeficitRate,
        maxFixedCostRate:
          partial.settings?.investmentUnlockCondition?.maxFixedCostRate ??
          defaultState.settings.investmentUnlockCondition.maxFixedCostRate,
        minSavingsRate:
          partial.settings?.investmentUnlockCondition?.minSavingsRate ??
          defaultState.settings.investmentUnlockCondition.minSavingsRate,
      },
      bucketRules: Array.isArray(partial.settings?.bucketRules)
        ? partial.settings.bucketRules
        : defaultState.settings.bucketRules,
    },
    deficit:
      typeof partial.deficit === "number" && Number.isFinite(partial.deficit)
        ? partial.deficit
        : defaultState.deficit,
  }
}