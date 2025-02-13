import {L} from "@lib/abpUtility"
import * as React from "react"
import { Tag } from 'antd'

const columns = (actionColumn?) => {
  const data = [
    {
      title: L('LANGUAGE_FLAG'),
      dataIndex: 'icon',
      key: 'icon',
      width: 150,
      render: (text: string) => (
        <div>
          <i className={text} />
        </div>
      )
    },
    {
      title: L('LANGUAGE_NAME'),
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text: string) => <div>{text}</div>
    },
    {
      title: L('LANGUAGE_DISPLAY_NAME'),
      dataIndex: 'displayName',
      key: 'displayName',
      width: 150,
      render: (text: string) => <div>{text}</div>
    },
    {
      title: L('LANGUAGE_IS_DISABLED'),
      dataIndex: 'isDisabled',
      key: 'isDisabled',
      width: 150,
      render: (text: boolean) =>
        text === true ? <Tag color="#2db7f5">{L('Yes')}</Tag> : <Tag color="red">{L('No')}</Tag>
    }
  ]

  if (actionColumn) {
    data.push(actionColumn)
  }

  return data
}

export default columns
