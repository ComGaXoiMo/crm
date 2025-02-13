import React from "react"
import { Form, Input } from "antd"
import { L } from "@lib/abpUtility"
import AppConsts from "@lib/appconst"

const { formVerticalLayout } = AppConsts
interface FormInputProps {
  label: string;
  name: string | string[];
  rule?;
  disabled?: boolean;
  onChange?: any;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  rule,
  disabled,
  onChange,
}) => {
  return (
    <Form.Item
      label={L(label)}
      name={name}
      rules={rule}
      {...formVerticalLayout}
    >
      <Input disabled={disabled} onChange={onChange} />
    </Form.Item>
  )
}

export default FormInput
