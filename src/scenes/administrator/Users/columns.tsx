import { L } from "@lib/abpUtility"
import * as React from "react"
import AppConst from "@lib/appconst"
import { renderIsActive } from "@lib/helper"
const { align } = AppConst

const columns = (actionColumn?) => {
  const data = [
    {
      title: L("USER_NAME"),
      dataIndex: "userName",
      key: "userName",
      width: 150,
      ellipsis: false,
      render: (text: string) => <>{text}</>,
    },
    {
      title: L("FULL_NAME"),
      dataIndex: "displayName",
      key: "displayName",
      width: 200,
      ellipsis: false,
      render: (text: string) => <>{text}</>,
    },
    {
      title: L("EMAIL_ADDRESS"),
      dataIndex: "emailAddress",
      key: "emailAddress",
      width: 250,
      ellipsis: false,
      render: (text: string) => <>{text}</>,
    },
    {
      title: L("ACTIVE_STATUS"),
      dataIndex: "isActive",
      key: "isActive",
      width: 150,
      align: align.center,
      render: renderIsActive,
    },
  ]

  if (actionColumn) {
    data.push(actionColumn)
  }

  return data
}

export default columns
