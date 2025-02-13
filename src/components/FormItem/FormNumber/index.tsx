import React from "react"
import { Form } from "antd"
import { L } from "@lib/abpUtility"
import AppConsts from "@lib/appconst"
import NumberInput from "@components/Inputs/NumberInput"

const { formVerticalLayout } = AppConsts
interface FormNumberProps {
  label: string;
  name: string | string[];
  rule?;
  suffix?: string;
  min?: number;
  disabled?: boolean;
}

const FormNumber: React.FC<FormNumberProps> = ({
  label,
  name,
  rule,
  suffix,
  min,
  disabled,
}) => {
  return (
    <Form.Item
      label={L(label)}
      name={name}
      rules={rule}
      {...formVerticalLayout}
    >
      <NumberInput disabled={disabled} suffix={suffix} min={min} />
    </Form.Item>
  )
}

export default FormNumber
