import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Row, Col, Card, Button } from "antd"

import Stores from "@stores/storeIdentifier"
import withRouter from "@components/Layout/Router/withRouter"
import {
  formatNumber,
  formatNumberFloat,
  formatNumberWithSignal,
} from "@lib/helper"
import DashboardStore from "@stores/dashboardStore"
import { EyeOutlined } from "@ant-design/icons"
import RevenueModal from "./exportModal/revenueModal"
export interface IOverviewProps {
  data: any
  filters: any
  dashboardStore: DashboardStore
}

@inject(Stores.DashboardStore)
@observer
class CardAverageLengthOfStay extends AppComponentListBase<IOverviewProps> {
  printRef: any = React.createRef()
  state = {
    modalVisible: false,
    dataExport: [] as any,
  }
  exportOpen = async () => {
    const dataExport = await this.props.dashboardStore.exportLARevenue({
      ...this.props.filters,
    })
    this.setState({ modalVisible: true })
    this.setState({ dataExport: dataExport })
  }
  public render() {
    const { data } = this.props
    return (
      <>
        <Card className="card-report">
          <Row gutter={[4, 4]}>
            <Col sm={{ span: 20 }}>
              <span className="card-overview-title">
                {this.L("AVERAGE_LENGTH_OF_STAY")}
              </span>
            </Col>{" "}
            <Col className="text-right" sm={{ span: 4 }}>
              <Button
                className="button-secondary"
                onClick={this.exportOpen}
                icon={<EyeOutlined />}
              ></Button>
            </Col>
            <Col sm={{ span: 24 }}>
              <span className="card-overview-content">
                <strong>{formatNumber(data?.ThisAvgStay)}</strong>{" "}
                {this.L("DAYS")}
              </span>
            </Col>
            <Col sm={{ span: 24 }}>
              <Row gutter={[24, 4]}>
                <Col sm={{ span: 3 }}></Col>
                <Col
                  sm={{ span: 9 }}
                  className="card-text-strong card-text-right"
                >
                  {this.L("COMPARATION_PERIOD")}
                </Col>
                <Col
                  sm={{ span: 6 }}
                  className="card-text-strong card-text-right"
                >
                  {this.L("THIS_PERIOD")}
                </Col>
                <Col sm={{ span: 6 }}></Col>
                <Col sm={{ span: 6 }} className="card-text-strong">
                  {this.L("DAYS")}
                </Col>
                <Col sm={{ span: 6 }} className=" card-text-right">
                  {" "}
                  {formatNumber(data?.LastAVGStay)}
                </Col>
                <Col sm={{ span: 6 }} className=" card-text-right">
                  {" "}
                  {formatNumber(data?.ThisAvgStay)}
                </Col>
                <Col
                  sm={{ span: 6 }}
                  className={`card-text-strong ${
                    data?.DiffStay >= 0 ? "card-text-green" : "card-text-red"
                  } `}
                >
                  {formatNumberWithSignal(data?.DiffStay)} <br /> (
                  {formatNumberFloat((data?.PercentStay ?? 0) * 100)}%)
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>{" "}
        <RevenueModal
          dataTable={this.state.dataExport}
          visible={this.state.modalVisible}
          onClose={() => this.setState({ modalVisible: false })}
        />
      </>
    )
  }
}

export default withRouter(CardAverageLengthOfStay)
