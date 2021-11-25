import React, { ReactChildren, ReactChild } from "react"

export type ChildType = ReactChildren | ReactChild

type ButtonVariant = "primary" | "secondary"
type ButtonType = {
  children?: ChildType
  className?: string
  variant?: ButtonVariant
  onClick?: () => void
}

export default function Button({
  children,
  className = "",
  variant = "primary",
  onClick = () => {},
}: ButtonType) {
  const buttonClasses = []

  const buttonBaseClasses = "font-bold text-lg hover:bg-gray-700 py-3 px-8 mt-8"
  buttonClasses.push(buttonBaseClasses)

  const buttonVariantClasses = {
    primary: "bg-purple-800 text-white",
    secondary: "bg-black text-white",
  }
  buttonClasses.push(buttonVariantClasses[variant])
  if (className) {
    buttonClasses.push(className)
  }

  return (
    <button
      value="Log In"
      className={buttonClasses.join(" ")}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
