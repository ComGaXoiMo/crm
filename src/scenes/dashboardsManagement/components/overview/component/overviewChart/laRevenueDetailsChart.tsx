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
import { formatNumber } from "@lib/helper"
import _ from "lodash"

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
          label += formatNumber(context.parsed.y) + "đ"
        }
        return label
      },
    },
  },
})
const LaRevenueDetailsChart = (props: Props) => {
  React.useEffect(() => {
    const res = props.data.map((item) => `${item.FormatDate}`)
    setLabels(res)
    getListKey(props.data)
  }, [])
  React.useEffect(() => {
    const res = props.data.map((item) => `${item.FormatDate}`)
    setLabels(res)
    getListKey(props.data)
  }, [props.data])
  const [labels, setLabels] = React.useState<any[]>([])
  const [listKey, setListKey] = React.useState<any[]>([])

  const getListKey = (listData) => {
    const listProject = listData
      .find((item) => item.data?.length > 0)
      ?.data?.map((item) => {
        return item?.projectCode
      })

    if (listProject) {
      setListKey(listProject.map((item) => item))
    }
  }
  const listColor = [
    "#D3A429",
    "#bcbdbc",
    "#961212b5",
    "#b33e99b5",
    "#6926d6b5",
    "#37ac47b5",
    "#2740cfb5",
  ]
  const listDataSet = listKey.map((item, index) => {
    return {
      label: item,
      data: labels.map((label) => {
        const res = props.data.find(
          (data) => `${data.FormatDate}` === label
        )?.data

        return res?.find((obj) => item === obj.projectCode)?.contractAmount ?? 0
      }),
      borderColor: listColor[index],
      backgroundColor: listColor[index],
      pointStyle: "circle",
      pointRadius: 2,
      borderWidth: index < 2 ? 4 : 2,

      pointHoverRadius: 10,
    }
  })
  const data = {
    labels: labels,
    datasets: [...listDataSet],
  }

  return (
    <>
      <Card className="card-report">
        <span className="card-overview-title">
          {L("TOTAL_VALUE_OF_LEASE_AGREEMENT_BY_MONTH")}
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
                    ticks: {
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

export default LaRevenueDetailsChart
