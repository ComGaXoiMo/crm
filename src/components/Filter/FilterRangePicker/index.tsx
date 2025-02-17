import React from "react"
import { DatePicker } from "antd"

import "./underline.less"
import { dateFormat, rangePickerPlaceholder } from "@lib/appconst"
interface FormSelectProps {
  disabled?: boolean
  onChange?: (value: any, options: any | Array<any>) => void
}

const FilterRangePicker: React.FC<FormSelectProps> = ({
  disabled = false,
  onChange,
}) => {
  return (
    <div className="filter-input">
      <DatePicker.RangePicker
        format={dateFormat}
        onChange={onChange}
        // onChange={(value) => this.handleSearch('dateFromTo', value)}
        placeholder={rangePickerPlaceholder()}
        disabled={disabled}
        className="w-100 underline-picker"
      />
    </div>
  )
}

export default FilterRangePicker
