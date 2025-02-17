import * as React from "react"
import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Col, Row, Table } from "antd"
import { L } from "@lib/abpUtility"
import withRouter from "@components/Layout/Router/withRouter"
import getColumns from "./components/columns"
import DataTable from "@components/DataTable"
import Modal from "./components/Modal"
import Stores from "@stores/storeIdentifier"
import NotificationTemplateStore from "@stores/notificationTemplate/notificationTemplateStore"
import AppConsts from "@lib/appconst"
const { notifiType } = AppConsts

export interface IProps {
  notificationTemplateStore: NotificationTemplateStore
  selectItem: any
  tabKey: any
}
export interface IState {
  maxResultCount: number
  skipCount: number
  filters: any
  modalVisible: boolean
  editedRecordId: number | null // New state property
}

@inject(Stores.NotificationTemplateStore)
@observer
class LeaseAgreementTemplate extends AppComponentListBase<IProps, IState> {
  formRef: any = React.createRef()
  formRefProjectAddress: any = React.createRef()

  constructor(props: IProps) {
    super(props)
    this.state = {
      maxResultCount: 10,
      skipCount: 0,
      filters: { isActive: true },
      modalVisible: false,
      editedRecordId: null, // Initialize new state property
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
    await this.props.notificationTemplateStore.getAll({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      notificationTypeId: notifiType.leaseAgreement,
      ...this.state.filters,
    })
  }
  toggleModal = async () => {
    this.setState({ editedRecordId: null })
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
      editedRecordId: id || null, // Set the edited record ID
    }))
  }
  handleOk = async () => {
    this.setState({ editedRecordId: null }) // Reset edited record ID
    this.getAll()
  }
  get currentPage() {
    return Math.floor(this.state.skipCount / this.state.maxResultCount) + 1
  }

  public render() {
    const {
      notificationTemplateStore: { isLoading, notificationTemplates },
    } = this.props
    const columns = getColumns({
      title: L("TITLE"),
      dataIndex: "notificationTemplate",
      key: "notificationTemplate",
      width: "",
      render: (notificationType, item: any) => (
        <Row>
          <Col sm={{ span: 21, offset: 0 }}>
            <a
              onClick={() => this.goDetail(item.id)}
              className={`link-text-table ${
                this.state.editedRecordId === item.id ? "edited-record" : ""
              }`} // Apply CSS class conditionally
            >
              {notificationType?.subject}
            </a>
          </Col>
          <Col sm={{ span: 1, offset: 0 }}></Col>
        </Row>
      ),
    })
    return (
      <>
        <DataTable
          pagination={{
            pageSize: this.state.maxResultCount,
            current: this.currentPage,
            onChange: this.handleTableChange,
          }}
        >
          <Table
            size="middle"
            className=" custom-ant-row"
            loading={isLoading}
            columns={columns}
            pagination={false}
            dataSource={notificationTemplates ?? []}
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

export default withRouter(LeaseAgreementTemplate)
