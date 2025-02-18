import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Col, Empty, Row, Spin } from "antd"
import Stores from "@stores/storeIdentifier"
// import FileUploadWrap from "@components/FileUpload/FileUploadCRM";
import withRouter from "@components/Layout/Router/withRouter"
import CallBoardItem from "./components/callBoardItem"
import CallModal from "./components/callModal"
import CallStore from "@stores/activity/callStore"
import DataTable from "@components/DataTable"

export interface ICallProps {
  callStore: CallStore
  inquiryId: any
}
export interface ICallState {
  modalVisible: boolean
  maxResultCount: any
  filters: any
  skipCount: number
}

@inject(Stores.CallStore)
@observer
class Call extends AppComponentListBase<ICallProps, ICallState> {
  formRef: any = React.createRef()

  constructor(props: ICallProps) {
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

  async componentDidMount() {
    await Promise.all([])
    this.getAll()
  }
  componentDidUpdate = async (prevProps) => {
    if (prevProps.inquiryId !== this.props.inquiryId) {
      this.getAll()
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
  getAll = () => {
    this.props.callStore.getAll({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      ...this.state.filters,
      inquiryId: this.props.inquiryId,
    })
  }
  goDetail = async (id?) => {
    if (id) {
      await this.props.callStore.get(id)
    } else {
      await this.props.callStore.createCall()
    }
    await this.toggleModal()
  }
  toggleModal = () => {
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }))
  }

  handleOk = async (params) => {
    await this.toggleModal()
    await this.getAll()
  }
  public render() {
    const {
      callStore: { tableData, isLoading },
    } = this.props
    return (
      <>
        <DataTable
          onCreate={() => {
            this.goDetail()
          }}
          onRefresh={() => this.getAll()}
          handleSearch={this.handleFilterChange}
          pagination={{
            pageSize: this.state.maxResultCount,
            total: tableData === undefined ? 0 : tableData.totalCount,
            onChange: this.handleTableChange,
          }}
        >
          <Spin spinning={isLoading} className="h-100 w-100">
            <Row>
              {tableData?.items.map((item, index) => (
                <Col key={index} sm={{ span: 24 }}>
                  <div
                    style={{ display: "flex" }}
                    onClick={() => this.goDetail(item?.id)}
                  >
                    <CallBoardItem data={item} />
                  </div>
                </Col>
              ))}
            </Row>
          </Spin>
          {tableData.totalCount < 1 && <Empty />}
        </DataTable>

        <CallModal
          inquiryId={this.props.inquiryId}
          visible={this.state.modalVisible}
          onClose={this.toggleModal}
          onOk={this.handleOk}
        />
      </>
    )
  }
}

export default withRouter(Call)
