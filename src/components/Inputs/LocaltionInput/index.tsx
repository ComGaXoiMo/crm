import React from "react"
import { Col, Row, Select } from "antd"
import { L } from "@lib/abpUtility"
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import { filterOptions, renderOptions } from "@lib/helper"
import appDataService from "@services/appDataService"
import { AddressModel, IAddressModel } from "@models/common/addressModel"
import _ from "lodash"

interface AddressProps {
  label: string;
  name: string | string[];
  rule?;
  disabled?: boolean;
  value?: AddressModel[];
  onChange?: (value: IAddressModel[]) => void;
}

const defaultvalue = {
  countryId: 232,
}
interface AddressStates {
  firtAddress: any;
  currentValue: any[];
  provinces: any[];
  districts: any[];
}

class LocaltionInput extends AppComponentListBase<AddressProps, AddressStates> {
  form = React.createRef<any>();
  state = {
    firtAddress: {} as any,
    currentValue: this.props.value ?? ([] as any),

    provinces: [] as any,
    districts: [] as any,
  };
  async componentDidMount() {
    await this.initProvinces("232")
    await this.initDistrict(this.state.firtAddress?.provinceId)
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      await this.setState({ firtAddress: _.first(this.props.value) })
      await this.initDistrict(this.state.firtAddress?.provinceId)
    }
  }
  triggerChange = (updatedValue) => {
    this.setState({
      currentValue: { ...updatedValue, countryId: defaultvalue.countryId },
    })
    if (this.props.onChange) {
      this.props.onChange(updatedValue)
    }
  };
  initProvinces = async (countryId) => {
    const data = countryId
      ? await appDataService.getProjectProvinces(countryId)
      : []
    this.setState({ provinces: data })
  };
  changeDistrict = async (districtId) => {
    const updatedValue = { ...this.state.currentValue, districtId }
    this.triggerChange(updatedValue)
  };
  changeProvince = async (provinceId) => {
    const updatedValue = {
      ...this.state.currentValue,
      provinceId,
      districtId: undefined,
    }
    this.initDistrict(provinceId)
    this.triggerChange(updatedValue)
  };
  initDistrict = async (provinceId) => {
    const data = provinceId
      ? await appDataService.getProjectDistricts(provinceId)
      : []
    this.setState({ districts: data })
  };
  onAddressChange = async (e) => {
    await this.setState({
      currentValue: { ...this.state.currentValue, address: e.target.value },
    })
    await this.triggerChange(this.state.currentValue)
  };
  render() {
    return (
      <Row gutter={[8, 8]}>
        <Col sm={{ span: 12, offset: 0 }}>
          <Select
            getPopupContainer={(trigger) => trigger.parentNode}
            style={{ width: "100%" }}
            allowClear
            disabled={this.props.disabled}
            value={this.state.firtAddress?.provinceId}
            showSearch
            filterOption={filterOptions}
            onChange={this.changeProvince}
            placeholder={L("PROVINCE")}
          >
            {renderOptions(this.state.provinces)}
          </Select>
        </Col>
        <Col sm={{ span: 12, offset: 0 }}>
          <Select
            getPopupContainer={(trigger) => trigger.parentNode}
            style={{ width: "100%" }}
            allowClear
            disabled={this.props.disabled}
            value={this.state.firtAddress?.districtId}
            showSearch
            filterOption={filterOptions}
            onChange={this.changeDistrict}
            placeholder={L("DISTRICT")}
          >
            {renderOptions(this.state.districts)}
          </Select>
        </Col>
      </Row>
    )
  }
}

export default withRouter(LocaltionInput)
