import React from "react"
import { Input } from "antd"
import "./underline.less"
import { SearchOutlined } from "@ant-design/icons"
interface FormSelectProps {
  onChange?: (value: any) => void
  onSearch?: () => void
  placeholder?: string
}

const HeaderSearchInput: React.FC<FormSelectProps> = ({
  onChange,
  onSearch,
  placeholder,
}) => {
  return (
    <div className="header-input">
      <Input
        size="large"
        addonBefore={<SearchOutlined />}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}

export default HeaderSearchInput
