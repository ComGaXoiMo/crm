import * as React from "react"
import { Card } from "antd"

export interface IDataTableProps {
  renderActions: any
  closeCollapse?: boolean
  children?: any
}

const WrapPageScroll: React.FunctionComponent<IDataTableProps> = ({
  renderActions,
  ...props
}) => {
  return (
    <>
      <div
        style={{
          paddingBottom: "68px",
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {props.children}
      </div>
      <div className="wrap-page-footer text-right">
        <Card bordered={false}>{renderActions()}</Card>
      </div>
    </>
  )
}

export default WrapPageScroll
