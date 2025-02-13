import * as React from "react"

import {
  Checkbox,
  Input,
  Tabs,
  Form,
  Col,
  Row,
  Card,
  Table,
  Divider,
} from "antd"
import { GetRoles } from "@services/administrator/user/dto/getRolesOuput"
import { L } from "@lib/abpUtility"
import rules from "./createOrUpdateUser.validation"
import AppConsts, { appPermissions } from "@lib/appconst"
import CustomDrawer from "@components/Drawer/CustomDrawer"
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import TransferModal from "./transferModal"
// import SystemHistoryColumn from "@components/DataTable/sysyemColumn";
import projectService from "@services/projects/projectService"
import _ from "lodash"
import { GetTeams } from "@services/administrator/user/dto/getTeamsOutput"
import { validateMessages } from "@lib/validation"
import type { CheckboxChangeEvent } from "antd/es/checkbox"
import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import ProjectStore from "@stores/projects/projectStore"
import UserStore from "@stores/administrator/userStore"
const { align, formVerticalLayout } = AppConsts
const TabPane = Tabs.TabPane
const tabKeys = {
  tabInfo: "TAB_INFO",
}
export interface Props {
  visible: boolean;
  onCancel: () => void;
  userId: any;
  onCreate: (data) => void;
  roles: GetRoles[];
  formRef: any;
  teams: any;
  isLoading: boolean;
  userOrganizationUnit: any;
  projectStore: ProjectStore;
  userStore: UserStore;
}
@inject(Stores.ProjectStore, Stores.UserStore)
@observer
class CreateOrUpdateUser extends AppComponentListBase<Props> {
  state = {
    confirmDirty: false,
    tabActiveKey: tabKeys.tabInfo,
    isEdit: false,
    modalVisible: false,
    listProject: [],
    objCreate: [] as any,
    selectedRowKeys: [],
    listLead: [] as any,
  };

  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible === true) {
        const leads = await this.props.userOrganizationUnit.filter(
          (item) => item.isHead === true
        )
        if (this.props.userId === 0) {
          this.setState({ isEdit: true })
        } else {
          this.setState({ isEdit: false })
          if (this.props.visible) {
            await this.setState({
              selectedRowKeys: this.props.userOrganizationUnit.map(
                (item) => item.organizationUnitId
              ),
              listLead: leads.map((item) => {
                if (item.isHead === true) {
                  return item.organizationUnitId
                }
              }),
            })
            this.getProject("")
          }
        }
      } else {
        this.setState({ listLead: [] })
      }
    }
  }

  buildDisplayName = async () => {
    const name =
      (await this.props.formRef.current.getFieldValue("emailAddress")) || ""
    const before = name.split("@")[0]

    await this.props.formRef.current.setFieldValue("userName", before)
  };

  compareToFirstPassword = (rule: any, value: any, callback: any) => {
    const form = this.props.formRef.current
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!")
    } else {
      callback()
    }
  };

  validateToNextPassword = (rule: any, value: any, callback: any) => {
    const form = this.props.formRef.current
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true })
    }
    callback()
  };
  changeTab = (tabKey: string) => {
    this.setState({
      tabActiveKey: tabKey,
    })
  };
  onEdit = async () => {
    this.setState({ isEdit: true })
  };
  toggleModal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    })
  };
  handleTransfer = () => {
    this.toggleModal()
  };
  handleTransferSave = () => {
    this.toggleModal()
  };
  getProject = async (keyword) => {
    const res = await projectService.getAll({
      maxResultCount: 10,
      skipCount: 0,
      keyword,
      isActive: true,
    })
    const newProjects = res.items.map((i) => {
      return { id: i.id, name: i.projectCode }
    })
    this.setState({ listProject: newProjects })
  };
  onCancel = () => {
    this.props.formRef.current.resetFields()
    this.setState({ selectedRowKeys: [], listLead: [] })
    this.props.onCancel()
  };
  onSave = async () => {
    const res = await this.state.selectedRowKeys.map((item) => {
      const checkIsHead = this.state.listLead.find((lead) => lead === item)
      if (checkIsHead) {
        return { organizationUnitId: item, isHead: true }
      } else {
        return { organizationUnitId: item, isHead: false }
      }
    })
    await this.setState({
      objCreate: [...res],
    })

    await this.props.onCreate(this.state.objCreate)
    this.setState({ isEdit: false })
  };
  onSelectChange = async (newSelectedRowKeys) => {
    await this.setState({ selectedRowKeys: newSelectedRowKeys })
  };
  render() {
    const { roles, teams } = this.props
    const { visible } = this.props
    const {
      // displayNames,

      isEdit,
    } = this.state

    const options = roles.map((x: GetRoles) => {
      return { label: x.name, value: x.normalizedName }
    })
    const listTeam = teams.map((item: GetTeams) => {
      // return { label: item.displayName, value: item.id };
      return {
        teamName: item.displayName,
        value: item.id,
        isHead: item.isHead,
      }
    })

    const columnsTeam = [
      {
        title: L("TEAM_NAME"),
        dataIndex: "teamName",
        key: "teamName",
        ellipsis: false,
        render: (teamName, row) => <>{teamName}</>,
      },
      {
        title: L(""),
        dataIndex: "isHead",
        key: "isHead",
        ellipsis: false,
        width: 200,
        align: align.center,
        render: (isHead, row) => (
          <>
            {this.state.selectedRowKeys.find((item) => item === row?.value) && (
              <Checkbox
                disabled={!isEdit}
                checked={this.state.listLead.find(
                  (lead) => lead === row?.value
                )}
                onChange={(e: CheckboxChangeEvent) => {
                  if (e.target.checked) {
                    this.setState({
                      listLead: _.union([...this.state.listLead, row?.value]),
                    })
                  } else {
                    _.remove(this.state.listLead, function (n) {
                      return n === row.value
                    })
                    this.setState({
                      listLead: _.union([...this.state.listLead]),
                    })
                  }
                }}
              >
                {L("IS_HEAD")}
              </Checkbox>
            )}
          </>
        ),
      },
    ]

    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
      hideSelectAll: true,
    }
    return (
      <CustomDrawer
        useBottomAction
        visible={visible}
        onClose={this.onCancel}
        onCreate={this.props.userId === 0 ? () => this.onSave() : undefined}
        onEdit={this.props.userId === 0 ? undefined : this.onEdit}
        onSave={this.props.userId === 0 ? undefined : () => this.onSave()}
        title={this.props.userStore.editUser?.name ?? "NEW"}
        isEdit={this.state.isEdit}
        updatePermission={this.isGranted(appPermissions.staff.update)}
        isLoading={this.props.isLoading}
      >
        <Form
          ref={this.props.formRef}
          validateMessages={validateMessages}
          layout="vertical"
          size="middle"
        >
          <Tabs
            className={"antd-tab-cusstom h-100"}
            defaultActiveKey={"userInfo"}
            onTabClick={this.changeTab}
            type="card"
          >
            <TabPane tab={"User"} key={"user"}>
              <Card className="card-detail-modal">
                <Row gutter={[16, 0]}>
                  <Col sm={{ span: 24, offset: 0 }}>
                    <Form.Item
                      label={L("STAFF_FULL_NAME")}
                      {...formVerticalLayout}
                      name="displayName"
                      rules={rules.displayName}
                    >
                      <Input disabled={!isEdit} />
                    </Form.Item>
                  </Col>

                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("EMAIL")}
                      {...formVerticalLayout}
                      name="emailAddress"
                      rules={rules.emailAddress}
                    >
                      <Input
                        onChange={this.buildDisplayName}
                        disabled={!isEdit}
                        autoComplete="off"
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("PHONE_NUMBER")}
                      {...formVerticalLayout}
                      name="phoneNumber"
                      rules={rules.phoneNumber}
                    >
                      <Input disabled={!isEdit} />
                    </Form.Item>
                  </Col>
                  {/* <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("UserName")}
                      {...formVerticalLayout}
                      name="userName"
                      rules={rules.userName}
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col> */}

                  {this.props.userId === 0 ? (
                    <Col sm={{ span: 12, offset: 0 }}>
                      <Form.Item
                        label={L("Password")}
                        {...formVerticalLayout}
                        name="password"
                        rules={[
                          {
                            required: true,
                            message: "Please input your password!",
                          },
                          {
                            validator: this.validateToNextPassword,
                          },
                        ]}
                      >
                        <Input.Password disabled={!isEdit} />
                      </Form.Item>
                    </Col>
                  ) : null}
                  {this.props.userId === 0 ? (
                    <Col sm={{ span: 12, offset: 0 }}>
                      <Form.Item
                        label={L("ConfirmPassword")}
                        {...formVerticalLayout}
                        name="confirm"
                        rules={[
                          {
                            required: true,
                            message: L("ConfirmPassword"),
                          },
                          {
                            validator: this.compareToFirstPassword,
                          },
                        ]}
                      >
                        <Input.Password disabled={!isEdit} />
                      </Form.Item>
                    </Col>
                  ) : null}
                  <Divider
                    orientation="left"
                    orientationMargin="0"
                    style={{ fontWeight: 600 }}
                  >
                    {L("USER_ROLE_AND_TEAM")}
                  </Divider>

                  <Col sm={{ span: 12 }}>
                    <Table
                      className="customdrawer-table"
                      rowKey={(record) => record.value}
                      rowSelection={rowSelection}
                      rowClassName={!isEdit ? "disabled-row" : ""}
                      pagination={false}
                      columns={columnsTeam}
                      dataSource={listTeam ?? []}
                    />
                  </Col>
                  <Col sm={{ span: 12, offset: 0 }}>
                    <Form.Item
                      label={L("ROLE")}
                      {...formVerticalLayout}
                      name="roleNames"
                    >
                      <Checkbox.Group>
                        <Row>
                          {(options || []).map((item, index) => (
                            <Col span={12} key={index}>
                              <Checkbox disabled={!isEdit} value={item.value}>
                                {item.label}
                              </Checkbox>
                            </Col>
                          ))}
                        </Row>
                      </Checkbox.Group>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </TabPane>
          </Tabs>
        </Form>

        <style>{`
        .disabled-row{
          background-color: #dddddd4b;
          pointer-events: none;
        }
        .ant-col label{
          width: fit-content !important;
        }
        `}</style>
        <TransferModal
          visible={this.state.modalVisible}
          onClose={() =>
            this.setState({
              modalVisible: false,
            })
          }
          onOk={() => this.handleTransferSave()}
        />
      </CustomDrawer>
    )
  }
}

export default withRouter(CreateOrUpdateUser)
