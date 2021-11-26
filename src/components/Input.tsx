import React from "react"

type InputProps = {
  type: "text" | "email" | "password"
  label: string
  placeholder: string
}

export default function Input({ type, label, placeholder }: InputProps) {
  return (
    <label className="text-lg block">
      {label}
      <input
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
}
