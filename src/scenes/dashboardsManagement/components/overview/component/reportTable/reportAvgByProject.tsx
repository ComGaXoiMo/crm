import { L } from "@lib/abpUtility"
// import DashboardStore from '@stores/dashboardStore'
import React from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  registerables as registerablesJS,
} from "chart.js"

import Row from "antd/lib/row"

import { Button, Card, Col, Table } from "antd"
import AppConsts from "@lib/appconst"
import withRouter from "@components/Layout/Router/withRouter"
import { formatNumber, tableToExcel } from "@lib/helper"
import { ExcelIcon } from "@components/Icon"

const { align } = AppConsts
type Props = {
  data: any
  isConvertting: boolean
}
ChartJS.register(
  ...registerablesJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const columns = [
  {
    title: L("PROJECT_NAME"),
    dataIndex: "ProjectName",
    ellipsis: false,
    width: 100,
    key: "ProjectName",

    render: (ProjectName) => <h4>{ProjectName}</h4>,
  },

  {
    title: L("UNIT_TYPE"),
    dataIndex: "UnitTypeName",
    align: align.center,
    ellipsis: false,
    width: 100,
    key: "UnitTypeName",

    render: (UnitTypeName) => <h4>{UnitTypeName}</h4>,
  },
  {
    title: L("AGV_RENT"),
    dataIndex: "AVGRent",
    align: align.right,
    ellipsis: false,
    width: 150,
    key: "AVGRent",

    render: (AVGRent) => <h4>{formatNumber(AVGRent) ?? 0}</h4>,
  },
  {
    title: L("MAX_RENT"),
    dataIndex: "MaxRent",
    align: align.right,
    ellipsis: false,
    width: 150,
    key: "MaxRent",

    render: (MaxRent) => <h4>{formatNumber(MaxRent) ?? 0}</h4>,
  },
  {
    title: L("MIN_RENT"),
    dataIndex: "MinRent",
    align: align.right,
    ellipsis: false,
    width: 150,
    key: "MinRent",

    render: (MinRent) => <h4>{formatNumber(MinRent) ?? 0}</h4>,
  },
]

export const globalPlugins: any = (additionPlugin?) => ({
  ...additionPlugin,

  datalabels: {
    color: "black",
    display: function (context) {
      let total = 0
      context.dataset.data.map((item) => {
        total = total + item
      })
      return (context.dataset.data[context.dataIndex] || 0) > 1
    },
    font: {
      weight: "bold",
      size: 13,
    },
    formatter: Math.round,
  },
})
const ReportAvgByProject = (props: Props) => {
  return (
    <>
      <Row gutter={[8, 8]} style={{ marginBottom: 10 }}>
        <Col sm={{ span: 24, offset: 0 }}>
          <Card className="card-report-fit-height">
            <strong>{L("REPORT_AVG_BY_UNIT_TYPE")}</strong>
            <div className="content-right">
              <Button
                onClick={() => tableToExcel("tblAvgUnitTypeByProject")}
                className="button-primary"
                icon={<ExcelIcon />}
              ></Button>
            </div>
            <Table
              id={"tblAvgUnitTypeByProject"}
              size="middle"
              className="custom-ant-row"
              rowKey={(row) => row.groupAge}
              scroll={{ y: props.isConvertting ? undefined : 450 }}
              pagination={false}
              columns={columns}
              dataSource={props.data}
              bordered
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default withRouter(ReportAvgByProject)
