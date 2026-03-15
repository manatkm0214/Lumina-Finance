import type {
  AccountType,
  CostType,
  ExpenseCategory,
  ExpenseSubCategory,
  IncomeCategory,
  NecessityLevel,
  PaymentMethod,
  SelectOption,
  SavingsRecordType,
} from "@/types/finance"

export const incomeCategoryOptions: SelectOption<IncomeCategory>[] = [
  { value: "salary", label: "給与" },
  { value: "bonus", label: "ボーナス" },
  { value: "sideJob", label: "副業" },
  { value: "allowance", label: "おこづかい" },
  { value: "pension", label: "年金" },
  { value: "other", label: "その他" },
]

export const expenseCategoryOptions: SelectOption<ExpenseCategory>[] = [
  { value: "food", label: "食費" },
  { value: "daily", label: "日用品" },
  { value: "housing", label: "住居費" },
  { value: "utility", label: "水道光熱費" },
  { value: "communication", label: "通信費" },
  { value: "transport", label: "交通費" },
  { value: "medical", label: "医療費" },
  { value: "education", label: "教育費" },
  { value: "entertainment", label: "娯楽費" },
  { value: "beautyClothing", label: "美容・衣服" },
  { value: "insurance", label: "保険" },
  { value: "tax", label: "税金" },
  { value: "other", label: "その他" },
]

export const expenseSubCategories: Record<
  ExpenseCategory,
  SelectOption<ExpenseSubCategory>[]
> = {
  food: [
    { value: "homeCooking", label: "自炊" },
    { value: "eatingOut", label: "外食" },
    { value: "cafe", label: "カフェ" },
    { value: "groceries", label: "食材" },
  ],
  daily: [
    { value: "detergent", label: "洗剤・消耗品" },
    { value: "misc", label: "その他日用品" },
  ],
  housing: [
    { value: "rent", label: "家賃" },
    { value: "mortgage", label: "住宅ローン" },
    { value: "managementFee", label: "管理費" },
    { value: "repairReserve", label: "修繕積立金" },
    { value: "parking", label: "駐車場" },
    { value: "furniture", label: "家具" },
    { value: "appliances", label: "家電" },
    { value: "moving", label: "引っ越し" },
    { value: "other", label: "その他" },
  ],
  utility: [
    { value: "electricity", label: "電気" },
    { value: "gas", label: "ガス" },
    { value: "water", label: "水道" },
  ],
  communication: [
    { value: "mobile", label: "携帯" },
    { value: "internet", label: "ネット" },
  ],
  transport: [
    { value: "train", label: "電車" },
    { value: "bus", label: "バス" },
    { value: "misc", label: "その他交通費" },
  ],
  medical: [
    { value: "hospital", label: "病院" },
    { value: "medicine", label: "薬" },
  ],
  education: [
    { value: "books", label: "本・教材" },
    { value: "tuition", label: "学費" },
    { value: "misc", label: "その他教育費" },
  ],
  entertainment: [
    { value: "movie", label: "映画・遊び" },
    { value: "misc", label: "その他娯楽" },
  ],
  beautyClothing: [
    { value: "cosmetics", label: "化粧品" },
    { value: "tops", label: "服飾" },
    { value: "misc", label: "その他美容・衣服" },
  ],
  insurance: [
    { value: "lifeInsurance", label: "生命保険" },
    { value: "misc", label: "その他保険" },
  ],
  tax: [
    { value: "residentTax", label: "住民税" },
    { value: "misc", label: "その他税金" },
  ],
  other: [{ value: "misc", label: "その他" }],
}

export const paymentMethodOptions: SelectOption<PaymentMethod>[] = [
  { value: "cash", label: "現金" },
  { value: "debitCard", label: "デビットカード" },
  { value: "creditCard", label: "クレジットカード" },
  { value: "bankTransfer", label: "銀行振込" },
  { value: "mobilePay", label: "モバイル決済" },
  { value: "points", label: "ポイント" },
]

export const accountOptions: SelectOption<AccountType>[] = [
  { value: "cash", label: "財布" },
  { value: "mainBank", label: "メイン口座" },
  { value: "subBank", label: "サブ口座" },
  { value: "credit", label: "クレカ引落" },
  { value: "eMoney", label: "電子マネー" },
]

export const costTypeOptions: SelectOption<CostType>[] = [
  { value: "monthly", label: "毎月" },
  { value: "yearly", label: "年次" },
  { value: "temporary", label: "一時" },
]

export const necessityOptions: SelectOption<NecessityLevel>[] = [
  { value: "need", label: "必要" },
  { value: "want", label: "欲しい" },
  { value: "impulse", label: "衝動" },
]

export const paymentMethodLabelMap: Record<PaymentMethod, string> = {
  cash: "現金",
  debitCard: "デビットカード",
  creditCard: "クレジットカード",
  bankTransfer: "銀行振込",
  mobilePay: "モバイル決済",
  points: "ポイント",
}

export const accountLabelMap: Record<AccountType, string> = {
  cash: "財布",
  mainBank: "メイン口座",
  subBank: "サブ口座",
  credit: "クレカ引落",
  eMoney: "電子マネー",
}

export const costTypeLabelMap: Record<CostType, string> = {
  monthly: "毎月",
  yearly: "年次",
  temporary: "一時",
}

export const necessityLabelMap: Record<NecessityLevel, string> = {
  need: "必要",
  want: "欲しい",
  impulse: "衝動",
}

export const savingsRecordTypeOptions: SelectOption<SavingsRecordType>[] = [
  { value: "regularSavings", label: "通常貯金" },
  { value: "fixedDeposit", label: "定期預金" },
  { value: "ordinaryDeposit", label: "普通預金" },
  { value: "investmentProfit", label: "投資利益" },
]