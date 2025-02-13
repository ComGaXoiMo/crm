import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Col, Row, Table } from "antd"
import { L } from "@lib/abpUtility"
import Stores from "@stores/storeIdentifier"
// import FileUploadWrap from "@components/FileUpload/FileUploadCRM";
import withRouter from "@components/Layout/Router/withRouter"
import { renderDateTime } from "@lib/helper"
import moment from "moment"
import { dateTimeFormat } from "@lib/appconst"
import CompanyStore from "@stores/clientManagement/companyStore"

export interface IAuditTrailProps {
  parentId: any;
  companyStore: CompanyStore;
}
export interface IAuditTrailState {
  maxResultCount: number;
  skipCount: number;
  dataTable: any[];
}

@inject(Stores.CompanyStore)
@observer
class CompanyAuditTrail extends AppComponentListBase<
  IAuditTrailProps,
  IAuditTrailState
> {
  formRef: any = React.createRef();
  state = {
    maxResultCount: 10,
    skipCount: 0,
    dataTable: [] as any,
  };

  async componentDidMount() {
    await this.handleSearch()
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.parentId !== this.props.parentId) {
      if (this.props.parentId) {
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
  };

  handleSearch = async () => {
    await this.props.companyStore?.getAuditLogs({
      id: this.props.parentId,
    })
    const dataTableOld = [] as any
    const dataSort = this.props.companyStore?.auditLogResult?.sort(function (
      left,
      right
    ) {
      return moment.utc(right.changeTime).diff(moment.utc(left.changeTime))
    })

    dataSort.map((auditlog) => {
      auditlog?.items?.map((item) => {
        const newItem = { ...item, user: auditlog?.user }
        dataTableOld.push(newItem)
      })
    })
    dataTableOld.map((item) => {
      if (
        item.propertyName === "CommencementDate" ||
        item.propertyName === "ExpiryDate" ||
        item.propertyName === "MoveInDate" ||
        item.propertyName === "MoveOutDate" ||
        item.propertyName === "PaymentDate"
      ) {
        item.newValueDisplay = moment(item.newValueDisplay).format(
          dateTimeFormat
        )
        if (item.originalValueDisplay) {
          item.originalValueDisplay = moment(item.originalValueDisplay).format(
            dateTimeFormat
          )
        }
      }
    })
    const dataTable = [...dataTableOld]

    dataTableOld.map((item, index) => {
      if (
        dataTableOld[index - 1] &&
        item?.changeTime === dataTableOld[index - 1].changeTime
      ) {
        const { changeTime, user, ...newItem } = item

        dataTable.splice(index, 1, newItem)
      }
    })
    this.setState({ dataTable: dataTable })
  };

  render() {
    const columns = [
      {
        title: L("AUDIT_LOG_CHANGE_TIME"),
        dataIndex: "changeTime",
        key: "changeTime",
        width: 80,
        render: renderDateTime,
      },
      {
        title: L("AUDIT_LOG_UPDATED_BY"),
        dataIndex: "user",
        key: "user",
        width: 80,
        render: (user) => <div>{user?.displayName}</div>,
      },
      {
        title: L("AUDIT_LOG_PROPERTIES"),
        dataIndex: "propertyName",
        key: "propertyName",
        width: 80,
        render: (propertyName, row) => <>{propertyName}</>,
      },
      {
        title: L("AUDIT_LOG_OLD_VALUE"),
        dataIndex: "originalValueDisplay",
        key: "originalValueDisplay",
        width: 150,
        render: (originalValueDisplay) => <>{originalValueDisplay}</>,
      },
      {
        title: L("AUDIT_LOG_NEW_VALUE"),
        dataIndex: "newValueDisplay",
        key: "newValueDisplay",
        width: 150,
        render: (newValueDisplay) => <>{newValueDisplay}</>,
      },
    ]

    return (
      <Row>
        <Col sm={{ span: 24, offset: 0 }}>
          <Table
            size="middle"
            rowKey={(record) => record.id}
            columns={columns}
            pagination={false}
            bordered
            dataSource={this.state.dataTable ?? []}
            onChange={this.handleTableChange}
          />
        </Col>
      </Row>
    )
  }
}

export default withRouter(CompanyAuditTrail)
