import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Col, Row, Spin, Table } from "antd"
import Stores from "@stores/storeIdentifier"
import withRouter from "@components/Layout/Router/withRouter"
import InquiriFilter from "./components/inquiriFilter"
import InquiryStore from "@stores/communication/inquiryStore"
import DataTable from "@components/DataTable"
import { L } from "@lib/abpUtility"
import { renderDotActive } from "@lib/helper"
import gettColumns from "./components/inquiruesColumn"
export interface IIquiryProps {
  inquiryStore: InquiryStore
  projectId?: any
  contactId?: any
  companyId?: any
  unitId?: any
}
export interface IIquiryState {
  maxResultCount: any
  data: any[]
  filters: any
  skipCount: number
}

@inject(Stores.InquiryStore)
@observer
class InquirieContact extends AppComponentListBase<IIquiryProps, IIquiryState> {
  formRef: any = React.createRef()

  constructor(props: IIquiryProps) {
    super(props)
    this.state = {
      maxResultCount: 10,
      skipCount: 0,
      filters: {
        isActive: true,
      },
      data: [] as any,
    }
  }
  async componentDidUpdate(prevProps) {
    if (
      prevProps.projectId !== this.props.projectId ||
      prevProps.contactId !== this.props.contactId ||
      prevProps.unitId !== this.props.unitId ||
      prevProps.companyId !== this.props.companyId
    ) {
      this.getAll()
    }
  }
  async componentDidMount() {
    await Promise.all([])
    this.getAll()
  }
  getAll = async () => {
    await this.props.inquiryStore.getAll({
      projectId: this.props.projectId,
      contactId: this.props.contactId,
      companyId: this.props.companyId,
      unitId: this.props.unitId,
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      ...this.state.filters,
    })
    this.setState({ data: this.props.inquiryStore.pageResult.items })
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
    const {
      inquiryStore: { pageResult, isLoading },
    } = this.props
    const columns = gettColumns({
      title: L("INQUIRY_NAME"),
      dataIndex: "inquiryName",
      key: "inquiryName",
      width: 290,
      ellipsis: false,

      render: (inquiryName: string, item: any) => (
        <>
          {renderDotActive(item.isActive)} {inquiryName}
        </>
      ),
    })
    return (
      <>
        <InquiriFilter />
        <Spin
          spinning={this.props.inquiryStore.isLoading}
          className="h-100 w-100"
        >
          <Row gutter={[8, 0]}>
            <Col sm={{ span: 24 }}>
              <DataTable
                pagination={{
                  pageSize: this.state.maxResultCount,
                  total: pageResult === undefined ? 0 : pageResult.totalCount,
                  onChange: this.handleTableChange,
                }}
              >
                <Table
                  size="middle"
                  className="custom-ant-row"
                  rowKey={(record) => record.id}
                  columns={columns}
                  pagination={false}
                  dataSource={pageResult === undefined ? [] : pageResult.items}
                  loading={isLoading}
                  scroll={{ x: 1000, scrollToFirstRowOnChange: true }}
                />
              </DataTable>
            </Col>
          </Row>
        </Spin>
      </>
    )
  }
}

export default withRouter(InquirieContact)
