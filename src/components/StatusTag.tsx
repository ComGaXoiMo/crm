import React from 'react'
import { Tag } from 'antd'

type StatusTagProps = {
  active?: boolean
  children?: any
}

export function StatusTag(props: StatusTagProps) {
  const { children, active, ...rest } = props
  return (
    <Tag
      color={active ? '#2db7f5' : '#f50'}
      {...rest}
      className="cell-round mr-0"
    >
      {children}
    </Tag>
  )
}
