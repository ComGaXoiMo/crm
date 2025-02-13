import React from "react"
import { Form, Select } from "antd"
import { L } from "@lib/abpUtility"
import AppConsts from "@lib/appconst"
import { SelectProps, SelectValue } from "antd/lib/select"
import { renderOptions } from "@lib/helper"
import { OptionModel } from "@models/global"

const { formVerticalLayout } = AppConsts
interface FormSelectProps {
  label?: string
  name: string | (string | number)[]
  rule?
  options: OptionModel[]
  selectProps?: SelectProps<SelectValue>
  disabled?: boolean
  onChange?: (value: any, options: any | Array<any>) => void
  optionModal?: (item: any, index: any) => void
  formItemClass?: string
  placeholder?: string
  defaultValue?: any
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  rule,
  options,
  selectProps,
  disabled = false,
  onChange,
  optionModal,
  formItemClass,
  placeholder,
  defaultValue,
}) => {
  return (
    <Form.Item
      label={label ? L(label) : undefined}
      name={name}
      rules={rule}
      className={formItemClass}
      {...formVerticalLayout}
      initialValue={defaultValue}
    >
      <Select
        getPopupContainer={(trigger) => trigger.parentNode}
        showSearch
        showArrow
        defaultValue={defaultValue}
        allowClear
        filterOption={false}
        className="w-100"
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        {...selectProps}
      >
        {optionModal
          ? (options || []).map((item, index) => optionModal(item, index))
          : renderOptions(options)}
      </Select>
    </Form.Item>
  )
}

export default FormSelect
