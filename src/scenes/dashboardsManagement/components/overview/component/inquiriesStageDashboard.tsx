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
import ChartDataLabels from "chartjs-plugin-datalabels"
import { Bar } from "react-chartjs-2"
import Row from "antd/lib/row"
import Col from "antd/lib/col"
import Table from "antd/lib/table"
import { Card } from "antd"

type Props = {
  data: any
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
    title: L("stage"),
    dataIndex: "stage",
    key: "stage",
    render: (stage) => <h4>{stage}</h4>,
  },
  {
    title: L("new"),
    dataIndex: "news",
    key: "news",
    render: (news) => <span>{news}</span>,
  },
  {
    title: L("renew"),
    dataIndex: "renew",
    key: "renew",
    render: (renew) => <span>{renew}</span>,
  },
  {
    title: L("old"),
    dataIndex: "old",
    key: "old",
    render: (old) => <span>{old}</span>,
  },
  {
    title: L("expierd"),
    dataIndex: "expierd",
    key: "expierd",
    render: (expierd) => <span>{expierd}</span>,
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
      return (context.dataset.data[context.dataIndex] || 0) > 0
    },
    font: {
      weight: "bold",
      size: 13,
    },
    formatter: Math.round,
  },
})
const InquiresStageDashboard = (props: Props) => {
  React.useEffect(() => {
    const res = props.data.map((item) => item.stage)
    setLabels(res)
  }, [])
  const [labels, setLabels] = React.useState<string[]>([])
  const data = {
    labels,
    datasets: [
      {
        label: "new",
        data: labels.map((label) => {
          const res = props.data.find((data) => data.stage === label)
          return res?.news ?? 0
        }),

        backgroundColor: "rgb(47, 174, 206)",
        stack: "Stack 0",
      },
      {
        label: L("renew"),
        data: labels.map((label) => {
          const res = props.data.find((data) => data.stage === label)
          return res?.renew ?? 0
        }),
        backgroundColor: "rgb(107, 194, 26)",
        stack: "Stack 0",
      },
      {
        label: L("old"),
        data: labels.map((label) => {
          const res = props.data.find((data) => data.stage === label)
          return res?.old ?? 0
        }),
        backgroundColor: "rgb(133, 43, 207)",
        stack: "Stack 0",
      },
      {
        label: L("expierd"),
        data: labels.map((label) => {
          const res = props.data.find((data) => data.stage === label)
          return res?.expierd ?? 0
        }),
        backgroundColor: "rgb(170, 170, 167)",
        stack: "Stack 0",
      },
    ],
  }
  return (
    <>
      <Card>
        <strong>{L("INQUIRIES_STAGE_OVERVIEW")}</strong>
        <Row gutter={[8, 8]}>
          <Col sm={{ span: 12, offset: 0 }}>
            <Table
              rowKey={(row) => row.groupAge}
              scroll={{ y: 250 }}
              pagination={false}
              columns={columns}
              dataSource={props.data}
            />
          </Col>
          <Col sm={{ span: 12, offset: 0 }}>
            <Bar
              data={data}
              height={300}
              options={{
                maintainAspectRatio: false,
                plugins: globalPlugins(),
              }}
              plugins={[ChartDataLabels]}
            />
          </Col>
        </Row>
      </Card>
    </>
  )
}

export default InquiresStageDashboard
