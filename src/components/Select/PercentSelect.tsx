import React, { useEffect, useRef, useState } from "react"
import { Select } from "antd"
import isEqual from "lodash/isEqual"
import { percentOptions } from "@lib/appconst"
const { Option } = Select

interface PercentSelectProps {
  value?: number;
  onChange?: (value) => void;
  mode?: "multiple" | "tags" | undefined;
}

const usePrevious = (value) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export const PercentSelect: React.FC<PercentSelectProps> = ({
  value,
  onChange,
  mode = undefined,
}) => {
  const previousValue = usePrevious(value)
  const [currentValue, setCurrentValue] = useState(value)

  // const firstUpdate = React.useRef(true);
  useEffect(() => {
    // if (firstUpdate.current) return;
    if (!isEqual(previousValue, value)) {
      setCurrentValue(value)
    }
  }, [value])

  const triggerChange = (value) => {
    setCurrentValue(value)
    if (onChange) {
      onChange(value)
    }
  }
  return (
    <Select
      getPopupContainer={(trigger) => trigger.parentNode}
      allowClear
      showArrow
      filterOption={false}
      mode={mode}
      style={{ width: "100%" }}
      value={currentValue}
      onChange={triggerChange}
    >
      {(percentOptions || []).map((item: any, index) => (
        <Option key={index} value={item.value}>
          {item.label}
        </Option>
      ))}
    </Select>
  )
}
