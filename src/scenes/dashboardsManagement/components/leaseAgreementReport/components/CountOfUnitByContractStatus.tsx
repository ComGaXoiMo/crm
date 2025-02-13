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
    formatter: Math.round,
  },
})
const CountOfUnitByContractStatus = (props: Props) => {
  React.useEffect(() => {
    const res = props.data.map((item) => item.Status)
    const backgroundColor = props.data.map((item) => item.Color)
    setBackgroundColor(backgroundColor)
    setLabels(res)
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
    <>
      <Card>
        <strong>{L("COUNT_OF_UNIT_BY_CONTRACT_STATUS")}</strong>
        <Row gutter={[8, 8]}>
          <Col sm={{ span: 24, offset: 0 }}>
            <Pie
              style={{ height: 150 }}
              // style={{ height: 150 }}
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
    </>
  )
}

export default CountOfUnitByContractStatus
