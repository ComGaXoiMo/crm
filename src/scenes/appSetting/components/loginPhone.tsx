import { PhoneOutlined } from "@ant-design/icons"
import { L } from "@lib/abpUtility"
import { Button } from "antd"
import React from "react"

interface Props {
  id?: any
}

const LoginPhone = (props: Props) => {
  return (
    <div className="w-100">
      <Button
        className="w-100 my-1 text-left"
        shape="round"
        icon={<PhoneOutlined className="mx-3" />}
      >
        {L("LOGIN_METHOD_PHONE")}
      </Button>
    </div>
  )
}

export default LoginPhone
