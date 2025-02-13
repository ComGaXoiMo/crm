import React from "react"
import { Col, Input, Row } from "antd"
import { L } from "@lib/abpUtility"
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import appDataService from "@services/appDataService"
import { AddressModel, IAddressModel } from "@models/common/addressModel"
import _ from "lodash"
// import FormItem from "antd/es/form/FormItem";
// import { formItemLayout } from "@lib/formLayout";

interface AddressProps {
  label: string
  name: string | string[]
  required?: boolean
  disabled?: boolean
  value?: AddressModel[]
  onChange?: (value: IAddressModel[]) => void
}

const defaultvalue = {
  countryId: 232,
}
interface AddressStates {
  firtAddress: any
  currentValue: any[]
  provinces: any[]
  districts: any[]
}

class AddressText extends AppComponentListBase<AddressProps, AddressStates> {
  form = React.createRef<any>()
  state = {
    firtAddress: {} as any,
    currentValue: this.props.value ?? ([] as any),

    provinces: [] as any,
    districts: [] as any,
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      await this.setState({ firtAddress: _.first(this.props.value) })
      if (!this.state.firtAddress) {
        this.setState({ firtAddress: this.props.value })
      }
    }
  }
  triggerChange = async (updatedValue) => {
    await this.setState({
      currentValue: { ...updatedValue, countryId: defaultvalue.countryId },
    })
    if (this.props.onChange) {
      await this.props.onChange(this.state.currentValue)
    }
  }
  initProvinces = async (countryId) => {
    const data = countryId ? await appDataService.getProvinces(countryId) : []
    this.setState({ provinces: data })
  }
  changeDistrict = async (districtId) => {
    const updatedValue = { ...this.state.currentValue, districtId }
    await this.triggerChange(updatedValue)
  }
  changeProvince = async (provinceId) => {
    const updatedValue = {
      ...this.state.currentValue,
      provinceId,
      districtId: undefined,
    }
    this.initDistrict(provinceId)
    this.triggerChange(updatedValue)
  }
  initDistrict = async (provinceId) => {
    const data = provinceId ? await appDataService.getDistricts(provinceId) : []
    await this.setState({ districts: data })
  }
  onAddressChange = async (e) => {
    await this.setState({
      currentValue: { ...this.state.currentValue, address: e.target.value },
    })
    await this.triggerChange(this.state.currentValue)
  }
  render() {
    return (
      <Row gutter={[8, 8]}>
        <Col sm={{ span: 24, offset: 0 }}>
          {/* <FormItem
            // {...formItemLayout}
            name={"address"}
            rules={[{ required: this.props.required ?? false, max: 200 }]}
          > */}
          <Input
            // style={{ width: "100%" }}
            disabled={this.props.disabled}
            value={this.state.firtAddress?.address}
            onChange={this.onAddressChange}
            defaultValue={" "}
            // maxLength={201}
          />
          {/* </FormItem> */}
        </Col>
        <Col sm={{ span: 12, offset: 0 }}>
          <Input
            // style={{ width: "100%" }}
            disabled={this.props.disabled}
            value={this.state.firtAddress?.province?.provinceName}
            onChange={this.onAddressChange}
            placeholder={L("PROVINCE")}
            defaultValue={" "}
            // maxLength={201}
          />
        </Col>
        <Col sm={{ span: 12, offset: 0 }}>
          {" "}
          <Input
            // style={{ width: "100%" }}
            disabled={this.props.disabled}
            value={this.state.firtAddress?.district?.districtName}
            onChange={this.onAddressChange}
            placeholder={L("DISTRICT")}
            defaultValue={" "}
            // maxLength={201}
          />
        </Col>
      </Row>
    )
  }
}

export default withRouter(AddressText)
