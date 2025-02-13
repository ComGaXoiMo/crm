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
  },

  legend: {
    display: false,
  },
})
const LeaseExprirationChart = (props: Props) => {
  React.useEffect(() => {
    const res = props.data.map((item) => item.ExpiredType)
    setLabels(res)
    const resValue = props.data.map((item) => item.Count ?? 0)
    setValue(resValue)
  }, [])
  React.useEffect(() => {
    const res = props.data.map((item) => item.ExpiredType)
    setLabels(res)
    const resValue = props.data.map((item) => item.Count ?? 0)
    setValue(resValue)
  }, [props.data])
  const [labels, setLabels] = React.useState<any[]>([])
  const [value, setValue] = React.useState<string[]>([])

  const data = {
    labels: labels,
    datasets: [
      {
        data: value,
        backgroundColor: "#FEC20C",
      },
    ],
  }

  return (
    <>
      <Card className="card-report">
        <span className="card-overview-title">{L("LEASE_EXPRIRATION")}</span>
        <Row gutter={[8, 8]}>
          <Col sm={{ span: 24, offset: 0 }}>
            <Bar
              className="w-100"
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

export default LeaseExprirationChart
