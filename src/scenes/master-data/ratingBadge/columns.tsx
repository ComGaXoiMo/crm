import React from "react"
import { Button } from "antd"
import { EditOutlined, CheckOutlined } from "@ant-design/icons"
import { CloseOutlined } from "@ant-design/icons"
import AppConst from "@lib/appconst"
import SystemColumn from "@components/DataTable/columns"
import { L } from "@lib/abpUtility"
import { renderIsActive } from "@lib/helper"
const { align } = AppConst

export const getColumns = (onShowCreateOrUpdateModal, activateOrDeactivate) => [
  {
    title: L("RATING_BADGE_NAME"),
    dataIndex: "name",
    width: 200,
    ellipsis: false,
    render: (name, row) => (
      <>
        {name}
        <br />
        <small className="text-muted">{row.code}</small>
      </>
    ),
  },
  {
    title: L("RATING_BADGE_DESCRIPTION"),
    dataIndex: "description",
    width: 300,
    ellipsis: false,
    render: (description) => description,
  },
  {
    title: L("ACTIVE_STATUS"),
    dataIndex: "isActive",
    key: "isActive",
    width: 100,
    align: align.center,
    render: renderIsActive,
  },
  SystemColumn,
  {
    title: L("ACTION"),
    key: "action",
    fixed: align.right,
    align: align.right,
    width: 90,
    render: (text, item: any) => {
      return (
        <div>
          <Button
            size="small"
            className="ml-1"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => onShowCreateOrUpdateModal(item.id)}
          />

          <Button
            size="small"
            className="ml-1"
            shape="circle"
            icon={item.isActive ? <CloseOutlined /> : <CheckOutlined />}
            onClick={() => activateOrDeactivate([item.id], !item.isActive)}
          />
        </div>
      )
    },
  },
]
