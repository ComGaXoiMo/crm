import { L } from "@lib/abpUtility"
import { Col, DatePicker, Input, Modal, Row, Select, Table } from "antd"
import React from "react"
import Form from "antd/lib/form"
// import { portalLayouts } from "@components/Layout/Router/router.config";
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import NotificationTemplateStore from "@stores/notificationTemplate/notificationTemplateStore"
import getColumns from "./columns"
import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import AppConsts, { dateFormat } from "@lib/appconst"
import FormSelect from "@components/FormItem/FormSelect"
import _ from "lodash"
import projectService from "@services/projects/projectService"
import unitService from "@services/projects/unitService"
import rules from "./validations"
import { filterOptions } from "@lib/helper"
import { validateMessages } from "@lib/validation"
const { proposalType, listProposalType, notifiType } = AppConsts

interface Props {
  id: any;
  history: any;
  visible: boolean;
  onClose: () => void;
  onOk: (param) => void;
  notificationTemplateStore: NotificationTemplateStore;
  withChooseUnit: boolean;
}

interface State {
  maxResultCount: number;
  skipCount: number;
  filters: any;

  listProject: any[];
  listProjectChoose: any[];
  listUnit: any[];
  selectedItemUnit: any[];
  selectedItemProject: any[];
  proposalType: any;
  dataItemplate: any[];
}
@inject(Stores.NotificationTemplateStore)
@observer
class CreateProposalModal extends AppComponentListBase<Props, State> {
  formRef: any = React.createRef();

  constructor(props) {
    super(props)
    this.state = {
      maxResultCount: 10,
      skipCount: 0,
      filters: { KeyWord: "", isActive: true },
      listProject: [],
      listUnit: [] as any,
      listProjectChoose: [] as any,
      selectedItemProject: [] as any,
      selectedItemUnit: [] as any,
      proposalType: 1,
      dataItemplate: [] as any,
    }
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        await this.getTemplate()
        await this.getDataTemplate(this.state.proposalType)
        if (this.props.withChooseUnit) {
          await this.getProject(""), await this.getUnit("")
        }
      }
    }
  }
  getTemplate = async () => {
    await this.props.notificationTemplateStore.getAllEproposal({
      notificationTypeId: notifiType.proposal,
      ...this.state.filters,
    })
  };
  changeProposalType = (id?) => {
    this.getDataTemplate(id)
    {
      this.setState({ proposalType: id })
    }
  };
  getDataTemplate = (id) => {
    const data = this.props.notificationTemplateStore.eProposalTemplates.filter(
      (item) => item?.notificationTemplate?.groupType === id
    )
    this.setState({ dataItemplate: data })
  };
  gotoCreate = async (templateId?) => {
    const params = await this.formRef.current?.validateFields()
    // const { history } = this.props;
    this.props.onOk({ ...params, templateId })
    // history.push(portalLayouts.proposalCreate.path);
  };

  getProject = async (keyword) => {
    const res = await projectService.getAll({
      pageSize: 10,
      keyword,
      isActive: true,
    })
    const newProjects = res.items.map((i) => {
      return { id: i.id, name: i.projectCode }
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

  handleSelectUnitChange = (selectedItemUnit) => {
    if (selectedItemUnit.length <= 3) {
      this.setState({ selectedItemUnit })
    }
  };

  render(): React.ReactNode {
    const { visible, onClose } = this.props
    const columns = getColumns({
      title: L("TITLE"),
      dataIndex: "notificationTemplate",
      key: "notificationTemplate",
      // ellipsis: false,
      render: (notificationTemplate, item: any) => (
        <Row>
          <Col sm={{ span: 21, offset: 0 }}>
            <a
              onClick={() => {
                Modal.confirm({
                  title: L("CREATE_PROPOSAL_WITH_ThIS_TEMPLATE"),
                  onOk: () => this.gotoCreate(item.notificationTemplate.id),
                })
              }}
              className="link-text-table"
            >
              {notificationTemplate?.subject}
            </a>
          </Col>
        </Row>
      ),
    })
    const {
      notificationTemplateStore: { isLoading },
    } = this.props
    const { dataItemplate } = this.state
    return (
      <Modal
        open={visible}
        destroyOnClose
        width={"45%"}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        title={L("SELECT_PROPOSAL_TYPE")}
        onCancel={() => {
          onClose()
        }}
        confirmLoading={isLoading}
      >
        <Form
          validateMessages={validateMessages}
          layout={"vertical"}
          ref={this.formRef}
          size="middle"
        >
          <Row gutter={[4, 0]}>
            <Col sm={{ span: 24 }}>
              <Col sm={{ span: 24, offset: 0 }}>
                <FormSelect
                  options={listProposalType}
                  rule={rules.required}
                  label={L("PROPOSAL_FOR")}
                  defaultValue={this.state.proposalType}
                  onChange={async (id) => this.changeProposalType(id)}
                  name={["proposalType"]}
                />
              </Col>
              <Form.Item
                rules={rules.required}
                label={L("PROPOSAL_TITLE")}
                name="title"
              >
                <Input placeholder={L("")}></Input>
              </Form.Item>
            </Col>
            <Col sm={{ span: 24 }}>
              <Form.Item
                rules={rules.required}
                label={L("PROPOSAL_DATE")}
                name="proposalDate"
              >
                <DatePicker className="w-100" format={dateFormat} />
              </Form.Item>
            </Col>

            {this.props.withChooseUnit && (
              <>
                <Col sm={{ span: 24, offset: 0 }}>
                  <FormSelect
                    options={this.state.listProject}
                    rule={rules.project}
                    selectProps={{ mode: "multiple" }}
                    label={L("PROJECT_CODE")}
                    onChange={async (ids) => {
                      await this.formRef.current?.resetFields(["unitIds"])
                      await this.getUnit("", ids)
                      this.setState({ listProjectChoose: ids })
                    }}
                    name={["projectIds"]}
                  />
                </Col>
                {this.state.proposalType === proposalType.unit && (
                  <Col sm={{ span: 24 }}>
                    <Form.Item
                      label={L("UNIT")}
                      name="unitIds"
                      rules={[
                        {
                          required: true,
                          message: "Please select at least one item",
                        },
                        {
                          max: 3,
                          type: "array",
                          message: "You can select up to three items",
                        },
                      ]}
                    >
                      <Select
                        className="w-100"
                        mode="multiple"
                        filterOption={filterOptions}
                        onSearch={_.debounce(
                          (e) => this.getUnit(e, this.state.listProjectChoose),
                          600
                        )}
                        allowClear
                        showSearch
                        value={this.state.selectedItemUnit}
                        showArrow
                      >
                        {this.renderOptions(this.state.listUnit)}
                      </Select>
                    </Form.Item>
                  </Col>
                )}
              </>
            )}
            <Col sm={{ span: 24 }}>
              {L("CHOOSE_ONE_TEMPLATE_TO_CREATE_PROPOSAL")}
              <Table
                size="middle"
                className="custom-ant-table"
                // rowKey={(record) => record.id}
                columns={columns}
                loading={isLoading}
                dataSource={dataItemplate ?? []}
                pagination={false}
              />
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}
export default withRouter(CreateProposalModal)
