import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Card, Col, Empty, Row, Spin } from "antd"
import Stores from "@stores/storeIdentifier"
import withRouter from "@components/Layout/Router/withRouter"
import ActivityFilter from "./components/taskFilter"
import TaskBoardItem from "./components/taskBoardItem"
import TaskModal from "./components/taskModal"
import TaskStore from "@stores/activity/taskStore"
import DataTable from "@components/DataTable"

export interface ITaskProps {
  taskStore: TaskStore
  inquiryId: any
}
export interface ITaskState {
  modalVisible: boolean
  maxResultCount: any
  filters: any
  skipCount: number
}

@inject(Stores.TaskStore)
@observer
class Task extends AppComponentListBase<ITaskProps, ITaskState> {
  formRef: any = React.createRef()
  formRefProjectAddress: any = React.createRef()

  constructor(props: ITaskProps) {
    super(props)
    this.state = {
      modalVisible: false,
      maxResultCount: 10,
      skipCount: 0,
      filters: {
        isActive: true,
      },
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
    await this.setState({ filters }, this.getAll)
  }
  async componentDidMount() {
    await Promise.all([])
    this.getAll()
  }
  componentDidUpdate = async (prevProps) => {
    if (prevProps.inquiryId !== this.props.inquiryId) {
      this.getAll()
    }
  }
  getAll = async () => {
    this.props.taskStore.getAll({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      ...this.state.filters,
      inquiryId: this.props.inquiryId,
    })
  }

  goDetail = async (id?) => {
    if (id) {
      await this.props.taskStore.get(id)
    } else {
      await this.props.taskStore.createTask()
    }
    await this.toggleModal()
  }
  toggleModal = () => {
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }))
  }
  handleOk = async () => {
    await this.getAll()
    this.toggleModal()
  }
  public render() {
    const {
      taskStore: { tableData, isLoading },
    } = this.props
    return (
      <>
        <ActivityFilter
          onCreate={() => {
            this.goDetail()
          }}
          onRefesh={() => this.getAll()}
          handleSearch={this.handleFilterChange}
        />

        <Row gutter={[8, 0]}>
          <Col sm={{ span: 24 }}>
            <Card className="card-detail-modal">
              <DataTable
                pagination={{
                  pageSize: this.state.maxResultCount,
                  total: tableData === undefined ? 0 : tableData.totalCount,
                  onChange: this.handleTableChange,
                }}
              >
                <Spin spinning={isLoading} className="h-100 w-100">
                  {tableData.items.map((item, index) => (
                    <Col key={index} sm={{ span: 24 }}>
                      <div
                        style={{ display: "flex" }}
                        onClick={() => this.goDetail(item?.id)}
                      >
                        <TaskBoardItem data={item} />
                      </div>
                    </Col>
                  ))}
                </Spin>
                {tableData.totalCount < 1 && <Empty />}
              </DataTable>
            </Card>
          </Col>
        </Row>
        <TaskModal
          inquiryId={this.props.inquiryId}
          visible={this.state.modalVisible}
          onClose={this.toggleModal}
          onOk={this.handleOk}
        />
      </>
    )
  }
}

export default withRouter(Task)
