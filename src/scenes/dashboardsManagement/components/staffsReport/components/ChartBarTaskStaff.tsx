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
  listColor: any
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
      size: 13,
    },
  },
})
const ChartBarTaskStaff = (props: Props) => {
  React.useEffect(() => {
    const res = props.data.map((item) => item.Staff)
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
    setListKey(statusKeysArray.filter((item) => item != "Staff"))
  }

  const data = {
    labels: labels,
    datasets: listKey.map((item) => {
      return {
        label: item,
        data: labels.map((label) => {
          const res = props.data.find((data) => data.Staff === label)

          return res?.[item] ?? 0
        }),
        backgroundColor: props.listColor.find(
          (itemChild) => itemChild.Status === item
        )?.Color,
        stack: "Stack 0",
      }
    }),
  }

  return (
    <>
      <Card>
        <strong>{L("TASK_STATUS_BY_STAFF")}</strong>
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

export default ChartBarTaskStaff
