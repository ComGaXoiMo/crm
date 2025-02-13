import React from 'react'
import { Status } from '@models/global'
import { Tooltip } from 'antd'
import Badge from 'antd/lib/badge'
import Tag from 'antd/lib/tag'
import { hexToRGB } from '@lib/helper'

interface ItemStatusProps {
  status: Status
}

const FormInput: React.FC<ItemStatusProps> = ({ status }) => {
  const backgroundColor = `rgba(${hexToRGB(status.colorCode)}, .05)`

  return (
    <Tooltip title={status.name}>
      <Tag className={'round'} style={{ background: backgroundColor, borderColor: backgroundColor }}>
        <Badge color={status.colorCode} className="badge-without-text mr-2" />
        <span style={{ color: status.colorCode }}>{status.name || status.code}</span>
      </Tag>
    </Tooltip>
  )
}

export default FormInput
