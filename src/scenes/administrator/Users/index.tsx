import * as React from "react"

import { Col, Dropdown, Input, Menu, Modal, Row, Table } from "antd"
import { MoreOutlined } from "@ant-design/icons"
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

const { align } = AppConsts

export interface IUserProps {
  userStore: UserStore
}

export interface IUserState {
  modalVisible: boolean
  maxResultCount: number
  skipCount: number
  userId: number
  filter: string
}

const confirm = Modal.confirm
const Search = Input.Search

@inject(Stores.UserStore)
@observer
class User extends AppComponentListBase<IUserProps, IUserState> {
  formRef: any = React.createRef()

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    userId: 0,
    filter: "",
  }

  get currentPage() {
    return Math.floor(this.state.skipCount / this.state.maxResultCount) + 1
  }

  async componentDidMount() {
    await this.getAll()
  }

  async getAll() {
    await this.props.userStore.getAll({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      keyword: this.state.filter,
    })
  }

  handleTableChange = (pagination: any) => {
    this.setState(
      { skipCount: (pagination.current - 1) * this.state.maxResultCount! },
      async () => await this.getAll()
    )
  }

  Modal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    })
  }

  createOrUpdateModalOpen = async (entityDto: EntityDto) => {
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
    })
  }

  delete(input: EntityDto) {
    const self = this
    confirm({
      title: LNotification("DO_YOU_WANT_TO_DEACTIVATE_THIS_ITEM"),
      okText: L("BTN_YES"),
      cancelText: L("BTN_NO"),
      onOk() {
        self.props.userStore.delete(input)
      },
      onCancel() {
        console.log("BTN_CANCEL")
      },
    })
  }

  handleCreate = () => {
    const form = this.formRef.current

    form.validateFields().then(async (values: any) => {
      if (this.state.userId === 0) {
        await this.props.userStore.create(values)
      } else {
        await this.props.userStore.update({ id: this.state.userId, ...values })
      }

      await this.getAll()
      this.setState({ modalVisible: false })
      form.resetFields()
    })
  }

  updateSearch = debounce((event) => {
    this.setState({ filter: event.target?.value })
  }, 100)

  handleSearch = (value: string) => {
    this.setState(
      { filter: value, skipCount: 0 },
      async () => await this.getAll()
    )
  }

  renderFilterComponent = () => {
    const keywordPlaceHolder = `${this.L("FULL_NAME")}, ${this.L(
      "EMAIL_ADDRESS"
    )}, ${this.L("USER_NAME")}`
    return (
      <Row gutter={[8, 8]}>
        <Col sm={{ span: 8, offset: 0 }}>
          <Search
            placeholder={keywordPlaceHolder}
            onChange={this.updateSearch}
            onSearch={this.handleSearch}
          />
        </Col>
      </Row>
    )
  }

  public render() {
    const { users } = this.props.userStore
    const columns = getColumns({
      title: L("ACTIONS"),
      dataIndex: "operation",
      key: "operation",
      fixed: align.right,
      align: align.right,
      width: 90,
      render: (text: string, item: any) => (
        <div>
          <Dropdown
            trigger={["click"]}
            overlay={
              <Menu>
                {this.isGranted(appPermissions.staff.update) && (
                  <Menu.Item
                    onClick={() =>
                      this.createOrUpdateModalOpen({ id: item.id })
                    }
                  >
                    {L("BTN_EDIT")}
                  </Menu.Item>
                )}
                {this.isGranted(appPermissions.staff.delete) && (
                  <Menu.Item onClick={() => this.delete({ id: item.id })}>
                    {L(item.isActive ? "BTN_DEACTIVATE" : "BTN_ACTIVATE")}
                  </Menu.Item>
                )}
              </Menu>
            }
            placement="bottomLeft"
          >
            <MoreOutlined />
          </Dropdown>
        </div>
      ),
    })

    return (
      <>
        <DataTable
          title={this.L("USER_LIST")}
          onCreate={() => this.createOrUpdateModalOpen({ id: 0 })}
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
            className=""
            rowKey={(record) => record.id.toString()}
            columns={columns}
            pagination={false}
            loading={this.props.userStore.isLoading}
            dataSource={users === undefined ? [] : users.items}
          />
        </DataTable>
        <CreateOrUpdateUser
          formRef={this.formRef}
          visible={this.state.modalVisible}
          onCancel={() =>
            this.setState({
              modalVisible: false,
            })
          }
          modalType={this.state.userId === 0 ? "edit" : "create"}
          onCreate={this.handleCreate}
          roles={this.props.userStore.roles}
        />
      </>
    )
  }
}

export default User
