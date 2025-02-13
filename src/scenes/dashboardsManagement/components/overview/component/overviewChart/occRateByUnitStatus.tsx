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
    // display: function (context) {
    //   let total = 0
    //   context.dataset.data.map((item) => {
    //     total = total + item
    //   })
    //   return (context.dataset.data[context.dataIndex] || 0) > 1
    // },
    display: false,
    font: {
      // weight: "bold",
      size: 11,
    },
  },
  legend: {
    display: true,
  },
  tooltip: {
    // intersect: false,
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
          label += context.parsed.y + "%"
        }
        return label
      },
    },
  },
})
const OccRateByUnitStatusChart = (props: Props) => {
  React.useEffect(() => {
    const res = props.data.map((item) => `${item.FormattedMonthName}`)
    setLabels(res)
    getListKey(props.data)
  }, [])
  React.useEffect(() => {
    const res = props.data.map((item) => `${item.FormattedMonthName}`)
    setLabels(res)
    getListKey(props.data)
  }, [props.data])
  const [labels, setLabels] = React.useState<any[]>([])
  const [listKey, setListKey] = React.useState<any[]>([])

  const getListKey = (listData) => {
    const listProject = listData
      .find((item) => item.data?.length > 0)
      ?.data?.map((item) => {
        return item?.projectName
      })

    if (listProject) {
      setListKey(listProject.map((item) => item))
    }
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
        label: item,
        data: labels.map((label) => {
          const res = props.data.find(
            (data) => `${data.FormattedMonthName}` === label
          )?.data

          return res?.find((obj) => item === obj.projectName)?.percent ?? 0
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
          {L("OCCUPANCY_RATE_BY_UNIT_STATUS")}
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

export default OccRateByUnitStatusChart
