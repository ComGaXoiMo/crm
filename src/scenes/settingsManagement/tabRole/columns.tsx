import SystemHistoryColumn from "@components/DataTable/sysyemColumn"
import { L } from "@lib/abpUtility"
// import AppConsts from "@lib/appconst";
import * as React from "react"
const columns = (actionColumn?) => {
  const data = [
    actionColumn,
    // {
    //   title: L("ST_ROLE_DISPLAY_NAME"),
    //   dataIndex: "displayName",
    //   key: "displayName",
    //   width: 150,
    //   render: (text: string) => <div>{text}</div>,
    // },
    {
      title: L("ROLE_DESCRIPTION"),
      dataIndex: "description",
      key: "description",
      width: 350,
      render: (description: string) => <div>{description}</div>,
    },
    // {
    //   title: L("ROLE_STATUS"),
    //   dataIndex: "status",
    //   align: align.center,
    //   key: "status",
    //   width: 250,
    //   render: (status: string) => status ?? renderIsActive(true),
    // },
    {
      title: L(""),
      dataIndex: "",
      key: "",
      width: "",
      render: () => <div>{}</div>,
    },
    SystemHistoryColumn,
  ]

  return data
}

export default columns
