import React, { useEffect, useState } from "react"
import { Form, Select } from "antd"
import { L } from "@lib/abpUtility"
import AppConsts from "@lib/appconst"
import { SelectProps, SelectValue } from "antd/lib/select"
import { debounce } from "lodash"
import companyService from "@services/clientManagement/companyService"

const { formVerticalLayout } = AppConsts
interface FormSelectProps {
  label?: string;
  name: string | (string | number)[];
  rule?;
  selectProps?: SelectProps<SelectValue>;
  disabled?: boolean;
  onChange: (value: any) => void;
  optionModal?: (item: any, index: any) => void;
  formItemClass?: string;
  placeholder?: string;
  defaultValue?: any;
}

const SelectCompany: React.FC<FormSelectProps> = ({
  label,
  name,
  rule,
  selectProps,
  disabled = false,
  onChange,
  optionModal,
  formItemClass,
  placeholder,
  defaultValue,
}) => {
  const [options, setOptions] = useState([] as any)
  useEffect(() => {
    findCompanies("")
  }, [])
  const findCompanies = debounce(async (keyword) => {
    const result = await companyService.getAll({
      keyword,
      pageSize: 10,
    })
    setOptions(result.items || [])
  }, 200)
  //   const triggerChange = (value) => {
  //     if (onChange) {
  //       onChange(value);
  //     }
  //   };
  const onCompanyChange = (value: any) => {
    onChange(value)
  }
  return (
    <Form.Item
      label={label ? L(label) : undefined}
      name={name}
      rules={rule}
      className={formItemClass}
      {...formVerticalLayout}
      // initialValue={defaultValue}
    >
      <Select
        getPopupContainer={(trigger) => trigger.parentNode}
        showSearch
        showArrow
        defaultValue={defaultValue}
        filterOption={false}
        className="w-100"
        onChange={(value, label) => onCompanyChange(value)}
        disabled={disabled}
        onSearch={(text) => findCompanies(text)}
        placeholder={placeholder}
        {...selectProps}
      >
        {(options || []).map((option: any, index) => (
          <Select.Option key={index} value={option.id}>
            {option.businessName}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  )
}

export default SelectCompany
