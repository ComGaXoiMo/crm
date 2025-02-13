import React, { useEffect, useState } from "react"
import { InputNumber } from "antd"
import isEqual from "lodash/isEqual"
import { inputCurrencyFormatter, inputCurrencyParse } from "@lib/helper"
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

const CurrencyInput: React.FC<CurrencyInputInputProps> = ({
  value,
  onChange,
  locale = "vi",
  symbol = "đ",
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
      formatter={(value) => inputCurrencyFormatter(value, locale, symbol)}
      parser={(value) => inputCurrencyParse(value, locale, symbol)}
      onBlur={triggerChange}
      disabled={disabled}
      placeholder={placeholder}
      // size="large"
      min={min}
      maxLength={18}
      max={max}
    />
  )
}

export default CurrencyInput
