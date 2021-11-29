import React from "react"

type InputProps = {
  type: "text" | "email" | "password"
  label: string
  placeholder: string
  onChange: (val: string) => void
  value?: string
}

export default function Input({
  type,
  label,
  placeholder,
  value,
  onChange,
}: InputProps) {
  return (
    <label className="text-lg block">
      {label}
      <input
        value={value}
        onChange={(ev) => onChange(ev.target.value)}
        type={type}
        placeholder={placeholder}
        className="block shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </label>
  )
}

Input.defaultProps = {
  type: "text",
  label: "",
  placeholder: "",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: () => {},
}
