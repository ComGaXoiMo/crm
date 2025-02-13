import { hexToRGB } from "@lib/helper"
import { Card } from "antd"
import React from "react"

type Props = {
  data: any[]
  handleClickItem?: (item) => void
}
export const randomLightColor = () => {
  const colorPool = [
    "#24474b",
    "#8c644d",
    "#3b2219",
    "#7f1919",
    "#0c1e2b",
    "#04293A",
    "#461111",
    "#3D0000",
    "#3E2C41",
    "#5C3D2E",
    "#2C394B",
    "#E2703A",
    "#03506F",
    "#734046",
    "#133B5C",
    "#ED5107",
  ]
  return colorPool[Math.floor(Math.random() * colorPool.length)]
}
const OverViewBar = (props: Props) => {
  return (
    <div className="d-flex flex-wrap justify-content-around align-items-center mb-3 w-100">
      {props.data.map((item, index) => {
        const color = item.color ?? randomLightColor()
        const backgroundColor = `rgba(${hexToRGB(color)}, .05)`
        const descriptionColor = `rgba(${hexToRGB(color)}, .95)`
        return (
          <Card
            bordered={false}
            key={index}
            style={{
              backgroundColor: backgroundColor,
              color: descriptionColor,
              minWidth: 120,
              marginBottom: 8,
              borderRadius: 12,
              cursor: "pointer",
            }}
            onClick={() => {
              item.filter &&
                props.handleClickItem &&
                props.handleClickItem(item.filter)
            }}
          >
            {/* <div className="d-flex justify-content-between align-items-baseline"> */}
            <div style={{ fontSize: "16px", fontWeight: 700 }}>
              {item.count || item.primaryCount}
            </div>
            <div style={{ fontSize: "12px" }}>{item.name || item.title}</div>
            {/* </div> */}
          </Card>
        )
      })}
      <style>{`
      .ant-card-body {
        padding-top: 6px !important;
        padding-bottom: 6px !important;

      }
      `}</style>
    </div>
  )
}

export default OverViewBar
