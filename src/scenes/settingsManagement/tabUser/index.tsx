import * as React from "react"

import {
  Button,
  Col,
  Dropdown,
  Input,
  Menu,
  Modal,
  Row,
  Select,
  Table,
} from "antd"
import {
  MoreOutlined,
  PlusCircleFilled,
  ReloadOutlined,
} from "@ant-design/icons"
import { inject, observer } from "mobx-react"

import { AppComponentListBase } from "../../../components/AppComponentBase"
import CreateOrUpdateUser from "./components/createOrUpdateUser"
import { EntityDto } from "@services/dto/entityDto"
import { L, LNotification } from "@lib/abpUtility"
import Stores from "../../../stores/storeIdentifier"
import UserStore from "../../../stores/administrator/userStore"
import DataTable from "../../../components/DataTable"
import AppConsts, { appPermissions } from "../../../lib/appconst"
import debounce from "lodash/debounce"
import getColumns from "./columns"
import withRouter from "@components/Layout/Router/withRouter"
import { renderDotActive, renderOptions } from "@lib/helper"
import ResetPasswordFormModal from "@components/Modals/ResetPassword"
import ProjectStore from "@stores/projects/projectStore"
// import { ExcelIcon } from "@components/Icon";
const { activeStatus } = AppConsts
export interface IUserProps {
  userStore: UserStore;
  projectStore: ProjectStore;
  listRoleFilter: any;
}

export interface IUserState {
  modalVisible: boolean;
  modalResetPasswordVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  userId: any;
  staffId?: number;
  filter: any;
}

const confirm = Modal.confirm
const Search = Input.Search

