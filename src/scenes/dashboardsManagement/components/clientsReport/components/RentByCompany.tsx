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
const RentByCompany = (props: Props) => {
  React.useEffect(() => {
    const res = props.data.map((item) => item.BusinessName)
    const backgroundColor = props.data.map(
      (item) => (item.Color = generateRandomColor())
    )
    setBackgroundColor(backgroundColor)
    setLabels(res)
    const dataConut = props.data.map((item) => item.ContractAmount)
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
    <>
      <Card>
        <strong>{L("RENT_BY_COMPANY")}</strong>
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

export default RentByCompany
