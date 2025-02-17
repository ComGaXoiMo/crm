import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Col, Row, Table } from "antd"
import { L } from "@lib/abpUtility"
import Stores from "@stores/storeIdentifier"
// import FileUploadWrap from "@components/FileUpload/FileUploadCRM";
import withRouter from "@components/Layout/Router/withRouter"
import { renderDateTime } from "@lib/helper"
import InquiryStore from "@stores/communication/inquiryStore"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
export interface IAuditTrailProps {
  parentId: any
  visible: any
  inquiryStore: InquiryStore
}
export interface IAuditTrailState {
  dataTable: any[]
  maxResultCount: number
  skipCount: number
}

@inject(Stores.InquiryStore)
@observer
class AuditTrail extends AppComponentListBase<
  IAuditTrailProps,
  IAuditTrailState
> {
  formRef: any = React.createRef()
  state = {
    dataTable: [] as any,
    maxResultCount: 10,
    skipCount: 0,
  }

  async componentDidMount() {
    await this.handleSearch()
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        await this.handleSearch()
      }
    }
  }

  handleTableChange = (pagination: any) => {
    this.setState(
      { skipCount: (pagination.current - 1) * this.state.maxResultCount! },
      async () => {
        await this.handleSearch()
      }
    )
  }

  handleSearch = async () => {
    const { parentId } = this.props

    await this.props.inquiryStore.getAuditLogs({
      id: parentId,
    })
    const dataTable = await this.props.inquiryStore.auditLogResult.sort(
      function (left, right) {
        return dayjs.utc(right.changeTime).diff(dayjs.utc(left.changeTime))
      }
    )
    this.setState({ dataTable })
  }

  render() {
    const columns = [
      {
        title: L("AUDIT_LOG_CHANGE_TIME"),
        dataIndex: "changeTime",
        key: "changeTime",
        width: 150,
        render: renderDateTime,
      },
      {
        title: L("AUDIT_LOG_UPDATED_BY"),
        dataIndex: "user",
        key: "user",
        width: 150,
        render: (user) => <div>{user.displayName}</div>,
      },
      // {
      //   title: L("AUDIT_LOG_PROPERTIES"),
      //   dataIndex: "items",
      //   key: "items",
      //   width: 150,
      //   render: (items) => (
      //     <>
      //       {(items || []).map((item, index) => (
      //         <div key={index}>{item?.propertyName}</div>
      //       ))}
      //     </>
      //   ),
      // },
      {
        title: L("AUDIT_LOG_OLD_VALUE"),
        dataIndex: "items",
        key: "items",
        width: 150,
        render: (items) => (
          <>
            {(items || []).map((item, index) => (
              <div key={index}>{item.originalValueDisplay}</div>
            ))}
          </>
        ),
      },
      {
        title: L("AUDIT_LOG_NEW_VALUE"),
        dataIndex: "items",
        key: "items",
        width: 150,
        render: (items) => (
          <>
            {(items || []).map((item, index) => (
              <div key={index}>{item.newValueDisplay}</div>
            ))}
          </>
        ),
      },
    ]

    return (
      <Row>
        <Col sm={{ span: 24, offset: 0 }}>
          <Table
            size="middle"
            className=""
            rowKey={(record) => record.id}
            columns={columns}
            pagination={false}
            dataSource={this.state.dataTable ?? []}
            onChange={this.handleTableChange}
          />
        </Col>
      </Row>
    )
  }
}

export default withRouter(AuditTrail)
