import React, { useState, useEffect, ReactNode } from "react"
import { Select } from "antd"
import { AddressModel, IAddressModel } from "@models/common/addressModel"
import isEqual from "lodash/isEqual"

import Col from "antd/lib/grid/col"
import { L } from "@lib/abpUtility"
import { filterOptions, renderOptions } from "@lib/helper"
import Row from "antd/lib/grid/row"
import appDataService from "@services/appDataService"
import Button from "antd/es/button"
import { usePrevious } from "@lib/appconst"

interface AddressSelectMultiProps {
  value?: IAddressModel[]
  disabled?: boolean
  onChange?: (value: IAddressModel[]) => void
  countries?: any[]
  configOption?: {
    showProvince: boolean
    showDistrict: boolean
    showWard: boolean
  }
  colSpan?: number
  rowGutter?: any
}

const AddressSelectMulti: React.FC<AddressSelectMultiProps> = ({
  value = [],
  disabled,
  onChange,
  countries,
  colSpan = { span: 24, offset: 0 },
  rowGutter = [16, 8],
  configOption = {
    showProvince: true,
    showDistrict: true,
    showWard: true,
  },
}) => {
  const previousValue = usePrevious(value)
  const [currentValue, setCurrentValue] = useState(value)

  useEffect(() => {
    if (currentValue) {
      setCurrentValue([new AddressModel()])
    }
    if (previousValue && !isEqual(previousValue, value)) {
      setCurrentValue(value)
    }
  }, [value])
  useEffect(() => {
    if (!value) {
      setCurrentValue([new AddressModel()])
    }
  }, [])
  useEffect(() => {
    if (previousValue && !isEqual(previousValue, currentValue)) {
      triggerChange()
    }
  }, [currentValue])

  const triggerChange = () => {
    if (onChange) {
      onChange(currentValue)
    }
  }

  const handleChange = (index, updateItem) => {
    if (currentValue && index < currentValue.length) {
      currentValue[index] = updateItem
      triggerChange()
    }
  }

  // const onChangePrimary = (index) => {
  //   currentValue.forEach(
  //     (item, addressIndex) => (item.isPrimary = index === addressIndex)
  //   );
  //   setCurrentValue([...currentValue]);
  //   triggerChange();
  // };

  const addAddress = () => {
    setCurrentValue([
      ...currentValue,
      new AddressModel(null, null, null, null, !currentValue.length),
    ])
  }

  // const deleteAddress = (address, index) => {
  //   if (currentValue && currentValue.length === 1) {
  //     setCurrentValue([new AddressModel()]);
  //     return;
  //   }
  //   setCurrentValue([
  //     ...currentValue.filter((item, addressIndex) => index !== addressIndex),
  //   ]);
  // };

  // const addressActions = (item, index) => (
  //   <>
  //     {index === currentValue?.length - 1 && (
  //       <PlusOutlined className="ml-1" onClick={addAddress} />
  //     )}
  //     {
  //       <Tooltip placement="topLeft" title={L("PRIMARY_ADDRESS")}>
  //         {item.isPrimary ? (
  //           <StarFilled className="ml-1" />
  //         ) : (
  //           <StarOutlined
  //             className="ml-1"
  //             onClick={() => onChangePrimary(index)}
  //           />
  //         )}
  //       </Tooltip>
  //     }
  //     <Button
  //       type="text"
  //       size="small"
  //       className="icon-button"
  //       disabled={item.isPrimary}
  //       onClick={() => deleteAddress(item, index)}
  //     >
  //       <DeleteOutlined className="ml-1" />
  //     </Button>
  //   </>
  // );

  return (
    <>
      <Row gutter={[8, 8]}>
        {(currentValue || []).map((address: any, index) => {
          return (
            <Col key={index} sm={24}>
              <AddressInput
                disable={disabled ?? false}
                value={address}
                // addressActions={() => addressActions(address, index)}
                onChange={(updateValue) => handleChange(index, updateValue)}
                countries={countries}
                configOption={configOption}
                rowGutter={rowGutter}
                key={index}
              />
            </Col>
          )
        })}
      </Row>
      {(!currentValue || !currentValue.length) && (
        <Button disabled={disabled} type="dashed" block onClick={addAddress}>
          {L("BTN_ADD")}
        </Button>
      )}
    </>
  )
}

