import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import Stores from "@stores/storeIdentifier"
import FileStore from "@stores/common/fileStore"
import withRouter from "@components/Layout/Router/withRouter"
import DataTable from "@components/DataTable"
import gettColumns from "./column"
import { Button, Col, Dropdown, Menu, Modal, Row, Table } from "antd"
import ContactStore from "@stores/clientManagement/contactStore"
import { L, LNotification } from "@lib/abpUtility"
import { renderDateTime, renderDotActive } from "@lib/helper"
import { CloseCircleFilled, MoreOutlined } from "@ant-design/icons"
import AppConsts from "@lib/appconst"
import AddUserModal from "./components/addUserModal"
const confirm = Modal.confirm

const { align } = AppConsts
export interface IAssociatePartyProps {
  contactStore: ContactStore
  fileStore: FileStore
  contactId: any

  keyTab: any
  tabKeyChoose: any
}
export interface IAssociatePartyState {
  modalVisible: boolean
  maxResultCount: number
  skipCount: number
  requestMaxResultCount: number
  requestSkipCount: number
  filters: any
  contactId: any
  contactTable: any
}

@inject(Stores.ContactStore)
@observer
class AssociateParty extends AppComponentListBase<
  IAssociatePartyProps,
  IAssociatePartyState
> {
  formRef: any = React.createRef()

  constructor(props: IAssociatePartyProps) {
    super(props)
    this.state = {
      modalVisible: false,
      maxResultCount: 10,
      skipCount: 0,
      requestMaxResultCount: 10,
      requestSkipCount: 0,
      filters: {
        isActive: true,
      },
      contactId: undefined,
      contactTable: {} as any,
    }
  }

  async componentDidMount() {
    await Promise.all([])
    this.initData()
    this.initDataRequest()
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.tabKeyChoose !== this.props.tabKeyChoose) {
      if (this.props.tabKeyChoose === this.props.keyTab) {
        this.initData()
        this.initDataRequest()
      }
    }
  }

  handleTableChange = (pagination: any) => {
    this.setState(
      {
        skipCount: (pagination.current - 1) * this.state.maxResultCount!,
        maxResultCount: pagination.pageSize,
      },

      async () => await this.initData()
    )
  }
  handleTableRequestChange = (pagination: any) => {
    this.setState(
      {
        requestSkipCount:
          (pagination.current - 1) * this.state.requestMaxResultCount!,
        requestMaxResultCount: pagination.pageSize,
      },
      async () => await this.initDataRequest()
    )
  }
  initData = async () => {
    const { editContact } = this.props.contactStore
    await this.props.contactStore.getListContactShare({
      contactId: this.props.contactId,
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      ...this.state.filters,
    })

    const listContact = { ...this.props.contactStore.listShareContact }
    listContact.items?.unshift({
      id: editContact?.creatorUserId,
      user: editContact?.creatorUser,
      approvedDate: editContact?.creationTime,
      isOwner: true,
      isActive: true,
    })
    listContact.totalCount++
    this.setState({ contactTable: listContact })
  }
  initDataRequest = () => {
    this.props.contactStore.getListContactRequest({
      contactId: this.props.contactId,
      maxResultCount: this.state.requestMaxResultCount,
      skipCount: this.state.requestSkipCount,
      ...this.state.filters,
    })
  }
  approveRequest = async (id: number) => {
    const self = this
    confirm({
      title: LNotification("DO_YOU_WANT_TO_APPROVE_FOR_THIS_USER"),
      okText: L("BTN_YES"),
      cancelText: L("BTN_NO"),
      onOk: async () => {
        await self.props.contactStore.approveShare({ id })
        await this.initDataRequest()

        self.handleTableChange({ current: 1, pageSize: 10 })
      },
    })
  }
  rejectRequest = async (id: number) => {
    const self = this
    confirm({
      title: LNotification("DO_YOU_WANT_TO_REJECT_FOR_THIS_USER"),
      okText: L("BTN_YES"),
      cancelText: L("BTN_NO"),
      onOk: async () => {
        await self.props.contactStore.rejectShare({ id })
        self.handleTableChange({ current: 1, pageSize: 10 })
        await this.initDataRequest()
      },
    })
  }
  removeUser = async (id: number) => {
    const self = this
    confirm({
      title: LNotification("DO_YOU_WANT_TO_REMOVE_THIS_USER"),
      okText: L("BTN_YES"),
      cancelText: L("BTN_NO"),
      onOk: async () => {
        await self.props.contactStore.rejectShare({ id })
        self.handleTableChange({ current: 1, pageSize: 10 })
      },
    })
  }
  handleFilterChange = async (filters) => {
    await this.setState({ filters }, (this.initData, this.initDataRequest))
  }
  toggleModal = () =>
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }))

  handleOk = async () => {
    const formValues = await this.formRef.current?.validateFields()
    const res = {
      ...formValues,
      contactId: this.props.contactId,
    }

    await this.props.contactStore.createRequestShareByHead(res)
    await this.toggleModal()
    await this.initData()
    await this.initDataRequest()
  }
  public render() {
    const {
      contactStore: { listContactRequest, isLoading, editContact },
    } = this.props
    const { contactTable } = this.state
    const columns = [
      {
        title: L("SHARE_STAFF_NAME"),
        dataIndex: "user",
        key: "user",
        width: 250,
        ellipsis: false,
        render: (user: any, item: any) => (
          <div className="flex gap-1">
            {" "}
            {renderDotActive(item.isActive)} {user?.displayName}
          </div>
        ),
      },
      {
        title: L("MINING_TIME"),
        dataIndex: "approvedDate",
        key: "approvedDate",
        ellipsis: false,
        render: renderDateTime,
      },
      {
        title: L(""),
        dataIndex: "action",
        // key: "a",
        width: 80,
        ellipsis: false,
        align: align.center,
        render: (_: any, record: any) => {
          return (
            <span>
              {record?.isOwner ? (
                <>{L("OWNER")}</>
              ) : (
                <Button
                  type="text"
                  icon={<CloseCircleFilled style={{ color: "red" }} />}
                  onClick={() => this.removeUser(record.id)}
                />
              )}
            </span>
          )
        },
      },
    ]

    const columnsRequest = gettColumns({
      title: L("SHARE_STAFF_NAME"),
      dataIndex: "user",
      key: "user",
      width: 250,
      ellipsis: false,
      render: (user: any, item: any) => (
        <Row>
          <Col
            sm={{ span: 21, offset: 0 }}
            style={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {renderDotActive(item.isActive)} {user?.displayName}
          </Col>
          {!item.isActive && (
            <Col sm={{ span: 3, offset: 0 }}>
              <Dropdown
                trigger={["click"]}
                overlay={
                  <Menu>
                    <>
                      <Menu.Item
                        key={1}
                        onClick={() => this.approveRequest(item.id)}
                      >
                        {L("APPROVE_REQUEST")}
                      </Menu.Item>
                      <Menu.Item
                        key={2}
                        onClick={() => this.rejectRequest(item.id)}
                      >
                        {L("REJECT_REQUEST")}
                      </Menu.Item>
                    </>
                  </Menu>
                }
                placement="bottomLeft"
              >
                <button className="button-action-hiden-table-cell">
                  <MoreOutlined />
                </button>
              </Dropdown>
            </Col>
          )}
        </Row>
      ),
    })
    return (
      <>
        <Row gutter={[8, 0]}>
          <Col sm={{ span: 12, offset: 0 }}>
            <span>
              {L("AP_CONTACT_NAME")}&nbsp;
              <strong>{editContact?.contactName}</strong>
            </span>
          </Col>
          <Col sm={{ span: 12, offset: 0 }}>
            <Col sm={{ span: 24, offset: 0 }}>
              <span>
                {L("AP_COMPANY")}&nbsp;
                <strong>{editContact?.company?.businessName}</strong>
              </span>
            </Col>
            {editContact?.companyContact?.map((item, index) => (
              <Col key={index} sm={{ span: 24, offset: 0 }}>
                <span>
                  {L("AP_COMPANY")}&nbsp;
                  <strong>{item?.company?.businessName}</strong>
                </span>
              </Col>
            ))}
          </Col>

          <Col sm={{ span: 24, offset: 0 }}>
            <DataTable
              onCreate={() => {
                this.toggleModal()
              }}
              onRefresh={() => {
                this.initData()
                this.initDataRequest()
              }}
              handleSearch={this.handleFilterChange}
              pagination={{
                pageSize: this.state.maxResultCount,
                total: contactTable === undefined ? 0 : contactTable.totalCount,
                onChange: this.handleTableChange,
              }}
            >
              <Table
                size="middle"
                className="custom-ant-row"
                rowKey={(record) => record.id}
                columns={columns}
                pagination={false}
                dataSource={contactTable?.items ?? []}
                loading={isLoading}
                scroll={{ x: 100, scrollToFirstRowOnChange: true }}
              />
            </DataTable>
          </Col>

          <Col sm={{ span: 24, offset: 0 }}>
            <DataTable
              pagination={{
                pageSize: this.state.requestMaxResultCount,
                total:
                  listContactRequest === undefined
                    ? 0
                    : listContactRequest.totalCount,
                onChange: this.handleTableRequestChange,
              }}
            >
              <Table
                size="middle"
                className="custom-ant-row"
                rowKey={(record) => record.id}
                columns={columnsRequest}
                pagination={false}
                dataSource={listContactRequest?.items ?? []}
                loading={isLoading}
                scroll={{ x: 100, scrollToFirstRowOnChange: true }}
              />
            </DataTable>
          </Col>
        </Row>
        <AddUserModal
          visible={this.state.modalVisible}
          onClose={this.toggleModal}
          // data={editUnitStatusConfig}
          onOk={this.handleOk}
          formRef={this.formRef}
        />
      </>
    )
  }
}

export default withRouter(AssociateParty)
