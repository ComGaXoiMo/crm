import * as React from "react"
import gettColumns from "./inquiriesColumn"

import { inject, observer } from "mobx-react"
import { L } from "@lib/abpUtility"
import { Table } from "antd"
import DataTable from "@components/DataTable"
// import { Table } from "antd";
// import "./components/pipeline-view.less";
import AppDataStore from "@stores/appDataStore"
import Stores from "@stores/storeIdentifier"
import InquiryStore from "@stores/communication/inquiryStore"
import ListingStore from "@stores/projects/listingStore"
import UnitStore from "@stores/projects/unitStore"
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
export interface IInquiriesListProps {
  appDataStore: AppDataStore
  inquiryStore: InquiryStore
  listingStore: ListingStore
  unitStore: UnitStore
  projectId?: any
}

export interface IInquiriesListState {
  maxResultCount: number
  skipCount: number
  filters: any
  projectProvinces: any[]
  projectId: number
  visible: boolean
  title: string
  modalVisible: boolean
  inquiryId: any
}

@inject(Stores.AppDataStore, Stores.InquiryStore)
@observer
class Inquiries extends AppComponentListBase<
  IInquiriesListProps,
  IInquiriesListState
> {
  formRef: any = React.createRef()
  state = {
    maxResultCount: 10,
    skipCount: 0,
    projectId: 0,
    projectProvinces: [],
    filters: {},
    visible: false,
    title: L("CREATE"),
    modalVisible: false,
    inquiryId: undefined,
  }

  async componentDidMount() {
    console.log(this.props.appDataStore.inquiryStatus)
    await this.getAll()

    await Promise.all([])
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.projectId !== this.props.projectId) {
      await this.getAll()
    }
  }
  getAll = async () => {
    this.props.inquiryStore.getAll({ ProjectId: this.props.projectId })
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

  public render() {
    const columns = gettColumns({})
    return (
      <>
        <div>
          <DataTable
            pagination={{
              pageSize: this.state.maxResultCount,
              onChange: this.handleTableChange,
            }}
          >
            <Table
              size="middle"
              className="custom-ant-row"
              columns={columns}
              pagination={false}
              dataSource={this.props.inquiryStore.pageResult.items ?? []}
              scroll={{ x: 800, y: 500, scrollToFirstRowOnChange: true }}
              bordered
            />
          </DataTable>
        </div>
      </>
    )
  }
}

export default withRouter(Inquiries)
