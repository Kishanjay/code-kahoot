import React, { ReactChildren, ReactChild } from "react"

// TODO put in a global type declaration?
export type ChildType = ReactChildren | ReactChild | ChildType[]

type ButtonVariant = "primary" | "secondary" | "accent"
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
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClick = () => {},
}: ButtonType) {
  const buttonClasses = []

  const buttonBaseClasses = "font-bold text-lg hover:bg-gray-700 py-3 px-8"
  buttonClasses.push(buttonBaseClasses)

  const buttonVariantClasses = {
    primary: "bg-purple-800 text-white",
    secondary: "bg-black text-white",
    accent: "bg-yellow-600 text-white",
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
