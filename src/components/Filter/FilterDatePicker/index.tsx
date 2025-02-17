import React from "react"
import { DatePicker } from "antd"

import "./underline.less"
import { dateFormat } from "@lib/appconst"
interface FormSelectProps {
  disabled?: boolean
  onChange?: (value: any, options: any | Array<any>) => void
  placeholder?: any
}

const FilterDatePicker: React.FC<FormSelectProps> = ({
  disabled = false,
  onChange,
  placeholder,
}) => {
  return (
    <div className="filter-input">
      <DatePicker
        format={dateFormat}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-100 underline-picker"
      />
    </div>
  )
}

export default FilterDatePicker
