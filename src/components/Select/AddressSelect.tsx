/* @flow */
import React, { useEffect, useState } from "react"
import { Select } from "antd"
import { filterOptions, renderOptions } from "../../lib/helper"
import Col from "antd/lib/grid/col"
import Row from "antd/lib/grid/row"
import { L } from "../../lib/abpUtility"
import appDataService from "../../services/appDataService"

type Props = {
  countries: any[];
  configOption: {
    showProvince: boolean;
    showDistrict: boolean;
    showWard: boolean;
  };
  onChange: (value) => void;
  onChangeCountry: (value) => void;
  onChangeProvince?: (value) => void;
  onChangeDistrict?: (value) => void;
  onChangeWard?: (value) => void;
  colSpan: number;
  rowGutter?: any;
};

const AddressSelect: React.FC<Props> = ({
  countries,
  configOption,
  onChange,
  onChangeCountry,
  onChangeProvince,
  onChangeDistrict,
  onChangeWard,
  colSpan,
  rowGutter = [16, 8],
}: Props) => {
  const [addressValue, setAddressValue] = useState({} as any)
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])

  const changeCountry = async (value) => {
    setAddressValue({
      countryId: value,
      provinceId: null,
      districtId: null,
      wardId: null,
    })
    if (configOption.showProvince) {
      const data = value ? await appDataService.getProvinces(value) : []
      setProvinces(data)
    }
  }

  const changeProvince = async (value) => {
    onChangeProvince && onChangeProvince(value)
    setAddressValue({
      ...addressValue,
      provinceId: value,
      districtId: null,
      wardId: null,
    })
    if (configOption.showDistrict) {
      const data = value ? await appDataService.getDistricts(value) : []
      setDistricts(data)
    }
  }

  const changeDistrict = async (value) => {
    onChangeDistrict && onChangeDistrict(value)
    setAddressValue({ ...addressValue, districtId: value, wardId: null })
    if (configOption.showWard) {
      const data = value
        ? await appDataService.getWards({ districtId: value })
        : []
      setWards(data)
    }
  }

  useEffect(() => {
    onChange(addressValue)
  }, [addressValue])

  return (
    <Row gutter={rowGutter}>
      <Col sm={colSpan}>
        <label>{L("COUNTRY")}</label>
        <Select
          getPopupContainer={(trigger) => trigger.parentNode}
          style={{ width: "100%" }}
          allowClear
          value={addressValue.countryId}
          showSearch
          filterOption={filterOptions}
          onChange={changeCountry}
        >
          {renderOptions(countries)}
        </Select>
      </Col>
      {configOption.showProvince && (
        <Col sm={colSpan}>
          <label>{L("PROVINCE")}</label>
          <Select
            getPopupContainer={(trigger) => trigger.parentNode}
            style={{ width: "100%" }}
            allowClear
            value={addressValue.provinceId}
            showSearch
            filterOption={filterOptions}
            onChange={changeProvince}
          >
            {renderOptions(provinces)}
          </Select>
        </Col>
      )}
      {configOption.showDistrict && (
        <Col sm={colSpan}>
          <label>{L("DISTRICT")}</label>
          <Select
            getPopupContainer={(trigger) => trigger.parentNode}
            style={{ width: "100%" }}
            allowClear
            value={addressValue.districtId}
            showSearch
            filterOption={filterOptions}
            onChange={changeDistrict}
          >
            {renderOptions(districts)}
          </Select>
        </Col>
      )}
      {configOption.showWard && (
        <Col sm={colSpan}>
          <label>{L("WARD")}</label>
          <Select
            getPopupContainer={(trigger) => trigger.parentNode}
            style={{ width: "100%" }}
            allowClear
            value={addressValue.wardId}
            showSearch
            filterOption={filterOptions}
            onChange={onChangeWard}
          >
            {renderOptions(wards)}
          </Select>
        </Col>
      )}
    </Row>
  )
}

export default AddressSelect
