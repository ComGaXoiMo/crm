import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Table } from "antd"
import Stores from "@stores/storeIdentifier"
import withRouter from "@components/Layout/Router/withRouter"
import InquiryModal from "./components/inquiryModal"
import InquiryStore from "@stores/communication/inquiryStore"
import DataTable from "@components/DataTable"
import { renderDotActive } from "@lib/helper"
import gettColumns from "./components/inquiruesColumn"
import { L } from "@lib/abpUtility"

export interface IIquiryProps {
  inquiryStore: InquiryStore

  unitId?: any
}
export interface IIquiryState {
  modalVisible: boolean
  maxResultCount: any
  data: any[]
  filters: any
  skipCount: number
}

@inject(Stores.InquiryStore)
@observer
class UnitInquiry extends AppComponentListBase<IIquiryProps, IIquiryState> {
  formRef: any = React.createRef()

  constructor(props: IIquiryProps) {
    super(props)
    this.state = {
      maxResultCount: 10,
      skipCount: 0,
      modalVisible: false,
      filters: {
        isActive: true,
      },
      data: [] as any,
    }
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.unitId !== this.props.unitId) {
      this.getAll()
    }
  }
  async componentDidMount() {
    await Promise.all([])
    this.getAll()
  }
  getAll = async () => {
    await this.props.inquiryStore.getMatchingInquiry({
      unitId: this.props.unitId,
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      ...this.state.filters,
    })
    this.setState({ data: this.props.inquiryStore.matchingInquiry.items })
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
  toggleModal = () =>
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }))

  handleOk = async () => {
    this.toggleModal()
  }
  public render() {
    const columns = gettColumns({
      title: L("INQUIRY_NAME"),
      dataIndex: "inquiryName",
      key: "inquiryName",
      width: 290,
      ellipsis: false,

      render: (inquiryName: string, item: any) => (
        <div className="flex gap-1">
          {renderDotActive(item.isActive)} {inquiryName}
        </div>
      ),
    })
    const {
      inquiryStore: { matchingInquiry },
    } = this.props
    return (
      <>
        <DataTable
          onCreate={() => {
            this.toggleModal()
          }}
          pagination={{
            pageSize: this.state.maxResultCount,
            total:
              matchingInquiry === undefined ? 0 : matchingInquiry.totalCount,
            onChange: this.handleTableChange,
          }}
        >
          <Table
            size="middle"
            className="custom-ant-row"
            rowKey={(record) => record.id}
            columns={columns}
            pagination={false}
            dataSource={
              matchingInquiry === undefined ? [] : matchingInquiry.items
            }
            loading={this.props.inquiryStore.isLoading}
            bordered
            scroll={{ x: 1000, scrollToFirstRowOnChange: true }}
          />
        </DataTable>

        <InquiryModal
          visible={this.state.modalVisible}
          onClose={this.toggleModal}
          onOk={this.handleOk}
        />
      </>
    )
  }
}

export default withRouter(UnitInquiry)
