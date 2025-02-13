import { L } from "@lib/abpUtility"
import * as React from "react"

const Columns = (actionColumn?) => {
  const data = [
    actionColumn,

    {
      title: L("NUM_DAY"),
      dataIndex: "date",
      key: "date",
      width: "",
      render: (date: string) => <div>{date ?? "None"}</div>,
    },
  ]

  return data
}

export default Columns
