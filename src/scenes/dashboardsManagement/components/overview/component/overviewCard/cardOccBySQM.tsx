import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Row, Col, Card } from "antd"

import Stores from "@stores/storeIdentifier"
import withRouter from "@components/Layout/Router/withRouter"
import moment from "moment"
import { formatNumber, formatNumberFloat } from "@lib/helper"
export interface IOverviewProps {
  dataThis: any
  dataLast: any
}

@inject(Stores.DashboardStore)
@observer
class CardOccBySQM extends AppComponentListBase<IOverviewProps> {
  printRef: any = React.createRef()
  state = {
    filters: {
      reportType: "year",
      fromDate: moment().startOf("year").toJSON(),
      toDate: moment().toJSON(),
    },
  }

  public render() {
    const { dataLast } = this.props
    return (
      <>
        <Card className="card-report-fit-height">
          <Row gutter={[4, 4]}>
            <Col sm={{ span: 24 }}>
              <span className="card-overview-title">
                {this.L("OCCUPANCY_RATE_BY_SQM")}
              </span>
            </Col>

            <Col sm={{ span: 24 }}>
              <Row gutter={[24, 4]}>
                <Col sm={{ span: 8 }}></Col>
                <Col
                  sm={{ span: 8 }}
                  className="card-text-strong card-text-right"
                >
                  {this.L("LAST_PERIOD")}
                </Col>
                <Col
                  sm={{ span: 8 }}
                  className="card-text-strong card-text-right"
                >
                  {this.L("THIS_PERIOD")}
                </Col>
                {this.props.dataThis?.map((item, index) => (
                  <>
                    <Col
                      sm={{ span: 24 }}
                      className="card-overview-second-title"
                    >
                      {item?.ProjectName}
                    </Col>

                    {/* Leased */}
                    <Col sm={{ span: 8 }} className="card-text-strong">
                      {this.L("LEASED")}
                    </Col>
                    <Col sm={{ span: 8 }} className="card-text-right">
                      {formatNumber(dataLast[index]?.Leased)}
                    </Col>
                    <Col sm={{ span: 8 }} className="card-text-right">
                      {" "}
                      {formatNumber(item?.Leased)}
                    </Col>

                    {/* Occ % */}
                    <Col
                      sm={{ span: 8 }}
                      className="card-text-strong card-text-red"
                    >
                      {this.L("OCC_%")}
                    </Col>
                    <Col
                      sm={{ span: 8 }}
                      className="card-text-right card-text-strong card-text-red"
                    >
                      {formatNumberFloat(dataLast[index]?.Percent)}%
                    </Col>
                    <Col
                      sm={{ span: 8 }}
                      className="card-text-right card-text-strong card-text-red"
                    >
                      {formatNumberFloat(item?.Percent)}%
                    </Col>

                    {/* Vacant */}
                    <Col sm={{ span: 8 }} className="card-text-strong">
                      {this.L("VACANT")}
                    </Col>
                    <Col sm={{ span: 8 }} className="card-text-right">
                      {formatNumber(dataLast[index]?.TotalVacant)}
                    </Col>
                    <Col sm={{ span: 8 }} className="card-text-right">
                      {formatNumber(item?.TotalVacant)}
                    </Col>

                    {/* Use in other purposes */}
                    <Col sm={{ span: 8 }} className="card-text-strong">
                      {this.L("USE_IN_OTHER_PURPOSOS")}
                    </Col>
                    <Col sm={{ span: 8 }} className="card-text-right">
                      {formatNumber(dataLast[index]?.TotalUnUsed)}
                    </Col>
                    <Col sm={{ span: 8 }} className="card-text-right">
                      {formatNumber(item?.TotalUnUsed)}
                    </Col>

                    {/* Total Unit */}
                    <Col sm={{ span: 8 }} className="card-text-strong">
                      {this.L("TOTAL_UNIT")}
                    </Col>
                    <Col sm={{ span: 8 }} className="card-text-right">
                      {formatNumber(dataLast[index]?.TotalSQM)}
                    </Col>
                    <Col sm={{ span: 8 }} className="card-text-right">
                      {formatNumber(item?.TotalSQM)}
                    </Col>
                  </>
                ))}
              </Row>
            </Col>
          </Row>
        </Card>
      </>
    )
  }
}

export default withRouter(CardOccBySQM)
