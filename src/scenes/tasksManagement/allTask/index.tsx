import * as React from "react"
import gettColumns from "./components/allTaskColumn"

import { inject, observer } from "mobx-react"
import AllTaskFilterPanel from "./components/taskFilterPanel"
import { L } from "@lib/abpUtility"
import { Col, Dropdown, Menu, Row, Table } from "antd"
import { MoreOutlined } from "@ant-design/icons/lib/icons"
import DataTable from "@components/DataTable"
import TaskBoardView from "./components/taskBoardView"
// import { Table } from "antd";
import "./components/pipeline.less"
import withRouter from "@components/Layout/Router/withRouter"
import TaskStore from "@stores/activity/taskStore"
import Stores from "@stores/storeIdentifier"
import AppDataStore from "@stores/appDataStore"
import TaskModal from "@scenes/activity/taskActivity/components/taskModal"
import { AppComponentListBase } from "@components/AppComponentBase"
import SessionStore from "@stores/sessionStore"
import { appPermissions } from "@lib/appconst"
export interface IAllTaskProps {
  appDataStore: AppDataStore
  taskStore: TaskStore
  sessionStore: SessionStore
  isMyTask: boolean
}

export interface IAllTaskState {
  maxResultCount: number
  skipCount: number
  filters: any
  tabView: string
  modalVisible: boolean
  taskId: any
}

const tabKeys = {
  boardView: L("BOARD_VIEW"),
  listView: L("LIST_VIEW"),
}
@inject(Stores.TaskStore, Stores.AppDataStore, Stores.SessionStore)
@observer
class AllTask extends AppComponentListBase<IAllTaskProps, IAllTaskState> {
  formRef: any = React.createRef()
  state = {
    maxResultCount: 10,
    skipCount: 0,
    filters: { isActive: true },
    tabView: tabKeys.boardView,
    modalVisible: false,
    taskId: undefined,
  }

  async componentDidMount() {
    if (this.props.isMyTask === true) {
      await this.setState({
        filters: {
          ...this.state.filters,
          userId: this.props.sessionStore?.currentLogin.user?.id,
        },
      })
    }
    if (this.state.tabView === tabKeys.boardView) {
      this.getAllByStatus()
    } else {
      this.getAll()
    }
  }

  componentDidUpdate(prevProps, prevState): void {
    if (prevState.tabView !== this.state.tabView) {
      if (this.state.tabView === tabKeys.boardView) {
        this.getAllByStatus()
      } else {
        this.getAll()
      }
    }
  }
  getAll = async () => {
    this.props.taskStore.getAll({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      ...this.state.filters,
    })
  }
  getAllByStatus = async () => {
    await this.props.taskStore.getAllByStatus({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      ...this.state.filters,
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
  }
  onFilterChange = () => {
    if (this.state.tabView === tabKeys.boardView) {
      this.getAllByStatus()
    } else {
      this.getAll()
    }
  }
  handleFilterChange = async (filters) => {
    await this.setState({
      filters: {
        ...filters,
      },
    })
    if (this.props.isMyTask) {
      await this.setState({
        filters: {
          ...filters,
          userId: this.props.sessionStore?.currentLogin.user?.id,
        },
      })
    }
    await this.onFilterChange()
  }
  gotoDetail = async (id?) => {
    if (id) {
      await this.props.taskStore.get(id)
    } else {
      await this.props.taskStore.createTask()
    }
    await this.toggleModal()
  }
  toggleModal = () =>
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }))

  handleOk = async () => {
    await this.getAll()
    this.getAllByStatus()
    this.toggleModal()
  }
  changeTab = async (value) => {
    await this.setState({ tabView: value.target.value })
  }

  public render() {
    const {
      appDataStore: { taskStatusForBoardView },
      taskStore: { tableData, isLoading, listTaskBoardView },
    } = this.props
    const columns = gettColumns({
      title: L("TASK_NAME"),
      dataIndex: "subject",
      key: "subject",
      width: 240,
      ellipsis: false,
      render: (subject: string, item: any) => (
        <Row>
          <Col
            sm={{ span: 19, offset: 0 }}
            style={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            <a
              onClick={
                this.isGranted(appPermissions.task.detail)
                  ? () => this.gotoDetail(item.id)
                  : () => console.log()
              }
              className="link-text-table"
            >
              {subject}
            </a>
          </Col>
          <Col sm={{ span: 1, offset: 0 }}></Col>
          <Col sm={{ span: 3, offset: 0 }}>
            <Dropdown
              trigger={["click"]}
              overlay={
                <Menu>
                  {/* {this.isGranted(appPermissions.unit.delete) && ( */}
                  <Menu.Item
                    key={1}
                    // onClick={() =>
                    //   this.activateOrDeactivate(item.id, !item.isActive)
                    // }
                  >
                    {L(item.isActive ? "BTN_DEACTIVATE" : "BTN_ACTIVATE")}
                  </Menu.Item>
                  {/* )} */}
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
          filterComponent={
            <AllTaskFilterPanel
              isMyTask={this.props.isMyTask}
              changeTab={this.changeTab}
              handleSearch={this.handleFilterChange}
            />
          }
          handleSearch={this.handleFilterChange}
          searchPlaceholder={"FILTER_KEYWORD_TASK"}
          onCreate={() => {
            this.gotoDetail()
          }}
          onRefresh={() => {
            if (this.state.tabView === tabKeys.boardView) {
              this.getAllByStatus()
            } else {
              this.getAll()
            }
          }}
          pagination={
            this.state.tabView === tabKeys.listView && {
              pageSize: this.state.maxResultCount,
              total: tableData === undefined ? 0 : tableData.totalCount,
              onChange: this.handleTableChange,
            }
          }
        >
          {this.state.tabView === tabKeys.listView && (
            <Table
              size="middle"
              className=""
              rowKey={(record) => record.id}
              columns={columns}
              pagination={false}
              loading={isLoading}
              dataSource={tableData.items ?? []}
              scroll={{
                x: 1000,
                y: "calc(100vh - 23rem)",
                scrollToFirstRowOnChange: true,
              }}
              bordered
            />
          )}
          {this.state.tabView === tabKeys.boardView && (
            <Row gutter={[8, 8]} className="mt-3">
              {taskStatusForBoardView?.map((status, index) => (
                <Col key={index} sm={{ span: 4 }}>
                  <TaskBoardView
                    key={index}
                    status={status}
                    data={listTaskBoardView[status?.id]}
                    goDetail={
                      this.isGranted(appPermissions.task.detail)
                        ? (id) => this.gotoDetail(id)
                        : () => console.log()
                    }
                    filter={{ ...this.state.filters }}
                    visible={this.state.modalVisible}
                  />
                </Col>
              ))}
            </Row>
          )}
        </DataTable>
        <TaskModal
          visible={this.state.modalVisible}
          onClose={this.toggleModal}
          onOk={this.handleOk}
        />
      </>
    )
  }
}

export default withRouter(AllTask)
