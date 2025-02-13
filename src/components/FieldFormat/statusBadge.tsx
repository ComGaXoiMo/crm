import * as React from "react"
import {BorderOutlined} from "@ant-design/icons/lib"
import {Badge} from "antd"

type Props = {
  value: boolean,
  labelTrue?: string,
  labelFalse?: string,
  useIcon?: boolean
}
StatusBadge.defaultProps = {
  labelTrue: 'Active',
  labelFalse: 'Inactive',
  useIcon: false
}

export function StatusBadge({ value, useIcon, labelTrue, labelFalse }: Props) {
  if (useIcon) {
    if (value) return <BorderOutlined className="mr-2 text-success" />
    return <BorderOutlined className="mr-2 text-danger" />
  }
  if (value) return <Badge color="green">{labelTrue}</Badge>
  return <Badge color="red">{labelFalse}</Badge>
}
