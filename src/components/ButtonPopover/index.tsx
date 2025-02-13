import React from 'react'
import { Popover, Button } from 'antd'
interface Props {
  text: string
  content: any
}

const ButtonPopover = (props: Props) => {
  const [visible, setVisible] = React.useState(false)

  return (
    <Popover
      content={props.content}
      placement="bottom"
      trigger="click"
      visible={visible}
      onVisibleChange={(e) => setVisible(e)}
    >
      <Button type="primary">{props.text}</Button>
    </Popover>
  )
}

export default ButtonPopover
