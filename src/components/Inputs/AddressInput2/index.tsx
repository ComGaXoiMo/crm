import React from "react";
import { Col, Input, Row, Select } from "antd";
import { L } from "@lib/abpUtility";
import { AppComponentListBase } from "@components/AppComponentBase";
import withRouter from "@components/Layout/Router/withRouter";
import { filterOptions, renderOptions } from "@lib/helper";
import appDataService from "@services/appDataService";
import { AddressModel, IAddressModel } from "@models/common/addressModel";
import _ from "lodash";
// import FormItem from "antd/es/form/FormItem";
// import { formItemLayout } from "@lib/formLayout";

interface AddressProps {
  label: string;
  name: string | string[];
  required?: boolean;
  disabled?: boolean;
  value?: AddressModel[];
  hasAddressVi?: boolean;
  onChange?: (value: IAddressModel[]) => void;
}

const defaultvalue = {
  countryId: 232,
};
interface AddressStates {
  firtAddress: any;
  currentValue: any[];
  provinces: any[];
  districts: any[];
}

class AddressInput2 extends AppComponentListBase<AddressProps, AddressStates> {
  form = React.createRef<any>();
  state = {
    firtAddress: {} as any,
    currentValue: this.props.value ?? ([] as any),

    provinces: [] as any,
    districts: [] as any,
  };
  async componentDidMount() {
    await this.initProvinces("232");
    await this.initDistrict(this.state.firtAddress?.provinceId);
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      await this.setState({ firtAddress: _.first(this.props.value) });
      if (!this.state.firtAddress) {
        this.setState({ firtAddress: this.props.value });
      } else {
        await this.initDistrict(this.state.firtAddress?.provinceId);
      }
    }
  }
  triggerChange = async (updatedValue) => {
    await this.setState({
      currentValue: { ...updatedValue, countryId: defaultvalue.countryId },
    });
    if (this.props.onChange) {
      await this.props.onChange(this.state.currentValue);
    }
  };
  initProvinces = async (countryId) => {
    const data = countryId ? await appDataService.getProvinces(countryId) : [];
    this.setState({ provinces: data });
  };
  changeDistrict = async (districtId) => {
    const updatedValue = { ...this.state.firtAddress, districtId };
    await this.triggerChange(updatedValue);
  };
  changeProvince = async (provinceId) => {
    const updatedValue = {
      ...this.state.firtAddress,
      provinceId,
      districtId: undefined,
    };
    this.initDistrict(provinceId);
    this.triggerChange(updatedValue);
  };
  initDistrict = async (provinceId) => {
    const data = provinceId
      ? await appDataService.getDistricts(provinceId)
      : [];
    await this.setState({ districts: data });
  };
  onAddressChange = async (e, type) => {
    // type == 0 for address && the other for addressVi
    if (type == 0) {
      await this.setState({
        currentValue: { ...this.state.firtAddress, address: e.target.value },
      });
    } else {
      await this.setState({
        currentValue: { ...this.state.firtAddress, addressVi: e.target.value },
      });
    }
    await this.triggerChange(this.state.currentValue);
  };

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
            onChange={(e) => this.onAddressChange(e, 0)}
            defaultValue={" "}
            // maxLength={201}
          />

          {/* </FormItem> */}
        </Col>
        {this.props.hasAddressVi && (
          <Col sm={{ span: 24, offset: 0 }}>
            <Input
              // style={{ width: "100%" }}
              disabled={this.props.disabled}
              value={this.state.firtAddress?.addressVi}
              onChange={(e) => this.onAddressChange(e, 1)}
              defaultValue={" "}
              placeholder={L("ADDRESS_VI")}
              // maxLength={201}
            />
          </Col>
        )}
        <Col sm={{ span: 12, offset: 0 }}>
          <Select
            getPopupContainer={(trigger) => trigger.parentNode}
            style={{ width: "100%" }}
            // allowClear
            disabled={this.props.disabled}
            value={this.state.firtAddress?.provinceId}
            showSearch
            filterOption={filterOptions}
            onChange={this.changeProvince}
            placeholder={L("PROVINCE")}
            // defaultValue={50}
          >
            {renderOptions(this.state.provinces)}
          </Select>{" "}
        </Col>
        <Col sm={{ span: 12, offset: 0 }}>
          {" "}
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
          </Select>{" "}
        </Col>
      </Row>
    );
  }
}

export default withRouter(AddressInput2);
