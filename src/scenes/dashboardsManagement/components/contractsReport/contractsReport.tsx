import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Row, Col, Table } from "antd"
import DoughnutChart from "../overview/doughnutChart"
import { inputCurrencyFormatter } from "@lib/helper"
import AppConsts from "@lib/appconst"
// import Doughnut from "./doughnutChart";
// import BarChart from "./barChart";

const { align } = AppConsts
const dataFake = [
  {
    id: 1,
    no: "01",
    contracNumber: "CT000000001",
    tn: "Maria Saris",
    project: "The Horizon",
    unit: "302",
    pr: 450000,
    ed: "30/01/2022",
    ps: "Payment Overdue",
    ds: "Wait For Pay",
  },
  {
    id: 2,
    no: "01",
    contracNumber: "CT000000001",
    tn: "Maria Saris",
    project: "The Horizon",
    unit: "302",
    pr: 450000,
    ed: "30/01/2022",
    ps: "Payment Overdue",
    ds: "Wait For Pay",
  },
  {
    id: 7,
    no: "01",
    contracNumber: "CT000000001",
    tn: "Maria Saris",
    project: "The Horizon",
    unit: "302",
    pr: 450000,
    ed: "30/01/2022",
    ps: "Payment Overdue",
    ds: "Wait For Pay",
  },
  {
    id: 3,
    no: "01",
    contracNumber: "CT000000001",
    tn: "Maria Saris",
    project: "The Horizon",
    unit: "302",
    pr: 450000,
    ed: "30/01/2022",
    ps: "Payment Overdue",
    ds: "Wait For Pay",
  },
]

const columns = [
  {
    title: "No.",
    dataIndex: "no",
    key: "no",
    width: "5%",
    render: (no) => <>{no}</>,
  },
  {
    title: "Contract Number",
    dataIndex: "contracNumber",
    key: "contracNumber",
    width: "",
    render: (contracNumber) => <>{contracNumber}</>,
  },
  {
    title: "Tenant",
    dataIndex: "tn",
    key: "tn",
    width: "",
    render: (tn) => <>{tn}</>,
  },
  {
    title: "Company",
    dataIndex: "company",
    key: "company",
    width: "",
    render: (company) => <>{company}</>,
  },
  {
    title: "Project",
    dataIndex: "project",
    key: "project",
    width: "",
    render: (project) => <>{project}</>,
  },
  {
    title: "Unit",
    dataIndex: "unit",
    key: "unit",
    width: "",
    render: (unit) => <>{unit}</>,
  },
  {
    title: "Price Rent(USD)",
    dataIndex: "pr",
    key: "pr",
    align: align.right,
    width: "",
    render: (pr) => <>{inputCurrencyFormatter(pr)}</>,
  },
  {
    title: "End Date",
    dataIndex: "ed",
    key: "ed",
    width: "",
    render: (ed) => <>{ed}</>,
  },
  {
    title: "Payment Status",
    dataIndex: "ps",
    key: "ps",
    width: "",
    render: (ps, row) =>
      row.id === 2 ? (
        <div style={{ color: "#EB5757" }}>{ps}</div>
      ) : (
        <div style={{ color: "#F2994A" }}>{ps}</div>
      ),
  },
  {
    title: "Deposit Status",
    dataIndex: "ds",
    key: "ds",
    width: "",
    render: (ds, row) =>
      row.id === 2 ? (
        <div style={{ color: "#EB5757" }}>{ds}</div>
      ) : (
        <div style={{ color: "#F2994A" }}>{ds}</div>
      ),
  },
]
@inject()
@observer
class ContractsReport extends AppComponentListBase<any, any> {
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
            <Col sm={{ span: 8, offset: 0 }}>
              <DoughnutChart Title="Lease Contract" />
            </Col>
            <Col sm={{ span: 8, offset: 0 }}>
              <DoughnutChart Title="Deposit" />
            </Col>
            <Col sm={{ span: 8, offset: 0 }}>
              <DoughnutChart Title="Expiring leased" />
            </Col>
            <Col sm={{ span: 24, offset: 0 }}>
              <Table
                scroll={{ y: 250 }}
                pagination={false}
                columns={columns}
                dataSource={dataFake}
              />
            </Col>
          </Row>
        </div>
      </>
    )
  }
}

export default ContractsReport
