import React from 'react'
import { Form } from 'antd'
import { L } from '@lib/abpUtility'
import AppConsts from '@lib/appconst'
import { OptionModel } from '@models/global'
import SelectBoxItems from '@components/FormItem/FormSelectBox/SelectBoxItems'


const { formVerticalLayout } = AppConsts
interface FormSelectProps {
  label: string
  name: string
  rule?
  value?
  options: OptionModel[]
  disabled?: boolean
  onChange?: (value) => void
}

const FormSelectBox: React.FC<FormSelectProps> = ({ label, name, rule, options, value, disabled = false, onChange }) => {
  return (
    <Form.Item label={L(label)} name={name} rules={rule} {...formVerticalLayout}>
      <SelectBoxItems value={value} options={options} onChange={onChange}/>
    </Form.Item>
  )
}

export default FormSelectBox
