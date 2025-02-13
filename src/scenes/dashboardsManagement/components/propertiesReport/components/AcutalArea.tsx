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
// import Col from "antd/lib/col";
// import Table from "antd/lib/table";
// import Typography from "antd/lib/typography";
import { Card, Col } from "antd"

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
      size: 11,
    },
    formatter: Math.round,
  },
})
const AcutalArea = (props: Props) => {
  React.useEffect(() => {
    const res = props.data.map((item) => item.name)
    setLabels(res)
  }, [])
  const [labels, setLabels] = React.useState<string[]>([])
  const data = {
    labels: labels,
    datasets: [
      {
        label: "1-1",
        data: labels.map((label) => {
          const res = props.data.find((data) => data.name === label)

          return res?.t11 ?? 0
        }),
        backgroundColor: "#118dff",

        stack: "Stack 0",
      },
      {
        label: L("2-2"),
        data: labels.map((label) => {
          const res = props.data.find((data) => data.name === label)
          return res?.t22 ?? 0
        }),
        backgroundColor: "#3d53f2",
        stack: "Stack 0",
      },
      {
        label: L("2-3"),
        data: labels.map((label) => {
          const res = props.data.find((data) => data.name === label)

          return res?.t23 ?? 0
        }),
        backgroundColor: "#e66c37",
        stack: "Stack 0",
      },
      {
        label: L("4-3"),
        data: labels.map((label) => {
          const res = props.data.find((data) => data.name === label)

          return res?.t43 ?? 0
        }),
        backgroundColor: "#da4ff0",
        stack: "Stack 0",
      },
      {
        label: L("4-4"),
        data: labels.map((label) => {
          const res = props.data.find((data) => data.name === label)

          return res?.t44 ?? 0
        }),
        backgroundColor: "#e044a7",
        stack: "Stack 0",
      },
    ],
  }
  return (
    <>
      <Card>
        <strong>{L("ACUTAL_AREA")}</strong>
        <Row gutter={[8, 8]}>
          <Col sm={{ span: 24, offset: 0 }}>
            <Bar
              style={{ height: 150 }}
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

export default AcutalArea
