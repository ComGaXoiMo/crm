import { L } from "@lib/abpUtility"
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
  lable: any
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
    formatter: Math.round,
  },
})
const UnitTypeByMonth = (props: Props) => {
  React.useEffect(() => {
    const res = props.data.map((item) => item.name)
    setLabels(res)
  }, [])
  const [labels, setLabels] = React.useState<string[]>([])
  const data = {
    labels,
    datasets: [
      {
        label: "Leased",
        data: labels.map((label) => {
          const res = props.data.find((data) => data.name === label)
          return res?.Leased ?? 0
        }),

        backgroundColor: "rgb(255, 99, 132)",
        stack: "Stack 0",
      },
      {
        label: L("Vacant"),
        data: labels.map((label) => {
          const res = props.data.find((data) => data.name === label)
          return res?.Vacant ?? 0
        }),
        backgroundColor: "rgb(75, 192, 192)",
        stack: "Stack 0",
      },
      {
        label: L("Showroom"),
        data: labels.map((label) => {
          const res = props.data.find((data) => data.name === label)
          return res?.Showroom ?? 0
        }),
        backgroundColor: "rgb(150, 207, 43)",
        stack: "Stack 0",
      },
      {
        label: L("Renovation"),
        data: labels.map((label) => {
          const res = props.data.find((data) => data.name === label)
          return res?.Renovation ?? 0
        }),
        backgroundColor: "rgb(43, 95, 207)",
        stack: "Stack 0",
      },
    ],
  }
  return (
    <>
      <Card>
        <strong>{L("PROJECT_OVERVIEW")}</strong>
        <Row gutter={[8, 8]}>
          <Col sm={{ span: 24, offset: 0 }}>
            <Bar
              data={data}
              style={{ height: 150 }}
              height={250}
              options={{
                maintainAspectRatio: false,
                plugins: globalPlugins(),
              }}
              plugins={[ChartDataLabels]}
            />
          </Col>
          <Col
            style={{ display: "flex", justifyContent: "center" }}
            sm={{ span: 24, offset: 0 }}
          >
            <strong>{props.lable}</strong>
          </Col>
        </Row>
      </Card>
    </>
  )
}

export default UnitTypeByMonth
