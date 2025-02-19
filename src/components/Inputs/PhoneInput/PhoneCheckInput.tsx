import React, { useState, useEffect } from "react"
import { Form, Input, Select } from "antd"
import { IPhoneModel, PhoneModel } from "../../../models/common/phoneModel"
import isEqual from "lodash/isEqual"
import Button from "antd/es/button"
import { FileSearchOutlined } from "@ant-design/icons"
import { usePrevious } from "@lib/appconst"

interface PhonesInputProps {
  value?: IPhoneModel[]
  onChange?: (value: IPhoneModel[]) => void
  maxLength?: number
  disableProps?: boolean
  fieldName?: string
  onCheckPhone: (phone) => void
  disabled?: boolean
}

const defaultValue = {
  phoneType: 2, // Mobile
  countryId: 232, // Viet Nam
}

const PhoneCheckInput: React.FC<PhonesInputProps> = ({
  value = [
    new PhoneModel("", defaultValue.countryId, defaultValue.phoneType, true),
  ],
  onChange,
  disabled,
  fieldName,
  onCheckPhone,
}) => {
  const previousValue = usePrevious(value)
  const [currentValue, setCurrentValue] = useState(
    value?.length
      ? value
      : [
          new PhoneModel(
            "",
            defaultValue.countryId,
            defaultValue.phoneType,
            true
          ),
        ]
  )

  useEffect(() => {
    if (previousValue && !isEqual(previousValue, value)) {
      setCurrentValue(value)
    }
  }, [value])

  const triggerChange = (value) => {
    setCurrentValue(value)
    if (onChange) {
      onChange(value)
    }
  }

  const onPhoneChange = (index, value) => {
    const values = [...currentValue]
    values[index].phone = value
    triggerChange(values)
  }

  const CheckPhone = (phone) => {
    onCheckPhone(phone)
  }
  const selectBefore = (
    <Form.Item name={fieldName ? `prefix${fieldName}` : "prefix"} noStyle>
      <Select
        getPopupContainer={(trigger) => trigger.parentNode}
        defaultValue={"+84"}
        style={{ width: "5rem" }}
        disabled={disabled}
        showArrow={false}
      >
        <Select.Option value="+84">+84</Select.Option>
      </Select>
    </Form.Item>
  )
  const phoneActions = (phone, index) => (
    <>
      <Button
        type="text"
        size="small"
        disabled={phone?.phone === ""}
        className="icon-button"
        onClick={() => CheckPhone(phone)}
      >
        <FileSearchOutlined className="ml-1" />
      </Button>
    </>
  )
  return (
    <>
      {(currentValue || []).map((phone: any, index) => {
        return (
          <Input.Group
            compact
            key={index}
            className="mb-1 d-flex justify-content-between w-100"
          >
            <Input
              disabled={disabled || index > 0}
              style={{ borderRadius: "0px 8px 8px 0px !important" }}
              value={phone.phone}
              maxLength={20}
              addonBefore={selectBefore}
              suffix={index === 0 && phoneActions(phone, index)}
              onChange={(e) => onPhoneChange(index, e.target.value)}
              onPressEnter={() => CheckPhone(phone)}
            />
          </Input.Group>
        )
      })}
      {(!currentValue || !currentValue.length) && (
        <Input
          disabled={disabled}
          style={{ borderRadius: "0px 8px 8px 0px !important" }}
          addonBefore={selectBefore}
          maxLength={20}
          suffix={phoneActions("", 0)}
          onChange={(e) => onPhoneChange(0, e.target.value)}
        />
      )}
    </>
  )
}

export default PhoneCheckInput
