import * as React from "react"
import gettColumns from "./components/inquiruesColumn"

import { inject, observer } from "mobx-react"
import InquiryFilterPanel from "./components/inquiriesFilterPanel"
import { L, LNotification } from "@lib/abpUtility"
import { Col, Dropdown, Menu, Modal, Row, Table } from "antd"
import { MoreOutlined } from "@ant-design/icons/lib/icons"
import DataTable from "@components/DataTable"
import InquiriesBoardView from "./components/inquiriesBoardView"
// import { Table } from "antd";
import "./components/pipeline-view.less"
import Stores from "@stores/storeIdentifier"
import InquiryStore from "@stores/communication/inquiryStore"
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import InquiryDetaillModal from "./components/InquiryDetaillModal"
import { appPermissions } from "@lib/appconst"
import { renderDotActive } from "@lib/helper"
import AppDataStore from "@stores/appDataStore"
const confirm = Modal.confirm
export interface IInquiriesListProps {
  inquiryStore: InquiryStore
  appDataStore: AppDataStore
  projectId?: any
}

export interface IInquiriesListState {
  maxResultCount: number
  skipCount: number
  filters: any
  projectProvinces: any[]
  visible: boolean
  title: string
  tabView: string
  modalVisible: boolean
  inquiryId: any
}
const selectKeys = {
  boardView: L("BOARD_VIEW"),
  listView: L("LIST_VIEW"),
}

@inject(
  Stores.InquiryStore,
  Stores.UnitStore,
  Stores.AppDataStore,
  Stores.ReservationStore
)
@observer
class InquiriesList extends AppComponentListBase<
  IInquiriesListProps,
  IInquiriesListState
> {
  formRef: any = React.createRef()
  state = {
    maxResultCount: 10,
    skipCount: 0,
    projectProvinces: [],
    filters: {
      isActive: true,
    },
    visible: false,
    title: L("CREATE"),
    tabView: selectKeys.listView,
    modalVisible: false,
    inquiryId: undefined,
  }

  async componentDidMount() {
    this.getAll()
  }
  getAll = async () => {
    if (this.state.tabView === selectKeys.listView) {
      this.props.inquiryStore.getAll({
        ProjectId: this.props.projectId,
        maxResultCount: this.state.maxResultCount,
        skipCount: this.state.skipCount,
        ...this.state.filters,
      })
    } else {
      this.props.inquiryStore.getAllByStatus({
        ProjectId: this.props.projectId,
        maxResultCount: 10,
        skipCount: 0,
        ...this.state.filters,
      })
    }
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
  handleFilterChange = async (filters) => {
    await this.setState({ filters })
    await this.handleTableChange({
      current: 1,
      pageSize: this.state.maxResultCount,
    })
  }
  toggleModal = () =>
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }))

  handleOk = async () => {
    await this.getAll()
  }
  gotoDetail = async (id?) => {
    id
      ? this.setState({ inquiryId: id })
      : this.setState({ inquiryId: undefined })

    await this.toggleModal()
  }
  changeTab = async (value) => {
    await this.setState({ tabView: value.target.value })
  }
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
        await self.props.inquiryStore.activateOrDeactivate(id, isActive)
        self.handleTableChange({
          current: 1,
          pageSize: this.state.maxResultCount,
        })
      },
    })
  }
  public render() {
    const {
      // appDataStore: { inquiryStatus },
      inquiryStore: { pageResult, listInquiryBoardView, listStatus, isLoading },
    } = this.props
    const columns = gettColumns({
      title: L("INQUIRY_NAME"),
      dataIndex: "inquiryName",
      key: "inquiryName",
      width: 290,
      ellipsis: false,

      render: (inquiryName: string, item: any, index) => (
        <Row>
          <Col
            sm={{ span: 21, offset: 0 }}
            style={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            <a
              onClick={
                this.isGranted(appPermissions.inquiry.detail)
                  ? () => this.gotoDetail(item.id)
                  : () => console.log("no permission")
              }
              className="link-text-table"
            >
              {renderDotActive(item.isActive)} {inquiryName}
            </a>
          </Col>
          <Col sm={{ span: 3, offset: 0 }}>
            <Dropdown
              trigger={["click"]}
              overlay={
                <Menu>
                  {this.isGranted(appPermissions.inquiry.delete) && (
                    <Menu.Item
                      key={1}
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
        <div>
          <DataTable
            filterComponent={
              <InquiryFilterPanel
                appDataStore={this.props.appDataStore}
                handleSearch={this.handleFilterChange}
                changeTab={this.changeTab}
              />
            }
            handleSearch={this.handleFilterChange}
            onCreate={() => {
              this.gotoDetail()
            }}
            onRefresh={() => {
              this.getAll()
            }}
            searchPlaceholder={"FILTER_KEYWORD_INQUIRY"}
            pagination={
              this.state.tabView === selectKeys.listView && {
                pageSize: this.state.maxResultCount,
                total: pageResult === undefined ? 0 : pageResult.totalCount,
                onChange: this.handleTableChange,
              }
            }
          >
            {this.state.tabView === selectKeys.listView && (
              <Table
                size="middle"
                className="custom-ant-row"
                columns={columns}
                pagination={false}
                rowKey={(record) => record.id}
                loading={isLoading}
                dataSource={pageResult.items ?? []}
                scroll={{
                  x: 1000,
                  y: "calc(100vh - 23rem)",
                  scrollToFirstRowOnChange: true,
                }}
              />
            )}
            {this.state.tabView === selectKeys.boardView && (
              <Row gutter={[16, 10]} className="mt-3 iqr-wrap-pipeline-flex">
                <Col
                  sm={{ span: 24, offset: 0 }}
                  className="iqr-pipeline-view-wrapper"
                >
                  {listStatus.map((inquiry, index) => (
                    <InquiriesBoardView
                      key={index}
                      projectId={this.props.projectId}
                      data={listInquiryBoardView[inquiry.id]}
                      goDetail={
                        this.isGranted(appPermissions.inquiry.detail)
                          ? (id) => this.gotoDetail(id)
                          : () => console.log("no permission")
                      }
                      status={inquiry}
                      filter={{ ...this.state.filters }}
                      visible={this.state.modalVisible}
                    />
                  ))}
                </Col>
              </Row>
            )}
          </DataTable>

          <InquiryDetaillModal
            id={this.state.inquiryId}
            visible={this.state.modalVisible}
            onCancel={() => {
              this.toggleModal()
            }}
            onOk={this.handleOk}
          />
        </div>
      </>
    )
  }
}

export default withRouter(InquiriesList)
