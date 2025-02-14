import React from "react"
import { Select } from "antd"
import { SelectProps, SelectValue } from "antd/lib/select"
import { filterOptions, renderOptions } from "@lib/helper"
import { OptionModel } from "@models/global"
import "./underline.less"
interface FormSelectProps {
  options: OptionModel[]
  selectProps?: SelectProps<SelectValue>
  disabled?: boolean
  onChange?: (value: any, options: any | Array<any>) => void
  onSearch?: (value: any) => void
  optionModal?: (item: any, index: any) => void
  placeholder?: string
  defaultValue?: any
}

const FilterSelect: React.FC<FormSelectProps> = ({
  options,
  selectProps,
  disabled = false,
  onChange,
  onSearch,
  optionModal,
  placeholder,
  defaultValue,
}) => {
  return (
    <div className="filter-input">
      <Select
        getPopupContainer={(trigger) => trigger.parentNode}
        showSearch
        defaultValue={defaultValue}
        allowClear
        filterOption={filterOptions}
        className="w-100 underline-select"
        onChange={onChange}
        onSearch={onSearch}
        disabled={disabled}
        placeholder={placeholder}
        {...selectProps}
      >
        {optionModal
          ? (options || []).map((item, index) => optionModal(item, index))
          : renderOptions(options)}
      </Select>
    </div>
  )
}

export default FilterSelect
