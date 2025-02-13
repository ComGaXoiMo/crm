import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import ChartDataLabels from "chartjs-plugin-datalabels"
import { Row, Card, Col } from "antd"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  registerables as registerablesJS,
} from "chart.js"
import withRouter from "@components/Layout/Router/withRouter"
import { Bar } from "react-chartjs-2"
export interface IInOutChartProps {
  Title: any
}

export interface IInOutChartState {
  typesName: any[]
}

ChartJS.register(...registerablesJS, ArcElement, Tooltip, Legend)
export const globalPlugins: any = (additionPlugin?) => ({
  ...additionPlugin,
  legend: {
    position: "right",
    display: false,
  },
  datalabels: {
    color: "black",
    display: function (context) {
      return (context.dataset.data[context.dataIndex] || 0) > 1
    },
    font: {
      size: 18,
    },
    formatter: Math.round,
  },
})
@inject()
@observer
class InOutChart extends AppComponentListBase<
  IInOutChartProps,
  IInOutChartState
> {
  formRef: any = React.createRef()
  state = {
    typesName: [],
  }

  dataInOut = {
    labels: ["0d - 10d", "10d - 20d", "	20d -30d", "30d - ..."] ?? [],
    datasets: [
      {
        data: [9, 12, 23, 10],
        backgroundColor: ["#27AE60", "#FEC20C", "#ffa251", "#2284aa"],
        display: true,
        // borderColor: "#D1D6DC",
      },
    ],
  }
  public render() {
    return (
      <>
        <Card style={{ borderRadius: "0px" }}>
          <strong>{this.props.Title}</strong>
          <div>
            <Row gutter={[2, 2]}>
              {/* <Col sm={{ span: 12, offset: 0 }}></Col> */}
              {/*<Pie 
                style={{ height: 150 }}
                height={250}
                plugins={[ChartDataLabels]}
                data={this.dataInOut}
                options={{
                  maintainAspectRatio: false,
                  plugins: globalPlugins(),
                }}
              /> */}
              <Col sm={{ span: 24, offset: 0 }}>
                <Bar
                  style={{ height: 150 }}
                  data={this.dataInOut}
                  height={300}
                  options={{
                    maintainAspectRatio: false,
                    plugins: globalPlugins(),
                  }}
                  plugins={[ChartDataLabels]}
                />
              </Col>
            </Row>
          </div>
        </Card>
      </>
    )
  }
}

export default withRouter(InOutChart)
