import React from "react"
import { Button, Col, Row, Select } from "antd"
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import { addItemToList, renderOptions } from "@lib/helper"
import _, { debounce } from "lodash"
import {
  MinusCircleOutlined,
  PlusCircleOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons"
import { OccupierModel } from "@models/common/occupierModel"
import tenantService from "@services/administrator/tenant/tenantService"

interface Props {
  label: string
  name: string | string[]
  disabled?: boolean
  value: OccupierModel[]
  valuef: OccupierModel[]

  onChange?: (value: OccupierModel[]) => void
}

interface States {
  currentValue: OccupierModel[]
  listOccupier: any[]
}

class OccupierSelect extends AppComponentListBase<Props, States> {
  form = React.createRef<any>()
  state = {
    currentValue: [] as any,
    listOccupier: [] as any,
  }
  async componentDidMount() {
    this.setState({ currentValue: this.props.valuef ?? ([] as any) })
    this.getOccupier("", true)
    if (!this.props.valuef) {
      this.addNewItem(true)
    }
  }

  getOccupier = async (input?, id?) => {
    const res = await tenantService.getAll({
      keyword: input,
      maxResultCount: 10,
      skipCount: 0,
    })
    const listvalue = res.items?.map((item) => {
      return { id: item.id, label: item.name }
    })
    if (id && this.props.valuef?.length > 0) {
      this.props.valuef?.map((occupier) => {
        addItemToList(listvalue, {
          id: occupier?.userTenantId,
          label: occupier?.userTenant?.name,
        })
      })
    }
    console.log(listvalue)
    this.setState({
      listOccupier: listvalue,
    })
  }

  triggerChange = async (updatedValue) => {
    await this.setState({
      currentValue: updatedValue,
    })
    if (this.props.onChange) {
      await this.props.onChange(updatedValue)
    }
  }
  onChangePrimary = (index) => {
    this.state.currentValue.forEach(
      (item, cIndex) => (item.isPrimary = index === cIndex)
    )
    this.triggerChange([...this.state.currentValue])
  }

  changeValue = async (value, index) => {
    const updatedValue = [...this.state.currentValue]
    updatedValue[index].userTenantId = value
    updatedValue[index].userTenant = {
      id: value,
      name: this.state.listOccupier?.find((item) => item?.id === value)?.label,
    }
    this.triggerChange(updatedValue)
  }

  addNewItem = async (isPrimary?) => {
    this.triggerChange([
      ...this.state.currentValue,
      new OccupierModel(undefined, isPrimary ?? false),
    ])
  }
  deleteItem = async (value, index) => {
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
        <Row gutter={[4, 8]}>
          {(currentValue || []).map((item, index) => (
            <Col {...{ span: 22 }} key={index}>
              <Row gutter={[4, 8]}>
                <Col sm={{ span: 20, offset: 0 }}>
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    style={{ width: "100%" }}
                    disabled={this.props.disabled}
                    value={item?.userTenantId}
                    showSearch
                    onSearch={debounce((e) => this.getOccupier(e), 400)}
                    filterOption={false}
                    onChange={(e) => this.changeValue(e, index)}
                  >
                    {renderOptions(this.state.listOccupier)}
                  </Select>
                </Col>
                <Col sm={{ span: 2, offset: 0 }}>
                  <Button
                    disabled={this.props.disabled}
                    type="dashed"
                    style={{ overflow: "hidden" }}
                    block
                    icon={item.isPrimary ? <StarFilled /> : <StarOutlined />}
                    onClick={() => this.onChangePrimary(index)}
                  ></Button>
                </Col>
                <Col sm={{ span: 2, offset: 0 }}>
                  <Button
                    type="dashed"
                    disabled={this.props.disabled}
                    block
                    icon={<MinusCircleOutlined />}
                    style={{ overflow: "hidden" }}
                    onClick={() => this.deleteItem(item, index)}
                  ></Button>
                </Col>
              </Row>
            </Col>
          ))}
          <Col sm={{ span: 2, offset: 0 }}>
            <Button
              type="dashed"
              disabled={this.props.disabled}
              block
              onClick={() => this.addNewItem(false)}
              icon={<PlusCircleOutlined />}
            ></Button>
          </Col>
        </Row>
      </>
    )
  }
}

export default withRouter(OccupierSelect)
