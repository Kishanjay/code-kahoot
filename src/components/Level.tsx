import React from "react"

export default function Level(props: any) {
  const children = props.children

  return <div className="flex justify-between">{children}</div>
}
