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
  // legend: {
  //   position: "left",
  // },
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
})
const CountOfUnitByCheckInOut = (props: Props) => {
  React.useEffect(() => {
    const res = props.data.map((item) => item.name)
    setLabels(res)
  }, [])
  const [labels, setLabels] = React.useState<string[]>([])
  const data = {
    labels: labels,
    datasets: [
      {
        label: "0-10 days",
        data: labels.map((label) => {
          const res = props.data.find((data) => data.name === label)

          return res?.from0to10 ?? 0
        }),
        backgroundColor: "#118dff",

        stack: "Stack 0",
      },
      {
        label: L("10-20 days"),
        data: labels.map((label) => {
          const res = props.data.find((data) => data.name === label)
          return res?.from10to20 ?? 0
        }),
        backgroundColor: "#3d53f2",
        stack: "Stack 0",
      },
      {
        label: L("20-30 days"),
        data: labels.map((label) => {
          const res = props.data.find((data) => data.name === label)

          return res?.from20to30 ?? 0
        }),
        backgroundColor: "#e66c37",
        stack: "Stack 0",
      },
    ],
  }
  return (
    <>
      <Card>
        <strong>{L("COUNT_OF_UNIT_BY_PROJECT_AND_CHECKINOUT")}</strong>
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

export default CountOfUnitByCheckInOut
