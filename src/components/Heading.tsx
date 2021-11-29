import React from "react"

type HeadingTags = "h1" | "h2" | "h3" | "h4" | "h5" | "span"

type HeadingProps = {
  as: HeadingTags
  asStyle?: HeadingTags
  variant: "default" | "primary" | "secondary" | "accent"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any // TODO fix this type
}

const defaultHeadingClasses = "font-bold"
const tagClasses: Record<HeadingTags, string> = {
  h1: "text-3xl",
  h2: "text-2xl",
  h3: "text-xl",
  h4: "text-md",
  h5: "text-sm",
  span: "",
}

export default function Heading(props: HeadingProps) {
  const tagStyle: HeadingTags = props.asStyle || props.as
  const classNames = [defaultHeadingClasses, tagClasses[tagStyle]].join(" ")

  return React.createElement(
    props.as,
    { className: classNames },
    props.children
  )
}

Heading.defaultProps = {
  variant: "default",
}
