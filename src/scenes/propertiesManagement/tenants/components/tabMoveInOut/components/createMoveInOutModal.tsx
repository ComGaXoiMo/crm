import { L } from "@lib/abpUtility"
import { Col, DatePicker, Form, Modal, Row, Select } from "antd"
import React from "react"
import { FormInstance } from "antd/lib/form"
// import TextArea from "antd/lib/input/TextArea";
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import projectService from "@services/projects/projectService"
import unitService from "@services/projects/unitService"
import _ from "lodash"
import TenantStore from "@stores/administrator/tenantStore"
import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import tenantService from "@services/administrator/tenant/tenantService"
import UnitStore from "@stores/projects/unitStore"
import { dateFormat } from "@lib/appconst"

interface Props {
  visible: boolean;
  tenantId: any;
  unitId: any;
  tenantStore: TenantStore;
  unitStore: UnitStore;
  onClose: () => void;
  onOk: () => void;
}

interface State {
  listProject: any[];
  listTenant: any[];
  listProjectChoose: any[];
  listUnit: any[];
  isLoading: boolean;
}
@inject(Stores.TenantStore, Stores.UnitStore)
@observer
class CreateMoveInOutModal extends AppComponentListBase<Props, State> {
  form = React.createRef<FormInstance>();

  constructor(props) {
    super(props)
    this.state = {
      listProject: [],
      listTenant: [] as any,
      listUnit: [] as any,
      listProjectChoose: [] as any,
      isLoading: false,
    }
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        if (!this.props.unitId) {
          this.getProject(""), this.getUnit("")
        }
        if (!this.props.tenantId) {
          this.getTenant("")
        }
      }
    }
  }

  getTenant = async (keyword) => {
    const res = await tenantService.getAll({
      pageSize: 10,
      keyword,
      isActive: true,
    })
    const newTenants = res.items.map((i) => {
      return { id: i.id, name: i.name }
    })

    await this.setState({ listTenant: newTenants })
  };
  getProject = async (keyword) => {
    const res = await projectService.getAll({
      pageSize: 10,
      keyword,
      isActive: true,
    })
    const newProjects = res.items.map((i) => {
      return { id: i.id, name: i.projectName }
    })

    await this.setState({ listProject: newProjects })
  };
  getUnit = async (keyword, projectIds?) => {
    const res = await unitService.getAllRes({
      pageSize: 10,
      keyword,
      projectIds,
      isActive: true,
    })
    const newUnit = res.items.map((i) => {
      return { id: i.id, name: `${i.projectCode}-${i.unitName}` }
    })

    await this.setState({ listUnit: newUnit })
  };

  handleOk = async () => {
    await this.setState({ isLoading: true })
    let params = await this.form.current?.validateFields()
    params = {
      userTenantId: this.props.tenantId,
      unitId: this.props.unitId,
      projectId: this.props.unitStore.editUnitRes?.projectId,
      ...params,
    }

    await this.props.tenantStore
      .moveTenantInUnit(params)
      .finally(() => this.setState({ isLoading: false }))
    await this.props.onOk()
  };
  render(): React.ReactNode {
    const { visible, onClose } = this.props

    return (
      this.props.visible && (
        <Modal
          open={visible}
          destroyOnClose
          title={L("NEW_MOVE_IN_OUT")}
          cancelText={L("BTN_CANCEL")}
          onCancel={() => {
            onClose()
          }}
          onOk={this.handleOk}
          confirmLoading={this.state.isLoading}
        >
          <Form
            layout={"vertical"}
            ref={this.form}
            //  onFinish={this.onSave}
            // validateMessages={validateMessages}
            size="middle"
          >
            <Row gutter={[8, 0]}>
              {this.props.tenantId && (
                <>
                  <Col sm={{ span: 24 }}>
                    <Form.Item
                      rules={[{ required: true }]}
                      label={L("PROJECT")}
                      name="projectId"
                    >
                      <Select
                        placeholder={L("")}
                        onChange={async (ids) => {
                          await this.form.current?.resetFields(["unitId"])
                          await this.getUnit("", ids)
                          this.setState({ listProjectChoose: ids })
                        }}
                      >
                        {this.renderOptions(this.state.listProject)}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 24 }}>
                    <Form.Item
                      rules={[{ required: true }]}
                      label={L("UNIT")}
                      name="unitId"
                    >
                      <Select
                        placeholder={L("")}
                        onSearch={_.debounce(
                          (e) => this.getUnit(e, this.state.listProjectChoose),
                          600
                        )}
                      >
                        {this.renderOptions(this.state.listUnit)}
                      </Select>
                    </Form.Item>
                  </Col>
                </>
              )}
              {this.props.unitId && (
                <>
                  <Col sm={{ span: 24 }}>
                    <Form.Item
                      rules={[{ required: true }]}
                      label={L("TENANT")}
                      name="userTenantId"
                    >
                      <Select
                        placeholder={L("")}
                        onSearch={_.debounce((e) => this.getTenant(e), 300)}
                      >
                        {this.renderOptions(this.state.listTenant)}
                      </Select>
                    </Form.Item>
                  </Col>
                </>
              )}
              <Col sm={{ span: 24 }}>
                <Form.Item
                  rules={[{ required: true }]}
                  label={L("MOVE_IN")}
                  name="moveInDate"
                >
                  <DatePicker className="w-100" format={dateFormat} />
                </Form.Item>
              </Col>

              {/* <Col sm={{ span: 24 }}>
                <Form.Item label={L("NOTE")} name="note">
                  <TextArea placeholder={L("")}></TextArea>
                </Form.Item>
              </Col> */}
            </Row>
          </Form>
        </Modal>
      )
    )
  }
}
export default withRouter(CreateMoveInOutModal)
