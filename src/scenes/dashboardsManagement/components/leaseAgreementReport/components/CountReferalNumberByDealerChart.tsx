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
import { Card } from "antd"

type Props = {
  data: any
  height?: number
  title?: any
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
    display: false,
  },
  datalabels: {
    color: "black",
    display: false,
    font: {
      size: 11,
    },
  },
})
const CountReferalNumberByDealerChart = (props: Props) => {
  React.useEffect(() => {
    const res = props.data.map((item) => item.Dealer)
    setLabels(res)
    getListKey(props.data)
  }, [props.data])
  const [labels, setLabels] = React.useState<string[]>([])
  const [listKey, setListKey] = React.useState<any[]>([])

  const getListKey = (lsitData) => {
    const statusKeys = new Set()

    lsitData.forEach((entry) => {
      Object.keys(entry).forEach((key) => {
        statusKeys.add(key)
      })
    })
    const statusKeysArray = Array.from(statusKeys)
    setListKey(
      statusKeysArray.filter((item) => item != "Dealer" && item != "Color")
    )
  }

  const data = {
    labels: labels,
    datasets: listKey.map((item) => {
      return {
        label: item,
        data: labels.map((label) => {
          const res = props.data.find((data) => data.Dealer === label)

          return res?.[item] ?? 0
        }),
        backgroundColor: labels.map((label) => {
          const res = props.data.find((data) => data.Dealer === label)

          return res?.Color
        }),
        stack: "Stack 0",
      }
    }),
  }

  return (
    <Card>
      <strong>
        {props.title ? props.title : L("NUMBER_CONTRACT_BY_STAFF")}
      </strong>
      <Row gutter={[8, 8]}>
        <Col sm={{ span: 24, offset: 0 }}>
          <Bar
            style={{ height: props.height ? props.height : 150 }}
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

export default CountReferalNumberByDealerChart
