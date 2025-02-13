// import DashboardStore from '@stores/dashboardStore'
import ChartDataLabels from "chartjs-plugin-datalabels"
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
// import ChartDataLabels from "chartjs-plugin-datalabels";
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
  legend: {
    position: "left",
    display: false,
  },
  datalabels: {
    color: "black",
    display: function (context) {
      return (context.dataset.data[context.dataIndex] || 0) > 0
    },
    font: {
      size: 14,
    },
    formatter: Math.round,
  },
})
const OccByProject = (props: Props) => {
  React.useEffect(() => {
    const res = props.data.map((item) => item.name)
    setLabels(res)
  }, [])
  const [labels, setLabels] = React.useState<string[]>([])
  const data = {
    labels,
    datasets: [
      {
        data: props.data.map((label) => {
          // const res = props.data.find((data) => data.price === label);
          return label?.total ?? 0
        }),
        backgroundColor: [
          "#27AE60",
          "#FEC20C",
          "#F2994A",
          "#2284aa",
          "#2268aa",
        ],
        display: true,
      },
    ],
  }
  return (
    <>
      <Card>
        <Row gutter={[0, 0]}>
          {/* <Col sm={{ span: 12, offset: 0 }}></Col> */}
          {/* <Col sm={{ span: 24, offset: 0 }}>
            <Doughnut
              style={{ height: 150 }}
              height={300}
              data={data}
              options={{
                maintainAspectRatio: false,
                plugins: globalPlugins(),
                cutout: "30%",
              }}
              plugins={[ChartDataLabels]}
            />
          </Col> */}
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

export default OccByProject
