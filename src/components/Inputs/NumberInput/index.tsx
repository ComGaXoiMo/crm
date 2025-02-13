import React, { useEffect, useState } from "react"
import Col from "antd/lib/grid/col"
import Row from "antd/lib/grid/row"
import { InputNumber } from "antd"
import { usePrevious } from "@lib/appconst"
import isEqual from "lodash/isEqual"
import { inputNumberFormatter, inputNumberParse } from "@lib/helper"
import debounce from "lodash/debounce"

interface NumberInputProps {
  value?: number;
  onChange?: (value) => void;
  onBlur?: (value) => void;
  suffix?: React.ReactNode;
  max?: number;
  min?: number;
  locale?: string;
  disabled?: boolean;
  placeholder?: string;
  small?: boolean;
}

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  onBlur,
  suffix,
  locale = "vi",
  disabled,
  min,
  max,
  placeholder,
  small,
}) => {
  const previousValue = usePrevious(value)
  const [currencyValue, setNumberValue] = useState(value)

  useEffect(() => {
    if (!isEqual(previousValue, value)) {
      setNumberValue(value)
    }
  }, [value])

  const triggerChange = () => {
    if (onChange) {
      onChange(currencyValue)
    }
  }

  const onTextChange = debounce((e) => {
    setNumberValue(e)
  }, 100)

  const handleBlur = () => {
    triggerChange()
    if (onBlur) {
      onBlur(currencyValue)
    }
  }

  return (
    <Row>
      <Col flex="auto">
        <InputNumber
          className="full-width"
          value={currencyValue}
          onChange={onTextChange}
          formatter={(value) => inputNumberFormatter(value, locale)}
          parser={(value) => inputNumberParse(value, locale)}
          onBlur={handleBlur}
          disabled={disabled}
          min={min}
          max={max}
          placeholder={placeholder || ""}
          // size={small ? 'small' : 'large'}
        />
      </Col>
      {suffix && <Col style={{ alignSelf: "center" }}>{suffix}</Col>}
    </Row>
  )
}

export default NumberInput
