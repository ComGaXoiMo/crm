import * as React from "react"

import { inject, observer } from "mobx-react"
import "./pipeline-view.less"

import { Card, Empty, Spin } from "antd"
import withRouter from "@components/Layout/Router/withRouter"
import InquiriesBoardItem from "./inquiriesBoardItem"
import { AppComponentListBase } from "@components/AppComponentBase"
import Stores from "@stores/storeIdentifier"
import InquiryStore from "@stores/communication/inquiryStore"
import type { PagedResultDto } from "@services/dto/pagedResultDto"

import InfiniteScroll from "react-infinite-scroller"
import { debounce } from "lodash"

export interface IUnitProps {
  index: any
  data: any
  goDetail: (id) => void
  status: any
  inquiryStore: InquiryStore
  filter: any
  visible: any
}
export interface IInquiriesListState {
  data: PagedResultDto<any>
  isLoading: boolean
}
@inject(Stores.InquiryStore)
@observer
class InquiriesList extends AppComponentListBase<
  IUnitProps,
  IInquiriesListState
> {
  myRef: any = React.createRef()
  state = {
    data: [] as any,
    isLoading: false,
  }
  async componentDidMount() {
    this.setState({ data: this.props.data })
    await this.initData()
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      if (this.props.data) {
        this.setState({ data: this.props.data })
      }
    }
    if (prevProps.visible !== this.props.visible) {
      if (!this.props.visible) {
        this.myRef.current?.scrollTo(0, 0)
      }
    }
  }
  initData = async () => {
    console.log("init")
  }

  handleLoadMore = debounce(async () => {
    await this.setState({ isLoading: true })
    try {
      await this.props.inquiryStore.getMore(this.props.status.id, {
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
        <Card className="iqr-pipeline-view-container" key={this.props.index}>
          <div className="h-100 ">
            <div className="iqr-title-card">
              <strong>
                {this.props.status?.name ?? ""} (
                {this.state.data?.totalCount ?? ""})
              </strong>
            </div>
            <Spin
              spinning={
                this.state.isLoading || this.props.inquiryStore.isLoading
              }
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
                    // dataLength={this.state.data?.items?.length}
                    loadMore={this.handleLoadMore}
                    // loader={<h4>Loading...</h4>}
                    // next={this.handleLoadMore}
                    hasMore={
                      this.state.data?.items?.length <
                      (this.props.data?.totalCount || 10)
                    }
                    useWindow={false}
                  >
                    {this.state.data?.items?.map((item, index) => (
                      <InquiriesBoardItem
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

export default withRouter(InquiriesList)
