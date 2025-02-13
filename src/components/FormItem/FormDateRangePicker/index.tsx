import React from 'react'
import { DatePicker, Form } from 'antd'
import { L } from '@lib/abpUtility'
import AppConsts, { dateFormat } from '@lib/appconst'
import { RangePickerProps } from 'antd/lib/date-picker/generatePicker'
import moment from 'moment-timezone/moment-timezone'

const { formVerticalLayout } = AppConsts
interface FormDatePickerProps {
  label: string
  name: string | string[]
  rule?
  disabled?: boolean
  placeholder?: [string, string] | undefined
  dateTimeFormat?: string
  dateTimeProps?: RangePickerProps<moment>
}

const FormDateRangePicker: React.FC<FormDatePickerProps> = ({
  label,
  name,
  rule,
  disabled,
  placeholder,
  dateTimeFormat = dateFormat,
  dateTimeProps
}) => {
  return (
    <Form.Item label={L(label)} name={name} rules={rule} {...formVerticalLayout}>
      <DatePicker.RangePicker
        className="full-width"
        format={dateTimeFormat}
        disabled={disabled}
        {...dateTimeProps}
      />
    </Form.Item>
  )
}

export default FormDateRangePicker
