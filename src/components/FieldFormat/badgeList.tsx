import * as React from "react"
import { Tag } from "antd"

type Props = {
  items: any[]
  color?: "red" | "orange" | "gold" | "green" | "purple"
}
FacilitiesList.defaultProps = {
  items: [],
  color: "#2db7f5",
}

export default function FacilitiesList({ items, color }: Props) {
  return (
    <>
      {items.map((item: any, index) => (
        <Tag className="cell-round mr-1" color={color} key={index}>
          {item.name}
        </Tag>
      ))}
    </>
  )
}
