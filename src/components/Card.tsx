import React from "react"

export default function Card(props: any) {
  return <div className="shadow-lg bg-white p-8">{props.children}</div>
}
