import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Empty, Row, Spin } from "antd"
// import FileUploadWrap from "@components/FileUpload/FileUploadCRM";
import Monition from "./components/Monition"
import withRouter from "@components/Layout/Router/withRouter"
import ActivityFilter from "./components/activityFilter"
import InquiryStore from "@stores/communication/inquiryStore"
import Stores from "@stores/storeIdentifier"
import DataTable from "@components/DataTable"

export interface IActivityProps {
  inquiryId: any
  contactId: any
  unitId: any
  inquiryStore: InquiryStore
  keyTab: any
  tabKeyChoose: any
}
export interface IActivityState {
  modalVisible: boolean
  maxResultCount: any
  filters: any
  skipCount: number
}
@inject(Stores.InquiryStore)
@observer
class Activity extends AppComponentListBase<IActivityProps, IActivityState> {
  formRef: any = React.createRef()

  constructor(props: IActivityProps) {
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
    if (
      prevProps.inquiryId !== this.props.inquiryId ||
      prevProps.contactId !== this.props.contactId ||
      prevProps.unitId !== this.props.unitId
    ) {
      this.getAll()
    }
    if (prevProps.tabKeyChoose !== this.props.tabKeyChoose) {
      if (this.props.tabKeyChoose === this.props.keyTab) {
        this.getAll()
      }
    }
  }
  getAll = async () => {
    await this.props.inquiryStore.getAllActivity({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      ...this.state.filters,
      inquiryId: this.props.inquiryId,
      contactId: this.props.contactId,
      unitId: this.props.unitId,
    })
  }

  public render() {
    const {
      inquiryStore: { pageResultActivity, isLoading },
    } = this.props
    return (
      <>
        <DataTable
          filterComponent={
            <ActivityFilter handleSearch={this.handleFilterChange} />
          }
          onRefresh={() => this.getAll()}
          pagination={{
            pageSize: this.state.maxResultCount,
            total:
              pageResultActivity === undefined
                ? 0
                : pageResultActivity.totalCount,
            onChange: this.handleTableChange,
          }}
        >
          <Spin spinning={isLoading} className="h-100 w-100">
            <Row>
              {pageResultActivity.items.map((item, key) => (
                <Monition key={key} data={item} />
              ))}
            </Row>
            {pageResultActivity.totalCount < 1 && <Empty />}
          </Spin>
        </DataTable>
      </>
    )
  }
}

export default withRouter(Activity)
