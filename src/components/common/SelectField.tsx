"use client"

import type { SelectOption } from "@/types/finance"

export type SelectFieldProps<T extends string = string> = {
  label: string
  value: T
  options: SelectOption<T>[]
  onChangeAction?: (value: T) => void
}

export function SelectField<T extends string = string>({
  label,
  value,
  options,
  onChangeAction,
}: SelectFieldProps<T>) {
  return (
    <label className="block space-y-1">
      <span className="text-sm text-slate-600">{label}</span>
      <select
        value={value}
        onChange={(e) => onChangeAction?.(e.target.value as T)}
        className="w-full rounded border border-slate-300 px-3 py-2"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}