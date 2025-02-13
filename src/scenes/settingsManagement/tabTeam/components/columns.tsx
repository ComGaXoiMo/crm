import { L } from "@lib/abpUtility"
import * as React from "react"
import AppConsts from "@lib/appconst"
import { renderDateTime } from "@lib/helper"
const { align } = AppConsts
const columns = (actionColumn?) => {
  const data = [
    actionColumn,

    // {
    //   title: L("CODE"),
    //   dataIndex: "code",
    //   key: "code",
    //   align: align.center,
    //   width: "20%",
    //   render: (code) => <div>{code}</div>,
    // },
    {
      title: L("NUMBER_STAFF"),
      dataIndex: "memberCount",
      key: "memberCount",
      align: align.right,
      width: "20%",
      render: (memberCount) => <div>{memberCount}</div>,
    },
    {
      title: L("CREATE_TIME"),
      dataIndex: "creationTime",
      key: "creationTime",
      align: align.center,
      width: "",
      render: (creationTime) => <div>{renderDateTime(creationTime)}</div>,
    },
  ]

  return data
}

export default columns
