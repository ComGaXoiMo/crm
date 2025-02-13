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
import Row from "antd/lib/row"
import { Card, Col } from "antd"
import { Line } from "react-chartjs-2"

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

    display: false,
    font: {
      size: 11,
    },
  },
  legend: {
    display: false,
  },
  tooltip: {
    position: "nearest",
    backgroundColor: "#F2F4F8",
    titleColor: "#000",
    bodyColor: "#000",
    borderColor: "#646464",
    borderWidth: 0.5,
    callbacks: {
      label: function (context) {
        let label = context.dataset.label || ""

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
})
const ActivityByWeek = (props: Props) => {
  React.useEffect(() => {
    const res = props.data.map((item) => `${item.DateType}`)
    setLabels(res)
    getListKey(props.data)
  }, [])
  React.useEffect(() => {
    const res = props.data.map((item) => `${item.DateType}`)
    setLabels(res)
    getListKey(props.data)
  }, [props.data])
  const [labels, setLabels] = React.useState<any[]>([])
  const [listKey, setListKey] = React.useState<any[]>([])

  const getListKey = (lsitData) => {
    setListKey(["totalActivity"])
  }
  const listColor = [
    "#961212",
    "#b33e99",
    "#6926d6",
    "#37ac47",
    "#2740cf",
    "#bcbdbc",
  ]

  const data = {
    labels: labels,
    datasets: listKey.map((item, index) => {
      return {
        label: L(item),
        data: labels.map((label) => {
          const res = props.data.find((data) => `${data.DateType}` === label)
          return res?.[item] ?? 0
        }),
        borderColor: listColor[index],
        backgroundColor: listColor[index],
        pointStyle: "circle",
        pointRadius: 2,
        pointHoverRadius: 10,
      }
    }),
  }

  return (
    <>
      <Card className="card-report">
        <span className="card-overview-title">
          {L("TOTAL_KEY_ACTIVITY_OF_ALL_USER_BY_WEEK")}
        </span>
        <Row gutter={[8, 8]}>
          <Col sm={{ span: 24, offset: 0 }}>
            <Line
              className="w-100"
              style={{ height: 230 }}
              data={data}
              height={300}
              options={{
                maintainAspectRatio: false,
                plugins: globalPlugins(),
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                  y: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
              plugins={[ChartDataLabels]}
            />
          </Col>
        </Row>
      </Card>
    </>
  )
}

export default ActivityByWeek
