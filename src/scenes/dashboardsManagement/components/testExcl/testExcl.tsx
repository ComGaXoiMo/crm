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
import * as XLSX from "xlsx-js-style"

import Row from "antd/lib/row"

import { Button, Col, Table } from "antd"
import AppConsts from "@lib/appconst"
import withRouter from "@components/Layout/Router/withRouter"
import { formatNumber } from "@lib/helper"
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

const TestExcl = (props: Props) => {
  function tableToExcel(docId) {
    const data = convertDataToExcelFormat(fakeData)
    const workbook = XLSX.utils.book_new()
    const sheetName = "Sheet1"

    // Add a worksheet to the workbook
    const worksheet = XLSX.utils.aoa_to_sheet(data, {
      sheetStubs: true,
      cellDates: true,
      dateNF: "dd/MM/yyyy",
      cellStyles: true,
    })
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    console.log(worksheet)
    const ws = workbook.Sheets[sheetName]
    const range = XLSX.utils.decode_range(ws["!ref"] ?? "")
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell = XLSX.utils.encode_cell({ r: R, c: C })
        if (!ws[cell]) continue

        ws[cell].s = {
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          },
        }
      }
    }
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const colWidth = getColWidth(ws, C)
      ws["!cols"] = ws["!cols"] || []
      ws["!cols"][C] = { wch: colWidth }
    }

    // Save the workbook to a file
    XLSX.writeFile(workbook, "exported_data.xlsx")
  }

  const convertDataToExcelFormat = (data) => {
    if (data.length === 0) {
      return []
    }

    // Extract keys from the first object in the data array
    const header = Object.keys(data[0])

    // Map each object in data to an array of values
    const rows = data.map((item) => header.map((key) => item[key]))

    // Combine header and rows
    const excelData = [header, ...rows]

    return excelData
  }
  function getColWidth(sheet, colIndex) {
    const maxWidth = 50 // Set a maximum width to avoid overly wide columns
    const cellWidths = [] as any
    const range = XLSX.utils.decode_range(sheet["!ref"])

    for (let R = range.s.r; R <= range.e.r; ++R) {
      const cellValue =
        sheet[XLSX.utils.encode_cell({ r: R, c: colIndex })]?.v || ""
      const cellTextLength = cellValue.toString().length
      cellWidths.push(cellTextLength)
    }

    // Add extra padding (you can adjust this as needed)
    const padding = 1
    const colWidth = Math.min(maxWidth, Math.max(...cellWidths) + padding)

    return colWidth
  }
  return (
    <>
      <Row gutter={[8, 8]} style={{ marginBottom: 10 }}>
        <Col sm={{ span: 24, offset: 0 }}>
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
            rowKey={(row, index) => `${index}`}
            scroll={{ y: props.isConvertting ? undefined : 450 }}
            pagination={false}
            columns={columns}
            dataSource={fakeData}
            bordered
          />
        </Col>
      </Row>
    </>
  )
}

export default withRouter(TestExcl)

const fakeData = [
  {
    UnitTypeName: "1:1",
    Count: 2,
    ProjectId: 2,
    ProjectName: "Crescent Residence 1",
    UnitTypeId: 1,
    AVGRent: 42973020.53,
    MaxRent: 75969501.47,
    MinRent: 9976539.59,
    creationTime: "2023-09-13T04:02:24.4708433Z",
  },
  {
    Count: 1,
    ProjectId: 4,
    ProjectName: "Crescent Residence 2",
    UnitTypeId: 2,
    UnitTypeName: "1:2",
    AVGRent: 983870967.74,
    MaxRent: 983870967.74,
    MinRent: 983870967.74,
    creationTime: "2023-09-13T04:02:24.4708433Z",
  },
  {
    Count: 4,
    ProjectId: 1,
    ProjectName: "Crescent Residence 5",
    UnitTypeId: 3,
    UnitTypeName: "2:2",
    AVGRent: 489820381.2325,
    MaxRent: 682917888.56,
    MinRent: 218181818.18,
    creationTime: "2023-09-13T04:02:24.4708433Z",
  },
  {
    Count: 3,
    ProjectId: 4,
    ProjectName: "Crescent Residence 2",
    UnitTypeId: 3,
    UnitTypeName: "2:2",
    AVGRent: 617575757.576666,
    MaxRent: 670909090.91,
    MinRent: 590909090.91,
    creationTime: "2023-09-13T04:02:24.4708433Z",
  },
  {
    Count: 24,
    ProjectId: 1,
    ProjectName: "Crescent Residence 5",
    UnitTypeId: 5,
    UnitTypeName: "3:2",
    AVGRent: 708314006.282083,
    MaxRent: 1463636363.64,
    MinRent: 0,
    creationTime: "2023-09-13T04:02:24.4708433Z",
  },
  {
    Count: 1,
    ProjectId: 4,
    ProjectName: "Crescent Residence 2",
    UnitTypeId: 6,
    UnitTypeName: "3:3",
    AVGRent: 636363636.36,
    MaxRent: 636363636.36,
    MinRent: 636363636.36,
    creationTime: "2023-09-13T04:02:24.4708433Z",
  },
  {
    Count: 2,
    ProjectId: 4,
    ProjectName: "Crescent Residence 2",
    UnitTypeId: 7,
    UnitTypeName: "3:5",
    AVGRent: 16770682448.04,
    MaxRent: 32905001259.72,
    MinRent: 636363636.36,
    creationTime: "2023-09-13T04:02:24.4708433Z",
  },
]
