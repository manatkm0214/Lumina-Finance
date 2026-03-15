"use client"

import type { ChangeEvent } from "react"
import type { SelectOption } from "@/types/finance"

type SelectFieldProps<T extends string> = {
  label: string
  value: T
  onChangeAction: ((value: T) => void) 
  options: SelectOption<T>[]
  placeholder?: string
  name?: string
  id?: string
  disabled?: boolean
  required?: boolean
  error?: string
  className?: string
}

export function SelectField<T extends string>({
  label,
  value,
  onChangeAction,
  options,
  placeholder = "選択してください",
  name,
  id,
  disabled = false,
  required = false,
  error,
  className = "",
}: SelectFieldProps<T>) {
  const selectId = id ?? name ?? `select-${label}`

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChangeAction(event.target.value as T)
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label
        htmlFor={selectId}
        className="text-sm font-medium text-slate-700"
      >
        {label}
        {required ? <span className="ml-1 text-rose-500">*</span> : null}
      </label>

      <select
        id={selectId}
        name={name}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${selectId}-error` : undefined}
        className={[
          "w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none transition",
          "border-slate-300",
          "focus:border-sky-500 focus:ring-2 focus:ring-sky-200",
          "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400",
          error ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200" : "",
        ].join(" ")}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error ? (
        <p
          id={`${selectId}-error`}
          className="text-sm text-rose-500"
        >
          {error}
        </p>
      ) : null}
    </div>
  )
}