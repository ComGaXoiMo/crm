import React from "react"
import { Button, Col, Row, Select } from "antd"
import { L } from "@lib/abpUtility"
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import { filterOptions, renderOptions } from "@lib/helper"
import _ from "lodash"
import { unitProductTypeModel } from "@models/common/unitProductTypeModel"
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons"

interface Props {
  label: string
  name: string | string[]
  rule?
  disabled?: boolean
  value: unitProductTypeModel[]
  valuef: unitProductTypeModel[]

  propertyType: any[]
  unitType: any[]
  onChange?: (value: unitProductTypeModel[]) => void
}

interface States {
  currentValue: unitProductTypeModel[]
}

class ProductAndUnitTypeSelect extends AppComponentListBase<Props, States> {
  form = React.createRef<any>()
  state = {
    currentValue: this.props.valuef ?? ([] as any),
  }
  async componentDidMount() {
    this.setState({ currentValue: this.props.valuef ?? ([] as any) })
    if (!this.props.valuef) {
      this.addNewProductType()
    }
  }
  // async componentDidUpdate(prevProps) {
  //   if (prevProps.value !== this.props.value) {
  //     this.setState({ currentValue: this.props.value ?? ([] as any) });
  //     if (!this.props.value) {
  //       this.addNewProductType();
  //     }
  //     //   await this.onValueChange(this.state.firtAddress?.provinceId);
  //   }
  // }

  triggerChange = async (updatedValue) => {
    await this.setState({
      currentValue: updatedValue,
    })
    if (this.props.onChange) {
      await this.props.onChange(updatedValue)
    }
  }

  changeProductType = async (value, index) => {
    const updatedValue = [...this.state.currentValue]
    updatedValue[index].propertyTypeId = value
    this.triggerChange(updatedValue)
  }
  changeUnitType = async (value, index) => {
    const updatedValue = [...this.state.currentValue]
    updatedValue[index].unitTypeId = value
    this.triggerChange(updatedValue)
  }

  addNewProductType = async () => {
    this.triggerChange([
      ...this.state.currentValue,
      new unitProductTypeModel(undefined, undefined),
    ])
  }
  deleteProductType = async (value, index) => {
    await this.triggerChange([
      ...this.state.currentValue.filter(
        (item, ProductTypeIndex) => ProductTypeIndex !== index
      ),
    ])
  }
  render() {
    const { currentValue } = this.state
    return (
      <>
        <Row gutter={[8, 8]}>
          {(currentValue || []).map((item, index) => (
            <Col {...{ span: 23 }} key={index}>
              <Row gutter={[8, 8]}>
                <Col sm={{ span: 8, offset: 0 }}>
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    style={{ width: "100%" }}
                    allowClear
                    disabled={this.props.disabled}
                    value={item?.propertyTypeId}
                    showSearch
                    filterOption={filterOptions}
                    onChange={(e) => this.changeProductType(e, index)}
                    placeholder={L("PRODUCT_TYPE")}
                  >
                    {renderOptions(this.props.propertyType)}
                  </Select>
                </Col>
                <Col sm={{ span: 15, offset: 0 }}>
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    style={{ width: "100%" }}
                    allowClear
                    disabled={this.props.disabled}
                    value={item?.unitTypeId}
                    showSearch
                    filterOption={filterOptions}
                    mode="multiple"
                    onChange={(e) => this.changeUnitType(e, index)}
                    placeholder={L("UNIT_TYPE")}
                  >
                    {renderOptions(this.props.unitType)}
                  </Select>
                </Col>
                {
                  <Col sm={{ span: 1, offset: 0 }}>
                    <Button
                      type="dashed"
                      disabled={this.props.disabled}
                      block
                      icon={<MinusCircleOutlined />}
                      style={{ overflow: "hidden" }}
                      onClick={() => this.deleteProductType(item, index)}
                    ></Button>
                  </Col>
                }
              </Row>
            </Col>
          ))}
          <Col sm={{ span: 1, offset: 0 }}>
            <Button
              type="dashed"
              disabled={this.props.disabled}
              block
              onClick={this.addNewProductType}
              icon={<PlusCircleOutlined />}
            ></Button>
          </Col>
        </Row>
        {/* {(!currentValue || !currentValue.length) && (
      
        <Button
          type="dashed"
          disabled={this.props.disabled}
          block
          onClick={this.addNewProductType}
        >
          {L("BTN_ADD")}
        </Button> 
        )}  */}
      </>
    )
  }
}

export default withRouter(ProductAndUnitTypeSelect)
