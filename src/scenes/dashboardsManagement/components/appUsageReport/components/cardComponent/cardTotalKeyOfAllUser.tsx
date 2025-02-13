import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Row, Col, Card } from "antd"

import Stores from "@stores/storeIdentifier"
import withRouter from "@components/Layout/Router/withRouter"

import {
  formatNumber,
  formatNumberFloat,
  formatNumberWithSignal,
} from "@lib/helper"
import DashboardStore from "@stores/dashboardStore"
export interface IOverviewProps {
  data: any
  dashboardStore: DashboardStore
}

@inject(Stores.DashboardStore)
@observer
class CardTotalKeyOfAllUser extends AppComponentListBase<IOverviewProps> {
  printRef: any = React.createRef()
  state = {
    dataExport: [] as any,
  }

  public render() {
    const { data } = this.props
    return (
      <>
        <Card className="card-report">
          <Row gutter={[4, 4]}>
            <Col sm={{ span: 20 }}>
              <span className="card-overview-title">
                {this.L("TOTAL_KEY_ACTIVITIES_OF_ALL_USERS")}
              </span>
            </Col>
            <Col sm={{ span: 24 }}>
              <span>
                {this.L("CONTENT_TOTAL_KEY_ACTIVITIES_OF_ALL_USERS_CARD")}
              </span>
            </Col>{" "}
            <Col sm={{ span: 24 }}>
              <span className="card-overview-large-content">
                <strong>{formatNumber(data?.thisValue)}</strong>
              </span>
            </Col>
            <Col sm={{ span: 24 }}>
              <Row gutter={[24, 4]}>
                <Col sm={{ span: 6 }}></Col>
                <Col
                  sm={{ span: 6 }}
                  className="card-text-strong card-text-right"
                >
                  {this.L("LAST_PERIOD")}
                </Col>
                <Col
                  sm={{ span: 6 }}
                  className="card-text-strong card-text-right"
                >
                  {this.L("THIS_PERIOD")}
                </Col>
                <Col sm={{ span: 6 }}></Col>

                <Col sm={{ span: 6 }} className="card-text-strong">
                  {this.L("KEY_ACTIVITIES")}
                </Col>
                <Col sm={{ span: 6 }} className="card-text-right">
                  {formatNumber(data?.lastValue)}
                </Col>
                <Col sm={{ span: 6 }} className="card-text-right">
                  {formatNumber(data?.thisValue)}
                </Col>
                <Col
                  sm={{ span: 6 }}
                  className={`card-text-strong ${
                    data?.thisValue - data?.lastValue >= 0
                      ? "card-text-green"
                      : "card-text-red"
                  } `}
                >
                  {formatNumberWithSignal(data?.thisValue - data?.lastValue)} (
                  {formatNumberFloat(
                    (data?.thisValue /
                      (data?.lastValue === 0 ? 1 : data?.lastValue)) *
                      100
                  )}
                  %)
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </>
    )
  }
}

export default withRouter(CardTotalKeyOfAllUser)
