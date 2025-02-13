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
import { Pie } from "react-chartjs-2"
import Row from "antd/lib/row"
import Col from "antd/lib/col"
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

export const globalPlugins: any = (additionPlugin?) => ({
  ...additionPlugin,
  legend: {
    position: "right",
  },
  datalabels: {
    color: "black",
    display: function (context) {
      return (context.dataset.data[context.dataIndex] || 0) > 1
    },
    font: {
      size: 15,
    },
  },
})
const ChartTaskModule = (props: Props) => {
  React.useEffect(() => {
    const res = props.data.map((item) => item.Module)
    setLabels(res)
    const backgroundColor = props.data.map((item) => item.Color)
    setBackgroundColor(backgroundColor)
    const dataConut = props.data.map((item) => item.Count)
    SetDataCount(dataConut)
  }, [props.data])
  const [labels, setLabels] = React.useState<string[]>([])
  const [backgroundColor, setBackgroundColor] = React.useState<string[]>([])
  const [dataCount, SetDataCount] = React.useState<string[]>([])
  const data = {
    labels: labels,
    datasets: [
      {
        data: dataCount,
        backgroundColor: backgroundColor,
      },
    ],
  }
  return (
    <Card>
      <strong>{L("ACTIVIRTY_OVERVIEW")}</strong>
      <Row gutter={[8, 8]}>
        <Col sm={{ span: 24, offset: 0 }}>
          <Pie
            style={{ height: 150 }}
            height={300}
            plugins={[ChartDataLabels]}
            data={data}
            options={{
              maintainAspectRatio: false,
              plugins: globalPlugins(),
            }}
          />
        </Col>
      </Row>
    </Card>
  )
}

export default ChartTaskModule
