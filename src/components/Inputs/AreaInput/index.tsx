import React, { useEffect, useState } from "react"
import { InputNumber } from "antd"
import isEqual from "lodash/isEqual"
import {} from "@lib/helper"
import { usePrevious } from "@lib/appconst"

interface CurrencyInputInputProps {
  value?: number;
  onChange?: (value) => void;
  max?: number;
  min?: number;
  symbol?: string;
  locale?: string;
  disabled?: boolean;
  placeholder?: string;
}

const AreaInput: React.FC<CurrencyInputInputProps> = ({
  value,
  onChange,
  locale = "vi",
  symbol = "m2",
  min = 0,
  max,
  disabled = false,
  placeholder,
}) => {
  const previousValue = usePrevious(value)
  const [currencyValue, setCurrencyValue] = useState(value)

  useEffect(() => {
    if (!isEqual(previousValue, value)) {
      setCurrencyValue(value)
    }
  }, [value])

  const triggerChange = () => {
    if (onChange) {
      onChange(currencyValue)
    }
  }

  const onTextChange = (e) => {
    setCurrencyValue(e)
  }

  return (
    <InputNumber
      className="full-width"
      value={currencyValue}
      onChange={onTextChange}
      onBlur={triggerChange}
      disabled={disabled}
      placeholder={placeholder}
      // size="large"
      min={min}
      max={max}
    />
  )
}

export default AreaInput
