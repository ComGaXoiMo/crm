import React, { useState, useEffect } from "react"
import { Form, Input, Select, Tooltip } from "antd"
import { IPhoneModel, PhoneModel } from "../../../models/common/phoneModel"
import isEqual from "lodash/isEqual"
import {
  DeleteOutlined,
  PlusOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons/lib"
import Button from "antd/es/button"
import { L } from "@lib/abpUtility"
import { usePrevious } from "@lib/appconst"

interface PhonesInputProps {
  value?: IPhoneModel[]
  onChange?: (value: IPhoneModel[]) => void
  maxLength?: number
  disableProps?: boolean
  fieldName?: string
  disabled?: boolean
  suffix?: boolean
}

const defaultValue = {
  phoneType: 2, // Mobile
  countryId: 232, // Viet Nam
}

const PhonesInput2: React.FC<PhonesInputProps> = ({
  value = [
    // new PhoneModel("", defaultValue.countryId, defaultValue.phoneType, true),
  ],
  onChange,
  disabled,
  fieldName,
  suffix,
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

  const onChangePrimary = (index) => {
    currentValue.forEach(
      (item, phoneIndex) => (item.isPrimary = index === phoneIndex)
    )
    triggerChange([...currentValue])
  }

  const addPhone = () => {
    triggerChange([
      ...currentValue,
      new PhoneModel(
        "",
        defaultValue.countryId,
        defaultValue.phoneType,
        !currentValue.length
      ),
    ])
  }

  const deletePhone = (phone, index) => {
    if (!currentValue || !currentValue.length) {
      triggerChange([new PhoneModel()])
      return
    }
    triggerChange([
      ...currentValue.filter((item, phoneIndex) => index !== phoneIndex),
    ])
  }
  const selectBefore = (
    <Form.Item
      name={fieldName ? `prefix${fieldName}` : "prefix"}
      noStyle
      rules={[{ required: false }]}
    >
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
      {index === currentValue?.length - 1 && (
        <PlusOutlined
          className="ml-1"
          onClick={disabled ? undefined : addPhone}
        />
      )}
      {
        <Tooltip placement="topLeft" title={L("PRIMARY_PHONE")}>
          {phone.isPrimary ? (
            <StarFilled className="ml-1" />
          ) : (
            <StarOutlined
              className="ml-1"
              onClick={disabled ? undefined : () => onChangePrimary(index)}
            />
          )}
        </Tooltip>
      }
      <Button
        type="text"
        size="small"
        className="icon-button"
        disabled={phone.isPrimary || disabled}
        onClick={() => deletePhone(phone, index)}
      >
        <DeleteOutlined className="ml-1" />
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
              disabled={disabled}
              style={{ borderRadius: "0px 8px 8px 0px !important" }}
              value={phone.phone}
              addonBefore={selectBefore}
              suffix={suffix ? phoneActions(phone, index) : undefined}
              onChange={(e) => onPhoneChange(index, e.target.value)}
              onBlur={() => triggerChange(currentValue)}
            />
          </Input.Group>
        )
      })}
      {(!currentValue || !currentValue.length) && (
        <Button disabled={disabled} type="dashed" block onClick={addPhone}>
          {L("BTN_ADD")}
        </Button>
      )}
    </>
  )
}

export default PhonesInput2
