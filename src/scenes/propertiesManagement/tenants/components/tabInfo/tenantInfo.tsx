import React from "react"
import Form from "antd/lib/form"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import { L } from "@lib/abpUtility"
import { Row, Col, Input, Select } from "antd"
import { validateMessages } from "@lib/validation"
import rules from "../validation"
import { filterOptions, renderOptions } from "@lib/helper"
import AppDataStore from "@stores/appDataStore"
import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import { GENDERS } from "@lib/appconst"
interface Props {
  appDataStore: AppDataStore
  formRef: any
  isEdit: any
}
@inject(Stores.AppDataStore)
@observer
class TenantInfo extends AppComponentListBase<Props, any> {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render(): React.ReactNode {
    const {
      appDataStore: { nationality },
    } = this.props
    return (
      <>
        <Form
          ref={this.props.formRef}
          disabled={!this.props.isEdit}
          layout={"vertical"}
          validateMessages={validateMessages}
          size="middle"
        >
          <Row gutter={[16, 0]}>
            <Col sm={{ span: 3 }}>
              <Form.Item
                label={L("CONTACT_GENDER")}
                name="gender"
                rules={[{ required: true }]}
              >
                <Select
                  disabled={!this.props.isEdit}
                  allowClear
                  filterOption={false}
                  className="full-width"
                >
                  {renderOptions(GENDERS)}
                </Select>
              </Form.Item>
            </Col>
            <Col sm={{ span: 9 }}>
              <Form.Item
                label={L("TEMANT_NAME")}
                name="name"
                rules={rules.name}
              >
                <Input
                  disabled={!this.props.isEdit}
                  placeholder={L("")}
                ></Input>
              </Form.Item>
            </Col>{" "}
            <Col sm={{ span: 12 }}>
              <Form.Item
                label={L("PASSPORT")}
                name="passport"
                rules={rules.passport}
              >
                <Input
                  disabled={!this.props.isEdit}
                  placeholder={L("")}
                ></Input>
              </Form.Item>
            </Col>
            <Col sm={{ span: 8 }}>
              <Form.Item
                label={L("CONTACT_NATIONALITY")}
                name="nationalityId"
                rules={[{ required: true }]}
              >
                <Select
                  showSearch
                  allowClear
                  filterOption={filterOptions}
                  className="full-width"
                  disabled={!this.props.isEdit}
                >
                  {renderOptions(nationality)}
                </Select>
              </Form.Item>
            </Col>
            <Col sm={{ span: 8 }}>
              <Form.Item
                label={L("TENANT_PHONE")}
                name="phone"
                rules={rules.phone}
              >
                <Input disabled={!this.props.isEdit} />
              </Form.Item>
            </Col>
            <Col sm={{ span: 8 }}>
              <Form.Item
                label={L("TENANT_EMAIL")}
                name="emailAddress"
                rules={rules.email}
              >
                <Input disabled={!this.props.isEdit} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </>
    )
  }
}
export default withRouter(TenantInfo)
