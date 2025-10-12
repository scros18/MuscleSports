"use client"

import * as React from "react"

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  onValueChange?: (val: string) => void
  children?: React.ReactNode
}

interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
  label?: React.ReactNode
}

export function RadioGroup({ value, onValueChange, children, ...props }: RadioGroupProps) {
  return (
    <div role="radiogroup" {...props}>
      {children}
    </div>
  )
}

export const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ value, label, className, ...props }, ref) => {
    return (
      <label className={`inline-flex items-center gap-2 ${className || ""}`}>
        <input
          ref={ref}
          type="radio"
          value={value}
          {...props}
          onChange={(e) => {
            props.onChange?.(e as any);
          }}
          className="form-radio h-4 w-4"
        />
        {label}
      </label>
    )
  }
)
RadioGroupItem.displayName = "RadioGroupItem"

export default RadioGroup
