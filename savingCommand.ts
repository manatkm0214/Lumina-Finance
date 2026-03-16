import { formatCurrency, formatPercent } from "@/lib/calc/basic"

export type SavingCommandLevel =
  | "success"
  | "caution"
  | "warning"
  | "danger"

export type SavingCommandAction =
  | "continue"
  | "reduceVariableSpending"
  | "freezeOptionalSpending"
  | "returnToEmergencyMode"

export type SavingCommandResult = {
  targetSavingAmount: number
  actualSavingAmount: number
  shortageAmount: number
  achievementRate: number
  level: SavingCommandLevel
  action: SavingCommandAction
  title: string
  message: string
  suggestions: string[]
}

export function evaluateSavingCommand(
  targetSavingAmount: number,
  actualSavingAmount: number
): SavingCommandResult {
  if (targetSavingAmount <= 0) {
    return {
      targetSavingAmount,
      actualSavingAmount,
      shortageAmount: 0,
      achievementRate: 0,
      level: "caution",
      action: "continue",
      title: "目標未設定",
      message: "先取り貯金の目標金額が未設定です。まずは毎月の目標を決めましょう。",
      suggestions: [
        "収入の10〜20%を目安に目標を設定する",
        "固定費支払い後でも続けられる金額にする",
      ],
    }
  }

  const achievementRate = actualSavingAmount / targetSavingAmount
  const shortageAmount = Math.max(targetSavingAmount - actualSavingAmount, 0)

  if (achievementRate >= 1) {
    return {
      targetSavingAmount,
      actualSavingAmount,
      shortageAmount,
      achievementRate,
      level: "success",
      action: "continue",
      title: "目標達成",
      message: `先取り貯金の目標を達成しました。今月の達成率は ${formatPercent(
        achievementRate
      )} です。このまま継続しましょう。`,
      suggestions: [
        "今の仕組みを固定化する",
        "余剰分は特別費や将来予備費へ回す",
      ],
    }
  }

  if (achievementRate >= 0.8) {
    return {
      targetSavingAmount,
      actualSavingAmount,
      shortageAmount,
      achievementRate,
      level: "caution",
      action: "reduceVariableSpending",
      title: "少し未達",
      message: `目標まで ${formatCurrency(
        shortageAmount
      )} 足りません。今月は変動費を少し絞って調整しましょう。`,
      suggestions: [
        "食費・娯楽費・雑費を見直す",
        "来月は月初に先取り額を先に移す",
      ],
    }
  }

  if (achievementRate >= 0.5) {
    return {
      targetSavingAmount,
      actualSavingAmount,
      shortageAmount,
      achievementRate,
      level: "warning",
      action: "freezeOptionalSpending",
      title: "目標未達",
      message: `達成率は ${formatPercent(
        achievementRate
      )} です。先取り貯金が崩れています。不要不急の支出を一時停止して立て直しましょう。`,
      suggestions: [
        "サブスク・推し活・外食の一時調整",
        "衝動買いカテゴリを重点確認する",
        "今月の残りは必須支出中心に切り替える",
      ],
    }
  }

  return {
    targetSavingAmount,
    actualSavingAmount,
    shortageAmount,
    achievementRate,
    level: "danger",
    action: "returnToEmergencyMode",
    title: "全力貯金へ再移行",
    message: `達成率は ${formatPercent(
      achievementRate
    )} です。先取り貯金を維持できていません。生活防衛資金の再構築を優先する段階です。`,
    suggestions: [
      "投資や自由費より安全資金を優先する",
      "固定費を再点検する",
      "先取り額を一時的に下げて再設計する",
    ],
  }
}

export function getSavingCommandStyle(level: SavingCommandLevel) {
  switch (level) {
    case "success":
      return "border-emerald-300 bg-emerald-50 text-emerald-700"
    case "caution":
      return "border-yellow-300 bg-yellow-50 text-yellow-700"
    case "warning":
      return "border-amber-300 bg-amber-50 text-amber-700"
    case "danger":
      return "border-rose-300 bg-rose-50 text-rose-700"
    default:
      return "border-slate-300 bg-slate-50 text-slate-700"
  }
}