import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Row, Col, Card, Button, Divider } from "antd"

import Stores from "@stores/storeIdentifier"
import withRouter from "@components/Layout/Router/withRouter"

import { formatNumber, formatNumberWithSignal } from "@lib/helper"
import { EyeOutlined } from "@ant-design/icons"
import DashboardStore from "@stores/dashboardStore"
import RevenueModal from "./exportModal/revenueModal"
export interface IOverviewProps {
  data: any
  filters: any
  dashboardStore: DashboardStore
}

@inject(Stores.DashboardStore)
@observer
class CardTotalValueOfLA extends AppComponentListBase<IOverviewProps> {
  printRef: any = React.createRef()
  state = {
    modalVisible: false,
    dataExport: [] as any,
  }
  exportOpen = async () => {
    const dataExport = await this.props.dashboardStore.exportOverviewLA({
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
          <Row gutter={[4, 12]}>
            <Col sm={{ span: 20 }}>
              <span className="card-overview-title">
                {this.L("TOTAL_VALUE_OF_LEASE_AGREEMENT")}
              </span>
            </Col>
            <Col className="text-right" sm={{ span: 4 }}>
              <Button
                className="button-secondary"
                onClick={this.exportOpen}
                icon={<EyeOutlined />}
              ></Button>
            </Col>
            <Col sm={{ span: 24 }}>
              <span className="card-overview-content">
                {this.L("VND")}
                <strong>{formatNumber(data?.TotalThisContractAmount)}</strong>
              </span>
            </Col>
            <Col sm={{ span: 24 }}>
              <Row gutter={[4, 8]}>
                <Col sm={{ span: 4 }}></Col>
                <Col
                  sm={{ span: 10 }}
                  className="card-text-strong card-text-right"
                >
                  {this.L("COMPARATION_PERIOD")}
                </Col>
                <Col
                  sm={{ span: 8 }}
                  className="card-text-strong card-text-right"
                >
                  {this.L("THIS_PERIOD")}
                </Col>
                <Col sm={{ span: 1 }}></Col>

                <Col sm={{ span: 7 }} className="card-text-strong-blue">
                  {this.L("NUM_OF_CONFIRM_LA")}
                </Col>
                <Col
                  sm={{ span: 7 }}
                  className="card-text-right card-text-strong-blue"
                >
                  {formatNumber(data?.TotalLastCountLA)}
                </Col>
                <Col
                  sm={{ span: 8 }}
                  className="card-text-right card-text-strong-blue"
                >
                  {formatNumber(data?.TotalThisCountLA)}&ensp;
                  <span
                    className={`card-text-strong ${
                      data?.TotalThisCountLA - data?.TotalLastCountLA >= 0
                        ? "card-text-green"
                        : "card-text-red"
                    } `}
                  >
                    {formatNumberWithSignal(
                      data?.TotalThisCountLA - data?.TotalLastCountLA
                    )}
                  </span>
                </Col>
                <Col sm={{ span: 1 }}></Col>
                <Divider className="blue-line" />

                {/*  */}
                <Col sm={{ span: 7 }} className="card-text-strong">
                  {this.L("NEW_LEASED")}
                </Col>
                <Col sm={{ span: 7 }} className="card-text-right">
                  {formatNumber(data?.LastNewCountLA)}
                </Col>
                <Col sm={{ span: 8 }} className="card-text-right">
                  {formatNumber(data?.ThisNewCountLA)}&ensp;
                  <span
                    className={`card-text-strong ${
                      data?.ThisNewCountLA - data?.LastNewCountLA >= 0
                        ? "card-text-green"
                        : "card-text-red"
                    } `}
                  >
                    {formatNumberWithSignal(
                      data?.ThisNewCountLA - data?.LastNewCountLA
                    )}
                  </span>
                </Col>
                <Col sm={{ span: 1 }}></Col>
                {/*  */}
                <Col sm={{ span: 7 }} className="card-text-strong">
                  {this.L("RENEW")}
                </Col>
                <Col sm={{ span: 7 }} className="card-text-right">
                  {formatNumber(data?.LastRenewCountLA)}
                </Col>
                <Col sm={{ span: 8 }} className="card-text-right">
                  {formatNumber(data?.ThisRenewCountLA)}&ensp;
                  <span
                    className={`card-text-strong ${
                      data?.ThisRenewCountLA - data?.LastRenewCountLA >= 0
                        ? "card-text-green"
                        : "card-text-red"
                    } `}
                  >
                    {formatNumberWithSignal(
                      data?.ThisRenewCountLA - data?.LastRenewCountLA
                    )}
                  </span>
                </Col>
                <Col sm={{ span: 1 }}></Col>
                {/*  */}
                <Col sm={{ span: 7 }} className="card-text-strong">
                  {this.L("CURRENT")}
                </Col>
                <Col sm={{ span: 7 }} className="card-text-right">
                  {formatNumber(data?.LastCurrentCountLA)}
                </Col>
                <Col sm={{ span: 8 }} className="card-text-right">
                  {formatNumber(data?.ThisCurrentCountLA)}&ensp;
                  <span
                    className={`card-text-strong ${
                      data?.ThisCurrentCountLA - data?.LastCurrentCountLA >= 0
                        ? "card-text-green"
                        : "card-text-red"
                    } `}
                  >
                    {formatNumberWithSignal(
                      data?.ThisCurrentCountLA - data?.LastCurrentCountLA
                    )}
                  </span>
                </Col>
                <Col sm={{ span: 1 }}></Col>
              </Row>
            </Col>
            <Col sm={{ span: 24 }}></Col>
            <Col sm={{ span: 24 }}></Col>
            <Col sm={{ span: 24 }}></Col>
            <Col sm={{ span: 24 }}>
              <Row gutter={[4, 12]}>
                <Col sm={{ span: 7 }} className=" card-text-strong-blue">
                  {this.L("LA_VALUE")}
                </Col>
                <Col
                  sm={{ span: 7 }}
                  className="card-text-right card-text-strong-blue"
                >
                  {formatNumber(data?.TotalLastContractAmount)}
                </Col>
                <Col sm={{ span: 8 }}>
                  <span className="w-100 card-text-right card-text-strong-blue">
                    {formatNumber(data?.TotalThisContractAmount)}
                  </span>
                  <span
                    className={`card-text-strong ${
                      data?.PerTotalContractAmount >= 0
                        ? "card-text-green"
                        : "card-text-red"
                    }  w-100 card-text-right`}
                  >
                    (
                    {formatNumberWithSignal(data?.PerTotalContractAmount * 100)}
                    %)
                  </span>
                </Col>
                <Col sm={{ span: 1 }}></Col>
                <Divider className="blue-line" />

                {/*  */}
                <Col sm={{ span: 7 }} className="card-text-strong">
                  {this.L("NEW_LEASED")}
                </Col>
                <Col sm={{ span: 7 }} className="card-text-right">
                  {formatNumber(data?.LastNewContractAmount)}
                </Col>
                <Col sm={{ span: 8 }}>
                  <span className="w-100 card-text-right">
                    {formatNumber(data?.ThisNewContractAmount)}
                  </span>
                  <span
                    className={`card-text-strong ${
                      data?.PerNewContractAmount >= 0
                        ? "card-text-green"
                        : "card-text-red"
                    }  w-100 card-text-right`}
                  >
                    ({formatNumberWithSignal(data?.PerNewContractAmount * 100)}
                    %)
                  </span>
                </Col>
                <Col sm={{ span: 1 }}></Col>
                {/*  */}
                <Col sm={{ span: 7 }} className="card-text-strong">
                  {this.L("RENEW")}
                </Col>
                <Col sm={{ span: 7 }} className="card-text-right">
                  {formatNumber(data?.LastRenewContractAmount)}
                </Col>
                <Col sm={{ span: 8 }}>
                  <span className="w-100 card-text-right">
                    {formatNumber(data?.ThisRenewContractAmount)}
                  </span>
                  <span
                    className={`card-text-strong ${
                      data?.PerReNewContractAmount >= 0
                        ? "card-text-green"
                        : "card-text-red"
                    }  w-100 card-text-right`}
                  >
                    (
                    {formatNumberWithSignal(data?.PerReNewContractAmount * 100)}
                    %)
                  </span>
                </Col>
                <Col sm={{ span: 1 }}></Col>
                {/*  */}
                <Col sm={{ span: 7 }} className="card-text-strong">
                  {this.L("CURRENT")}
                </Col>
                <Col sm={{ span: 7 }} className="card-text-right">
                  {formatNumber(data?.LastCurrentContractAmount)}
                </Col>
                <Col sm={{ span: 8 }}>
                  <span className="w-100 card-text-right">
                    {formatNumber(data?.ThisCurrentContractAmount)}
                  </span>
                  <span
                    className={`card-text-strong ${
                      data?.PerCurrentContractAmount >= 0
                        ? "card-text-green"
                        : "card-text-red"
                    }  w-100 card-text-right`}
                  >
                    (
                    {formatNumberWithSignal(
                      data?.PerCurrentContractAmount * 100
                    )}
                    %)
                  </span>
                </Col>
                <Col sm={{ span: 1 }}></Col>
              </Row>
            </Col>
          </Row>
        </Card>
        <RevenueModal
          isTotalLACard
          dataTable={this.state.dataExport}
          visible={this.state.modalVisible}
          onClose={() => this.setState({ modalVisible: false })}
        />
      </>
    )
  }
}

export default withRouter(CardTotalValueOfLA)
