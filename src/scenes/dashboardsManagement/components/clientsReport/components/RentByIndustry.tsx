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
function generateRandomColor() {
  const letters = "0123456789ABCDEF"
  let color = "#"
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}
export const globalPlugins: any = (additionPlugin?) => ({
  ...additionPlugin,
  legend: {
    position: "right",
  },
  datalabels: {
    color: "black",
    display: false,
    font: {
      weight: "bold",
      size: 11,
    },
    formatter: function (value) {
      return value > 1000000 ? Math.round(value / 1000000) + "M" : value
    },
  },
})
const RentByIndustry = (props: Props) => {
  React.useEffect(() => {
    const res = props.data.map((item) => item.Industry)
    setLabels(res)
    const resValue = props.data.map((item) => item.ContractAmount ?? 0)
    setValue(resValue)

    const backgroundColor = props.data.map(
      (item) => (item.Color = generateRandomColor())
    )
    setBackgroundColor(backgroundColor)
  }, [props.data])
  const [labels, setLabels] = React.useState<string[]>([])
  const [backgroundColor, setBackgroundColor] = React.useState<string[]>([])
  const [value, setValue] = React.useState<string[]>([])
  const data = {
    labels: labels,
    datasets: [
      {
        data: value,
        backgroundColor: backgroundColor,
        display: true,
      },
    ],
  }
  return (
    <>
      <Card>
        <strong>{L("RENT_BY_INDUSTRY")}</strong>
        <Row gutter={[8, 8]}>
          <Col sm={{ span: 24, offset: 0 }}>
            <Pie
              style={{ height: 150 }}
              height={250}
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
    </>
  )
}

export default RentByIndustry
