import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Col, Dropdown, Menu, Row, Table } from "antd"
import { L } from "@lib/abpUtility"
import withRouter from "@components/Layout/Router/withRouter"
import getColumns from "./components/columns"
import DataTable from "@components/DataTable"
import { MoreOutlined } from "@ant-design/icons"
import Modal from "./components/Modal"
import Stores from "@stores/storeIdentifier"
import Filter from "./components/filter"

//
export interface IProps {
  id: any
}
export interface IState {
  maxResultCount: number
  skipCount: number
  filters: any
  modalVisible: boolean
}

@inject(Stores.NotificationTemplateStore)
@observer
class OfferLetterTemplate extends AppComponentListBase<IProps, IState> {
  formRef: any = React.createRef()
  formRefProjectAddress: any = React.createRef()

  constructor(props: IProps) {
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
  getAll = async () => {
    console.log()
  }
  toggleModal = async () => {
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }))
  }
  goDetail = async (id?) => {
    // if (id) {
    //   await this.props.notificationTemplateStore.get(id)
    // } else {
    //   await this.props.notificationTemplateStore.createNotificationTemplate()
    // }

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
    const columns = getColumns({
      title: L("TITLE"),
      dataIndex: "template",
      key: "template",
      width: 250,
      // ellipsis: false,
      render: (template, item: any) => (
        <Row>
          <Col sm={{ span: 21, offset: 0 }}>
            <a
              onClick={() => this.goDetail(item.id)}
              className="link-text-table"
            >
              {template}
            </a>
          </Col>
          <Col sm={{ span: 1, offset: 0 }}></Col>
          <Col sm={{ span: 2, offset: 0 }}>
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
          </Col>
        </Row>
      ),
    })
    return (
      <>
        <Filter
          onCreate={() => {
            this.goDetail()
          }}
          onRefesh={() => this.getAll()}
          handleSearch={this.handleFilterChange}
        />
        <DataTable
          pagination={{
            pageSize: this.state.maxResultCount,
            current: this.currentPage,
            // total: pagedResult === undefined ? 0 : pagedResult.totalCount,
            onChange: this.handleTableChange,
          }}
        >
          <Table
            size="middle"
            className="custom-ant-table custom-ant-row"
            // rowKey={(record) => record.id}
            // loading={isLoading}
            columns={columns}
            pagination={false}
            dataSource={fakeData ?? []}
            scroll={{ x: 800, y: 500, scrollToFirstRowOnChange: true }}
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

export default withRouter(OfferLetterTemplate)
const fakeData = [
  {
    id: 1,
    template: "abc",
  },
  {
    id: 2,
    template: "def",
  },
]