interface AddressInput2Props {
  value: IAddressModel
  onChange?: (value: IAddressModel) => void
  countries?: any[]
  disable: boolean
  configOption?: {
    showProvince: boolean
    showDistrict: boolean
    showWard: boolean
  }
  colSpan?: number
  rowGutter?: any
  addressActions?: () => ReactNode
}

const AddressInput: React.FC<AddressInput2Props> = ({
  value,
  onChange,
  countries,
  disable,
  rowGutter = [4, 0],
  configOption = {
    showProvince: true,
    showDistrict: true,
    showWard: true,
  },
  addressActions,
}) => {
  const previousValue = usePrevious(value)
  const [currentValue, setCurrentValue] = useState(value)
  const [provinces, setProvinces] = useState([] as any)
  const [districts, setDistricts] = useState([] as any)
  const inputRef = React.createRef() as any
  useEffect(() => {
    initProvinces("232")
    if (!isEqual(previousValue, value)) {
      setCurrentValue(value)
      if (inputRef && inputRef.current) {
        inputRef.current.value = value.address || ""
      }
      if (value.countryId) {
        initProvinces(value.countryId)
      }
      if (value.provinceId) {
        initDistrict(value.provinceId)
      }
    }
  }, [value])

  if (countries) {
    const vncountry = countries.filter(
      (country) => country.countryCode === "VN"
    )
    countries.splice(countries.indexOf(vncountry[0]), 1)
    countries.splice(0, 0, vncountry[0])
  }

  const triggerChange = (updatedValue) => {
    setCurrentValue(updatedValue)
    if (onChange) {
      onChange(updatedValue)
    }
  }

  const initProvinces = async (countryId) => {
    const data = countryId ? await appDataService.getProvinces(countryId) : []
    setProvinces(data)
  }

  const changeProvince = async (provinceId) => {
    const updatedValue = { ...currentValue, provinceId, districtId: undefined }
    if (configOption.showDistrict) {
      initDistrict(provinceId)
    }
    triggerChange(updatedValue)
  }

  const initDistrict = async (provinceId) => {
    const data = provinceId ? await appDataService.getDistricts(provinceId) : []
    setDistricts(data)
  }

  const changeDistrict = async (districtId) => {
    const updatedValue = { ...currentValue, districtId }
    triggerChange(updatedValue)
  }
  return (
    <Row gutter={[8, 0]}>
      {configOption.showProvince && (
        <Col sm={{ span: 12, offset: 0 }}>
          <Select
            getPopupContainer={(trigger) => trigger.parentNode}
            style={{ width: "100%" }}
            allowClear
            value={currentValue.provinceId}
            showSearch
            disabled={disable}
            filterOption={filterOptions}
            onChange={changeProvince}
            placeholder={L("PROVINCE")}
          >
            {renderOptions(provinces)}
          </Select>
        </Col>
      )}
      {configOption.showDistrict && (
        <Col sm={{ span: 12, offset: 0 }}>
          <Select
            getPopupContainer={(trigger) => trigger.parentNode}
            style={{ width: "100%" }}
            allowClear
            disabled={disable}
            value={currentValue.districtId}
            showSearch
            filterOption={filterOptions}
            onChange={changeDistrict}
            placeholder={L("DISTRICT")}
          >
            {renderOptions(districts)}
          </Select>
        </Col>
      )}
      {/* <Col sm={{ span: 4, offset: 0 }}>{addressActions()}</Col> */}
    </Row>
  )
}

export default AddressSelectMulti
