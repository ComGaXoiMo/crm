import { L } from "@lib/abpUtility"
import * as React from "react"
import AppConst from "@lib/appconst"
import { inputCurrencyFormatter } from "@lib/helper"
const { align } = AppConst

const totalColumn = () => {
  const data = [
    {
      title: L("DEALER"),
      dataIndex: "user",
      key: "user",
      width: 150,
      ellipsis: false,
      render: (user) => <>{user?.displayName}</>,
    },
    {
      title: L("TOTAL_COMMISSION_AMOUNT_VND"),
      dataIndex: "amount",
      key: "amount",
      width: 200,
      align: align.right,
      ellipsis: false,
      render: (text) => <>{inputCurrencyFormatter(text)}</>,
    },
  ]

  return data
}

export default totalColumn
