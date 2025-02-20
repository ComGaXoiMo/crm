import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Col, Row, Table } from "antd"
import { L } from "@lib/abpUtility"
import withRouter from "@components/Layout/Router/withRouter"
import getColumns from "./components/columns"
import DataTable from "@components/DataTable"
import Modal from "./components/Modal"
import NotificationTemplateStore from "@stores/notificationTemplate/notificationTemplateStore"
import Stores from "@stores/storeIdentifier"
import AppConsts from "@lib/appconst"
const { notifiType } = AppConsts

//
export interface IEProposalTemplateProps {
  notificationTemplateStore: NotificationTemplateStore
  selectItem: any
  tabKey: any
}
export interface IEProposalTemplateState {
  maxResultCount: number
  skipCount: number
  filters: any
  modalVisible: boolean
}

@inject(Stores.NotificationTemplateStore)
@observer
class EProposalTemplate extends AppComponentListBase<
  IEProposalTemplateProps,
  IEProposalTemplateState
> {
  formRef: any = React.createRef()
  formRefProjectAddress: any = React.createRef()

  constructor(props: IEProposalTemplateProps) {
    super(props)
    this.state = {
      maxResultCount: 10,
      skipCount: 0,
      filters: { isActive: true },
      modalVisible: false,
    }
  }
  handleFilterChange = async (filters) => {
    await this.setState({ filters }, this.getAll)
  }
  handleTableChange = (pagination: any) => {
    this.setState(
      {
        skipCount: (pagination.current - 1) * this.state.maxResultCount!,
        maxResultCount: pagination.pageSize,
      },
      async () => await this.getAll()
    )
  }
  async componentDidMount() {
    this.getAll()
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.selectItem !== this.props.selectItem) {
      if (this.props.selectItem === this.props.tabKey) {
        await this.getAll()
      }
    }
  }
  getAll = async () => {
    await this.props.notificationTemplateStore.getAllEproposal({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      notificationTypeId: notifiType.proposal,
      ...this.state.filters,
    })
  }
  toggleModal = async () => {
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }))
  }
  goDetail = async (id?) => {
    if (id) {
      await this.props.notificationTemplateStore.get(id)
    } else {
      await this.props.notificationTemplateStore.createNotificationTemplate()
    }

    await this.setState((prevState) => ({
      modalVisible: !prevState.modalVisible,
    }))
  }
  handleOk = async () => {
    this.getAll()
  }
  get currentPage() {
    return Math.floor(this.state.skipCount / this.state.maxResultCount) + 1
  }

  public render() {
    const {
      notificationTemplateStore: { isLoading, eProposalTemplates },
    } = this.props
    const columns = getColumns({
      title: L("TITLE"),
      dataIndex: "notificationTemplate",
      key: "notificationTemplate",
      width: "",
      // ellipsis: false,
      render: (notificationType, item: any) => (
        <Row>
          <Col sm={{ span: 21, offset: 0 }}>
            <a
              onClick={() => this.goDetail(item.id)}
              className="link-text-table"
            >
              {notificationType?.subject}
            </a>
          </Col>
          <Col sm={{ span: 1, offset: 0 }}></Col>
          {/* <Col sm={{ span: 2, offset: 0 }}>
            <Dropdown
              trigger={["click"]}
              overlay={
                <Menu>
                  <Menu.Item key={1}>
                    {L(item.isActive ? "BTN_DEACTIVATE" : "BTN_ACTIVATE")}
                  </Menu.Item>
                </Menu>
              }
              placement="bottomLeft"
            >
              <button className="button-action-hiden-table-cell">
                <MoreOutlined />
              </button>
            </Dropdown>
          </Col> */}
        </Row>
      ),
    })
    return (
      <>
        <DataTable
          onCreate={() => {
            this.goDetail()
          }}
          onRefresh={this.getAll}
          handleSearch={this.handleFilterChange}
          pagination={{
            pageSize: this.state.maxResultCount,
            current: this.currentPage,
            // total: pagedResult === undefined ? 0 : pagedResult.totalCount,
            onChange: this.handleTableChange,
          }}
        >
          <Table
            size="middle"
            className="custom-ant-row"
            // rowKey={(record) => record.id}
            loading={isLoading}
            columns={columns}
            pagination={false}
            dataSource={eProposalTemplates ?? []}
            scroll={{
              x: 1000,
              y: "calc(100vh - 22rem)",
              scrollToFirstRowOnChange: true,
            }}
          />
        </DataTable>
        <Modal
          visible={this.state.modalVisible}
          onClose={this.toggleModal}
          onOk={this.handleOk}
        />
      </>
    )
  }
}

export default withRouter(EProposalTemplate)
