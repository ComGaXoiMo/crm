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
  height?: number
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
    position: "top",
  },
  datalabels: {
    color: "black",
    display: function (context) {
      let total = 0
      context.dataset.data.map((item) => {
        total = total + item
      })
      return (context.dataset.data[context.dataIndex] || 0) > 0
    },
    font: {
      weight: "bold",
      size: 13,
    },
    formatter: Math.round,
  },
})
const ContactSignChart = (props: Props) => {
  React.useEffect(() => {
    const res = props.data.map((item) => item.name)
    setLabels(res)
  }, [])
  const [labels, setLabels] = React.useState<string[]>([])
  const data = {
    labels: labels,
    datasets: [
      {
        label: L("Fed"),
        data: labels.map((label) => {
          const res = props.data.find((data) => data.name === label)
          return res?.Confirmed ?? 0
        }),
        backgroundColor: "#1269eb",
      },
      {
        label: L("Lease Agreement"),
        data: labels.map((label) => {
          const res = props.data.find((data) => data.name === label)

          return res?.LeaseAgreement ?? 0
        }),
        backgroundColor: "#7973d1",
      },

      {
        label: L("Offer"),
        data: labels.map((label) => {
          const res = props.data.find((data) => data.name === label)

          return res?.Offer ?? 0
        }),
        backgroundColor: "#d507e7",
      },
    ],
  }
  return (
    <>
      <Card>
        <strong>{L("COUNT_OF_UNIT_BY_TASK_PIC_AND_STAFF")}</strong>
        <Row gutter={[8, 8]}>
          <Col sm={{ span: 24, offset: 0 }}>
            <Bar
              style={{ height: props.height ? props.height : 250 }}
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

export default ContactSignChart
