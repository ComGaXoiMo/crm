import * as React from "react"

import { inject, observer } from "mobx-react"
import "./pipeline.less"

import { Card, Empty, Spin } from "antd"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import Stores from "@stores/storeIdentifier"
import TaskStore from "@stores/activity/taskStore"
// import { Table } from "antd";
import InfiniteScroll from "react-infinite-scroller"
import TaskBoardItem from "./taskBoardItem"
import _ from "lodash"
import { L } from "@lib/abpUtility"

export interface IUnitProps {
  index: any
  status: any
  goDetail: (id) => void
  filter: any
  taskStore: TaskStore
  data: any
}

export interface IAllTaskBoardViewtate {
  isLoading: boolean
  data: any
}

@inject(Stores.TaskStore)
@observer
class AllTaskBoardView extends AppComponentListBase<
  IUnitProps,
  IAllTaskBoardViewtate
> {
  myRef: any = React.createRef()
  state = {
    isLoading: false,
    data: [] as any,
  }

  async componentDidMount() {
    this.setState({ data: this.props.data })
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      if (this.props.data) {
        this.setState({ data: this.props.data })
      }
    }
  }

  handleLoadMore = _.debounce(async () => {
    await this.setState({ isLoading: true })
    try {
      await this.props.taskStore.getMore(this.props.status.id, {
        ...this.props.filter,
        maxResultCount: 10,
        skipCount: this.state.data?.items?.length,
      })
      await this.setState({ isLoading: false })
    } catch (error) {
      await this.setState({ isLoading: false })
    }
  }, 500)
  public render() {
    return (
      <>
        <Card className="wrap-task-card" key={this.props.index}>
          <div className="h-100 ">
            <div
              className="wrap-task-header mb-3"
              style={{ backgroundColor: this.props.status?.color }}
            >
              <strong>
                {L(this.props.status?.name) ?? ""} (
                {this.state.data?.totalCount ?? ""})
              </strong>
            </div>
            <Spin
              spinning={this.state.isLoading || this.props.taskStore.isLoading}
              className="h-100 w-100"
            >
              <div
                ref={this.myRef}
                style={{ maxHeight: "70vh", overflow: "auto" }}
              >
                <>
                  <InfiniteScroll
                    initialLoad={false}
                    pageStart={0}
                    loadMore={this.handleLoadMore}
                    hasMore={
                      this.state.data?.items?.length <
                      (this.props.data?.totalCount || 10)
                    }
                    useWindow={false}
                  >
                    {this.state.data?.items?.map((item, index) => (
                      <TaskBoardItem
                        data={item}
                        key={index}
                        loading={this.state.isLoading}
                        goDetail={() => this.props.goDetail(item?.id)}
                      />
                    ))}
                    {this.state.data?.items?.length === 0 && (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )}
                  </InfiniteScroll>
                </>
              </div>
            </Spin>
          </div>
        </Card>
      </>
    )
  }
}

export default withRouter(AllTaskBoardView)
