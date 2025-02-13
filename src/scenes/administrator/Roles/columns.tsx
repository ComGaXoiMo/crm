import {L} from "@lib/abpUtility"
import * as React from "react"

const columns = (actionColumn?) => {
  const data = [
    {
      title: L('ST_ROLE_UNIQUE_NAME'),
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text: string) => <div>{text}</div>
    },
    {
      title: L('ST_ROLE_DISPLAY_NAME'),
      dataIndex: 'displayName',
      key: 'displayName',
      width: 150,
      render: (text: string) => <div>{text}</div>
    }
  ]

  if (actionColumn) {
    data.push(actionColumn)
  }

  return data
}

export default columns
