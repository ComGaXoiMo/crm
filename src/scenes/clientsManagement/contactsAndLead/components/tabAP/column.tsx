import { L } from "@lib/abpUtility"
import { renderDateTime } from "@lib/helper"

const columns = (actionColumn?) => {
  const data = [
    actionColumn,
    {
      title: L("SHARE_DATE"),
      dataIndex: "creationTime",
      key: "creationTime",
      width: 250,

      ellipsis: false,
      render: renderDateTime,
    },
    {
      title: L("REQUEST_NOTE"),
      dataIndex: "requestNote",
      key: "requestNote",
      ellipsis: false,
      render: (requestNote) => <>{requestNote ?? ""}</>,
    },
  ]

  return data
}

export default columns
