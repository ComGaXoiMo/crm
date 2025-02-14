import React from "react"
import { Input } from "antd"
import "./underline.less"
import { SearchOutlined } from "@ant-design/icons"
interface FormSelectProps {
  onChange?: (value: any) => void
  onSearch?: () => void
  placeholder?: string
}

const FilterSearch: React.FC<FormSelectProps> = ({
  onChange,
  onSearch,
  placeholder,
}) => {
  return (
    <div className="filter-input">
      <Input
        addonBefore={<SearchOutlined />}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}

export default FilterSearch
