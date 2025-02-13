import React from 'react'
import { Form, Switch } from 'antd'
import { L } from '@lib/abpUtility'
import AppConsts from '@lib/appconst'

const { formVerticalLayout } = AppConsts
interface FormInputProps {
  label: string
  name: string
  rule?
}

const FormSwitch: React.FC<FormInputProps> = ({ label, name, rule }) => {
  return (
    <Form.Item label={L(label)} name={name} rules={rule} valuePropName="checked" {...formVerticalLayout}>
      <Switch />
    </Form.Item>
  )
}

export default FormSwitch
