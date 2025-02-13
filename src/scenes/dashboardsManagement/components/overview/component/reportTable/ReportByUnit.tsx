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
// import * as XLSXStyle from "xlsx-style";
import Row from "antd/lib/row"
// import Col from "antd/lib/col";
// import Table from "antd/lib/table";
// import Typography from "antd/lib/typography";
import { Button, Card, Col, Table } from "antd"
import AppConsts, { monthCharFormat } from "@lib/appconst"
import withRouter from "@components/Layout/Router/withRouter"
import { formatNumberFloat, tableToExcel } from "@lib/helper"
import { ExcelIcon } from "@components/Icon"
import moment from "moment"
// import OccChart from "./OccChart";
// import OccChart2 from "./OccChart2";
const { align } = AppConsts
type Props = {
  dataSQMOcc: any
  dataUnitOcc: any
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
const getColumn = (totalColumn?) => {
  const data = [
    {
      title: L("PROJECT_NAME"),
      dataIndex: "ProjectName",
      ellipsis: false,
      width: "13%",
      key: "ProjectName",

      render: (ProjectName) => <h4>{ProjectName}</h4>,
    },

    {
      title: L("MONTH"),
      dataIndex: "FormattedDateName",
      align: align.center,
      ellipsis: false,
      width: "9%",
      key: "FormattedDateName",

      render: (Month) => <>{moment(Month).format(monthCharFormat)}</>,
    },

    {
      title: L("TOTAL_AVAILAVLE"),
      dataIndex: "TotalAvailable",
      align: align.right,
      ellipsis: false,
      width: "9%",
      key: "TotalAvailable",

      render: (TotalAvailable) => (
        <h4>{formatNumberFloat(TotalAvailable) ?? 0}</h4>
      ),
    },

    // {
    //   title: L("LEASED"),
    //   dataIndex: "Leased",
    //   align: align.right,
    //   ellipsis: false,
    //   width: "9%",
    //   key: "Leased",

    //   render: (Leased) => <h4>{formatNumberFloat(Leased) ?? 0}</h4>,
    // },

    {
      title: L("LEASED"),
      align: align.right,
      dataIndex: "Percent",
      ellipsis: false,
      width: "9%",
      key: "Percent",

      render: (Percent, row) => (
        <h4>
          {formatNumberFloat(row?.Leased) ?? 0}
          <br /> ({formatNumberFloat(Percent) ?? 0}%)
        </h4>
      ),
    },

    {
      align: align.right,
      title: L("VACANT"),
      dataIndex: "TotalVacant",
      ellipsis: false,
      width: "9%",
      key: "TotalVacant",

      render: (TotalVacant) => <h4>{formatNumberFloat(TotalVacant) ?? 0}</h4>,
    },
    {
      align: align.right,
      title: L("SHOWROOM"),
      dataIndex: "Showroom",
      ellipsis: false,
      width: "9%",
      key: "Showroom",

      render: (Showroom) => <h4>{formatNumberFloat(Showroom) ?? 0}</h4>,
    },
    {
      align: align.right,
      title: L("RENOVATION"),
      dataIndex: "Renovation",
      ellipsis: false,
      width: "9%",
      key: "Renovation",

      render: (Renovation) => <h4>{formatNumberFloat(Renovation) ?? 0}</h4>,
    },
    {
      align: align.right,
      title: L("PMH_USE"),
      dataIndex: "PMHuse",
      ellipsis: false,
      width: "9%",
      key: "PMHuse",

      render: (PMHUse) => <h4>{formatNumberFloat(PMHUse) ?? 0}</h4>,
    },
    {
      title: L("IN_HOUSE_USE"),
      align: align.right,
      dataIndex: "Inhouseuse",
      ellipsis: false,
      width: "9%",
      key: "Inhouseuse",

      render: (inhouseUse) => <h4>{formatNumberFloat(inhouseUse) ?? 0}</h4>,
    },
    totalColumn,
  ]
  return data
}
const columnsUnit = getColumn({
  title: L("TOTAL_UNIT"),
  align: align.right,
  dataIndex: "TotalUnit",
  ellipsis: false,
  width: "9%",
  key: "TotalUnit",

  render: (TotalUnit) => <h4>{formatNumberFloat(TotalUnit) ?? 0}</h4>,
})
const columnsSize = getColumn({
  title: L("TOTAL_SIZE"),
  align: align.right,
  dataIndex: "TotalSQM",
  ellipsis: false,
  width: "9%",
  key: "TotalSQM",

  render: (TotalSQM) => <h4>{formatNumberFloat(TotalSQM) ?? 0}</h4>,
})

const ReportByUnit = (props: Props) => {
  return (
    <>
      <Row gutter={[8, 8]} style={{ marginBottom: 10 }}>
        <Col sm={{ span: 24, offset: 0 }}>
          <Card className="card-report-fit-height">
            <strong>{L("REPORT_BY_SQM")}</strong>
            <div className="content-right">
              <Button
                onClick={() => tableToExcel("tblOccBySqm")}
                className="button-primary"
                icon={<ExcelIcon />}
              ></Button>
            </div>
            <Table
              size="middle"
              id={"tblOccBySqm"}
              className="custom-ant-row"
              rowKey={(row) => row.groupAge}
              scroll={{ y: props.isConvertting ? undefined : 450 }}
              pagination={false}
              columns={columnsSize}
              dataSource={props.dataSQMOcc}
            />
          </Card>
        </Col>
        <Col sm={{ span: 24, offset: 0 }}>
          <Card className="card-report-fit-height">
            <strong>{L("REPORT_BY_UNIT")}</strong>
            <div className="content-right">
              <Button
                onClick={() => tableToExcel("tblOccByUnit")}
                className="button-primary"
                icon={<ExcelIcon />}
              ></Button>
            </div>
            <Table
              id={"tblOccByUnit"}
              size="middle"
              className="custom-ant-row"
              rowKey={(row) => row.groupAge}
              scroll={{ y: props.isConvertting ? undefined : 450 }}
              pagination={false}
              columns={columnsUnit}
              dataSource={props.dataUnitOcc}
              bordered
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default withRouter(ReportByUnit)