@inject(Stores.UserStore, Stores.ProjectStore)
@observer
class User extends AppComponentListBase<IUserProps, IUserState> {
  formRef: any = React.createRef();

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    userId: undefined,
    staffId: 0,
    modalResetPasswordVisible: false,
    filter: { isActive: true } as any,
  };

  get currentPage() {
    return Math.floor(this.state.skipCount / this.state.maxResultCount) + 1
  }

  async componentDidMount() {
    await this.props.projectStore.getSimpleProject()
    await this.getAll()
  }

  async getAll() {
    await this.props.userStore.getAll({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      ...this.state.filter,
    })
  }

  handleTableChange = (pagination: any) => {
    this.setState(
      {
        skipCount: (pagination.current - 1) * this.state.maxResultCount!,
        maxResultCount: pagination.pageSize,
      },
      async () => await this.getAll()
    )
  };

  Modal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    })
  };

  createOrUpdateModalOpen = async (entityDto: EntityDto) => {
    await this.props.userStore.getTeam("")
    if (entityDto.id === 0) {
      await this.props.userStore.createUser()
    } else {
      await this.props.userStore.get(entityDto)
    }
    await this.props.userStore.getRoles()

    this.setState({ userId: entityDto.id })
    this.Modal()
    this.formRef.current.setFieldsValue({
      ...this.props.userStore.editUser,
      roleNames: this.props.userStore.editUser.roleNames,
      // userToOrganizationUnit:
      //   this.props.userStore.editUser?.userOrganizationUnit.map(
      //     (item) => item.organizationUnitId
      //   ),
      ProjectIds: this.props.userStore.editUser?.projectUser.map(
        (item) => item.projectId
      ),
    })
  };
  showChangePasswordModal = (id) => {
    this.setState({ staffId: id, modalResetPasswordVisible: true })
  };
  handleSendRequest = async (id) => {
    await this.props.userStore.sendRequestPassword(id)
  };
  activateOrDeactivate = async (id: number, isActive) => {
    const self = this
    confirm({
      title: LNotification(
        isActive
          ? "DO_YOU_WANT_TO_ACTIVATE_THIS_ITEM"
          : "DO_YOU_WANT_TO_DEACTIVATE_THIS_ITEM"
      ),
      okText: L("BTN_YES"),
      cancelText: L("BTN_NO"),
      onOk: async () => {
        await self.props.userStore.activateOrDeactivate(id, isActive)
        self.handleTableChange({ current: 1, pageSize: 10 })
      },
    })
  };
  handleCreate = (listTeam) => {
    const form = this.formRef.current
    form.validateFields().then(async (values: any) => {
      if (this.state.userId === 0) {
        await this.props.userStore.create({
          ...values,
          userToOrganizationUnit: listTeam,
        })
      } else {
        await this.props.userStore.update({
          ...values,
          id: this.state.userId,
          userToOrganizationUnit: listTeam,
        })
      }

      await this.getAll()
    })
  };

  updateSearch = debounce((name, value) => {
    const { filter } = this.state
    this.setState({ filter: { ...filter, [name]: value } })
    if (value?.length === 0) {
      this.handleSearch("keyword", value)
    }
  }, 100);

  handleSearch = (name, value) => {
    const { filter } = this.state
    this.setState(
      { filter: { ...filter, [name]: value }, skipCount: 0 },
      async () => await this.getAll()
    )
  };

  renderFilterComponent = () => {
    const { filter } = this.state
    const keywordPlaceHolder = `${this.L("FULL_NAME")}, ${this.L(
      "EMAIL_ADDRESS"
    )}, ${this.L("USER_NAME")}`
    return (
      <Row gutter={[8, 8]}>
        <Col sm={{ span: 6, offset: 0 }}>
          <Search
            placeholder={keywordPlaceHolder}
            onChange={(value) =>
              this.updateSearch("keyword", value.target?.value)
            }
            onSearch={(value) => this.handleSearch("keyword", value)}
          />
        </Col>
        <Col sm={{ span: 3, offset: 0 }}>
          <Select
            getPopupContainer={(trigger) => trigger.parentNode}
            placeholder={L("ROLE")}
            style={{ width: "100%" }}
            allowClear
            value={filter.sourceName}
            onChange={(value) => this.handleSearch("roleId", value)}
            // showSearch
          >
            {renderOptions(this.props.listRoleFilter)}
          </Select>
        </Col>
        {/* <Col sm={{ span: 3, offset: 0 }}>
            <Select
                      getPopupContainer={(trigger) => trigger.parentNode}           placeholder={L("TEAM")}
            style={{ width: "100%" }}
            allowClear
            onChange={(value) => this.handleSearch("teamId", value)}
            // showSearch
          >
            {renderOptions(this.listTeam)}
          </Select>
        </Col> */}
        <Col sm={{ span: 3, offset: 0 }}>
          <Select
            getPopupContainer={(trigger) => trigger.parentNode}
            placeholder={L("STATUS")}
            defaultValue="true"
            style={{ width: "100%" }}
            allowClear
            onChange={(value) => this.handleSearch("isActive", value)}
          >
            {renderOptions(activeStatus)}
          </Select>
        </Col>
        {this.isGranted(appPermissions.staff.create) && (
          <div style={{ position: "absolute", display: "flex", right: 10 }}>
            {/*  <Tooltip title={L("EXPORT_EXCEL")} placement="topLeft">
            <Button
              icon={<ExcelIcon />}
              className="button-primary"
              onClick={() => {}}
            ></Button></Tooltip> */}
            <Button
              icon={<PlusCircleFilled />}
              className="button-primary"
              onClick={() => this.createOrUpdateModalOpen({ id: 0 })}
            ></Button>
            <Button
              icon={<ReloadOutlined />}
              className="button-primary"
              onClick={() => this.getAll()}
            ></Button>
          </div>
        )}
      </Row>
    )
  };

  public render() {
    const { users, roles, teams, isLoading } = this.props.userStore
    const columns = getColumns({
      title: L("FULL_NAME"),
      dataIndex: "displayName",
      key: "displayName",
      width: 300,
      ellipsis: false,

      render: (displayName: string, item: any) => (
        <Row>
          <Col sm={{ span: 21, offset: 0 }}>
            <a
              onClick={
                this.isGranted(appPermissions.staff.detail)
                  ? () => this.createOrUpdateModalOpen({ id: item.id })
                  : () => console.log("Not permission")
              }
              className="link-text-table"
            >
              {renderDotActive(item.isActive)} {displayName}
            </a>
          </Col>
          <Col sm={{ span: 3, offset: 0 }}>
            <Dropdown
              trigger={["click"]}
              overlay={
                <Menu>
                  {this.isGranted(appPermissions.staff.update) && (
                    <>
                      <Menu.Item
                        key="1"
                        onClick={() => this.showChangePasswordModal(item.id)}
                      >
                        {L("RESET_PASSWORD")}
                      </Menu.Item>
                      {/* <Menu.Item
                        key="2"
                        onClick={() => this.handleSendRequest(item.id)}
                      >
                        {L("SEND_REQUEST_PASSWORD")}
                      </Menu.Item> */}
                    </>
                  )}

                  {this.isGranted(appPermissions.staff.delete) && (
                    <Menu.Item
                      key="3"
                      onClick={() =>
                        this.activateOrDeactivate(item.id, !item.isActive)
                      }
                    >
                      {L(item.isActive ? "BTN_DEACTIVATE" : "BTN_ACTIVATE")}
                    </Menu.Item>
                  )}
                </Menu>
              }
              placement="bottomLeft"
            >
              <button className="button-action-hiden-table-cell">
                <MoreOutlined />
              </button>
            </Dropdown>
          </Col>
        </Row>
      ),
    })

    return (
      <>
        <DataTable
          title={this.L("USER_LIST")}
          pagination={{
            pageSize: this.state.maxResultCount,
            current: this.currentPage,
            total: users === undefined ? 0 : users.totalCount,
            onChange: this.handleTableChange,
          }}
          filterComponent={this.renderFilterComponent()}
        >
          <Table
            size="middle"
            className="custom-ant-row"
            bordered
            rowKey={(record) => `${record.id}${record?.emailAddress}`}
            columns={columns}
            pagination={false}
            loading={this.props.userStore.isLoading}
            scroll={{ x: 800, y: 600, scrollToFirstRowOnChange: true }}
            dataSource={users === undefined ? [] : users.items}
          />
        </DataTable>
        <CreateOrUpdateUser
          formRef={this.formRef}
          visible={this.state.modalVisible}
          onCancel={() => {
            this.setState({
              modalVisible: false,
            })
            this.getAll()
          }}
          userId={this.state.userId}
          onCreate={this.handleCreate}
          roles={roles}
          teams={teams}
          isLoading={isLoading}
          userOrganizationUnit={
            this.props.userStore.editUser?.userOrganizationUnit
          }
        />
        <ResetPasswordFormModal
          visible={this.state.modalResetPasswordVisible}
          userId={this.state.staffId}
          onCancel={() =>
            this.setState({
              modalResetPasswordVisible: false,
              staffId: 0,
            })
          }
        />
      </>
    )
  }
}

export default withRouter(User)
