import React from "react"
import { DatePicker, Form } from "antd"
import { L } from "@lib/abpUtility"
import AppConsts, { dateFormat } from "@lib/appconst"
const { formVerticalLayout } = AppConsts
interface FormDatePickerProps {
  label: string
  name: string | string[]
  rule?
  disabled?: boolean
  onChange?: any
  onSelect?: any
  placeholder?: string
  dateTimeFormat?: string
  disabledDate?: any
  className?: any
}

const FormDatePicker: React.FC<FormDatePickerProps> = ({
  label,
  name,
  rule,
  disabled,
  onChange,
  onSelect,
  placeholder,
  dateTimeFormat = dateFormat,
  disabledDate,
  className,
}) => {
  return (
    <Form.Item
      label={L(label)}
      name={name}
      rules={rule}
      className={`${className}`}
      {...formVerticalLayout}
    >
      <DatePicker
        className={`full-width`}
        format={dateTimeFormat}
        placeholder={placeholder ? L(placeholder) : ""}
        disabled={disabled}
        disabledDate={disabledDate}
        onChange={onChange}
      />
    </Form.Item>
  )
}

export default FormDatePicker
