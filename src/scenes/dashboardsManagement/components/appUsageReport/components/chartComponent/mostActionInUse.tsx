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
  tooltip: {
    callbacks: {
      label: function (context) {
        let label = L(context.dataset.label) || ""

        if (label) {
          label += ": "
        }
        if (context.parsed.y !== null) {
          label += context.parsed.y
        }
        return label
      },
    },
  },
  legend: {
    display: false,
  },
})
const MostActionInUse = (props: Props) => {
  React.useEffect(() => {
    const res = props.data.map((item) => `${item.Module}`)
    setLabels(res)
    getListKey(props.data)
  }, [])
  React.useEffect(() => {
    const res = props.data.map((item) => `${item.Module}`)
    setLabels(res)
    getListKey(props.data)
  }, [props.data])
  const [labels, setLabels] = React.useState<any[]>([])

  const [listKey, setListKey] = React.useState<any[]>([])

  const getListKey = (lsitData) => {
    setListKey(["lastValue", "thisValue"])
  }
  const listColor = ["#B4D1F9", "#FEC20C"]

  const data = {
    labels: labels,
    datasets: listKey.map((item, index) => {
      return {
        label: item,
        data: labels.map((label) => {
          const res = props.data.find((data) => `${data.Module}` === label)
          return res?.[item] ?? 0
        }),
        backgroundColor: listColor[index],
      }
    }),
  }

  return (
    <>
      <Card className="card-report">
        <span className="card-overview-title">
          {L("THE_MOST_ACTION_IN_USE")}
        </span>
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

export default MostActionInUse
