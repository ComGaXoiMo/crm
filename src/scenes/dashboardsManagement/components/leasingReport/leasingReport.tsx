import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Row, Col, Table } from "antd"
// import { L } from "@lib/abpUtility";
import InOutChart from "./inOutChart"
import InquiresStageDashboard from "../overview/component/inquiriesStageDashboard"
// import Doughnut from "./doughnutChart";
// import BarChart from "./barChart";

const columnsInOut = [
  {
    title: "Project",
    dataIndex: "project",
    key: "project",
    width: "project",
    render: (project) => <>{project}</>,
  },
  {
    title: "Unit",
    dataIndex: "unit",
    key: "unit",
    width: "unit",
    render: (unit) => <>{unit}</>,
  },
  {
    title: "Tenant",
    dataIndex: "tenant",
    key: "tenant",
    width: "tenant",
    render: (tenant) => <>{tenant ?? "---"}</>,
  },
  {
    title: "Count Day Free",
    dataIndex: "count",
    key: "count",
    width: "count",
    render: (count) => <>{count}</>,
  },
  {
    title: "type ",
    dataIndex: "type",
    key: "type",
    width: "type",
    render: (type) => <>{type?.name}</>,
  },
]
@inject()
@observer
class LeasingsReport extends AppComponentListBase<any, any> {
  formRef: any = React.createRef()
  state = {}

  changeTab = (tabKey) => {
    this.setState({ tabActiveKey: tabKey })
  }
  public render() {
    return (
      <>
        <div className="dashboard-style">
          <Row gutter={[16, 20]}>
            <Col sm={{ span: 24, offset: 0 }}>
              <InquiresStageDashboard data={InquiriesState} />
            </Col>

            <Col sm={{ span: 12, offset: 0 }}>
              <InOutChart Title="In - Out" data={dataInOut} />
            </Col>
            <Col sm={{ span: 12, offset: 0 }}>
              <Table
                scroll={{ y: 250 }}
                pagination={false}
                columns={columnsInOut}
                dataSource={dataInOut === undefined ? [] : dataInOut}
              />
            </Col>
          </Row>
        </div>
      </>
    )
  }
}

export default LeasingsReport

const dataInOut = [
  {
    project: "project 01",
    count: 9,
    typeId: 1,
    type: {
      id: 1,
      name: "0-10",
    },
    unit: "a1",
    tenant: "ms. He",
  },
  {
    project: "project 02",
    count: 12,
    typeId: 2,
    type: {
      id: 2,
      name: "10-20",
    },
    unit: "a2",
    tenant: "mr. Hoang",
  },
  {
    project: "project 03",
    count: 23,
    typeId: 3,
    type: {
      id: 3,
      name: "20-30",
    },
    unit: "b2",
    tenant: "ms. Hoa",
  },
  {
    project: "project 04",
    count: 10,
    typeId: 4,
    type: {
      id: 4,
      name: "30-...",
    },
    unit: "c4",
    tenant: null,
  },
]
const InquiriesState = [
  {
    stage: "Prospect",
    news: 5,
    renew: 3,
  },
  {
    stage: "Offer",
    news: 2,
    renew: 4,
    old: 3,
  },
  {
    stage: "Lease Agreement",
    news: 7,
    renew: 2,
  },
  {
    stage: "Closed",
    news: 12,
    renew: 8,
  },
  {
    stage: "Droped",
    news: 5,
    renew: 10,
    expierd: 4,
  },
]
