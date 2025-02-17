import React from "react"
import { hexToRGB } from "@lib/helper"

interface ItemStatusProps {
  color: string
}

const ItemStatus: React.FC<ItemStatusProps> = ({ color }) => {
  const backgroundColor = `rgba(${hexToRGB(color)}, .2)`
  const borderColor = `rgba(${hexToRGB(color)}, 1)`

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        width: "fit-content",
      }}
    >
      <span
        style={{
          width: "0.5rem",
          height: "0.5rem",
          borderRadius: "50%",
          backgroundColor,
          border: `1px solid ${borderColor}`,
        }}
      ></span>
    </div>
  )
}

export default ItemStatus
