import React, { useState, useEffect, useRef } from "react"
import { Input, Tooltip } from "antd"
import { AddressModel, IAddressModel } from "@models/common/addressModel"
import isEqual from "lodash/isEqual"
import {
  DeleteOutlined,
  PlusOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons/lib"
import Cascader from "antd/lib/cascader"
import Button from "antd/es/button"
import { L } from "@lib/abpUtility"

interface AddressInputProps {
  disabled?: boolean;
  value?: IAddressModel[];
  onChange?: (value: IAddressModel[]) => void;
  maxLength?: number;
  countries?: any[];
}

const usePrevious = (value) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const AddressInput: React.FC<AddressInputProps> = ({
  value = [],
  onChange,
  countries,
}) => {
  const previousValue = usePrevious(value)
  const previousCountries = usePrevious(countries || [])
  const [currentValue, setCurrentValue] = useState(value)
  const [countryData, setCountryData] = useState(countries || [])

  useEffect(() => {
    if (previousValue && !isEqual(previousValue, value)) {
      setCurrentValue(value)
    }
  }, [value])

  useEffect(() => {
    if (previousValue && !isEqual(previousValue, currentValue)) {
      triggerChange()
    }
  }, [currentValue])

  useEffect(() => {
    if (previousCountries && !isEqual(previousCountries, countries)) {
      setCountryData(countries || [])
    }
  }, [countries])

  const triggerChange = () => {
    if (onChange) {
      onChange(currentValue)
    }
  }

  const filterCountryData = (inputValue, path) => {
    return path.some(
      (option) =>
        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    )
  }

  const onAddressChange = (index, value) => {
    currentValue[index].address = value
  }

  const onCountryDataChange = (index, value) => {
    const [countryId, provinceId, districtId] = value
    currentValue[index].countryId = countryId
    currentValue[index].provinceId = provinceId
    currentValue[index].districtId = districtId
    setCurrentValue([...currentValue])
    triggerChange()
  }

  const onChangePrimary = (index) => {
    currentValue.forEach(
      (item, addressIndex) => (item.isPrimary = index === addressIndex)
    )
    setCurrentValue([...currentValue])
    triggerChange()
  }

  const addAddress = () => {
    setCurrentValue([
      ...currentValue,
      new AddressModel(null, null, null, null, !currentValue.length),
    ])
  }

  const deleteAddress = (address, index) => {
    if (index >= currentValue.length) {
      return
    }
    const newValue = [
      ...currentValue.filter((item, addressIndex) => index !== addressIndex),
    ]
    setCurrentValue([...newValue])
  }

  const addressActions = (item, index) => (
    <>
      {index === currentValue?.length - 1 && (
        <PlusOutlined className="ml-1" onClick={addAddress} />
      )}
      {
        <Tooltip placement="topLeft" title={L("PRIMARY_ADDRESS")}>
          {item.isPrimary ? (
            <StarFilled className="ml-1" />
          ) : (
            <StarOutlined
              className="ml-1"
              onClick={() => onChangePrimary(index)}
            />
          )}
        </Tooltip>
      }
      <Button
        type="text"
        size="small"
        className="icon-button"
        disabled={item.isPrimary}
        onClick={() => deleteAddress(item, index)}
      >
        <DeleteOutlined className="ml-1" />
      </Button>
    </>
  )

  return (
    <>
      {(currentValue || []).map((address: any, index) => {
        return (
          <Input.Group compact key={index} className={index > 0 ? "mt-1" : ""}>
            <Cascader
              style={{ width: "100%" }}
              options={countryData}
              onChange={(value) => onCountryDataChange(index, value)}
              changeOnSelect
              showSearch={{ filter: filterCountryData }}
              value={[
                address.countryId,
                address.provinceId,
                address.districtId,
              ]}
            />
            <Input
              // style={{ width: "60%" }}
              suffix={addressActions(address, index)}
              defaultValue={address.address}
              onChange={(e) => onAddressChange(index, e.target.value)}
              onBlur={triggerChange}
            />
          </Input.Group>
        )
      })}
      {(!currentValue || !currentValue.length) && (
        <Button type="dashed" block onClick={addAddress}>
          {L("BTN_ADD")}
        </Button>
      )}
    </>
  )
}

export default AddressInput
