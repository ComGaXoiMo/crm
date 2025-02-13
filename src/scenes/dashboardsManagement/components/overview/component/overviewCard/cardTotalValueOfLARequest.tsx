import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Row, Col, Card, Button } from "antd"

import Stores from "@stores/storeIdentifier"
import withRouter from "@components/Layout/Router/withRouter"
import { formatNumber, formatNumberWithSignal } from "@lib/helper"
import DashboardStore from "@stores/dashboardStore"
import RevenueModal from "./exportModal/revenueModal"
import { EyeOutlined } from "@ant-design/icons"
export interface IOverviewProps {
  data: any
  filters: any
  dashboardStore: DashboardStore
}

@inject(Stores.DashboardStore)
@observer
class CardTotalValueOfLARequest extends AppComponentListBase<IOverviewProps> {
  printRef: any = React.createRef()
  state = {
    modalVisible: false,
    dataExport: [] as any,
  }
  exportOpen = async () => {
    const dataExport = await this.props.dashboardStore.exportLARevenueRequest({
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
                {this.L("TOTAL_VALUE_OF_LEASE_AGREEMENT_REQUEST")}
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
                <strong>{formatNumber(data?.ThisContractAmount)}</strong>
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
                  {this.L("NUM_OF_CONFIRM_LA")}
                </Col>
                <Col sm={{ span: 6 }} className="card-text-right">
                  {formatNumber(data?.LastCountLA)}
                </Col>
                <Col sm={{ span: 6 }} className="card-text-right">
                  {formatNumber(data?.ThisCountLA)}
                </Col>
                <Col
                  sm={{ span: 6 }}
                  className={`card-text-strong ${
                    data?.DiffCountLA >= 0 ? "card-text-green" : "card-text-red"
                  } `}
                >
                  {formatNumberWithSignal(data?.DiffCountLA)}
                </Col>
                <Col sm={{ span: 6 }} className="card-text-strong">
                  {this.L("LA_VALUE")}
                </Col>
                <Col sm={{ span: 6 }} className="card-text-right">
                  {formatNumber(data?.LastContractAmount)}
                </Col>
                <Col sm={{ span: 6 }} className="card-text-right">
                  {formatNumber(data?.ThisContractAmount)}
                </Col>
                <Col
                  sm={{ span: 6 }}
                  className={`card-text-strong ${
                    data?.DiffContractAmount >= 0
                      ? "card-text-green"
                      : "card-text-red"
                  } `}
                >
                  {formatNumberWithSignal(data?.DiffContractAmount)}
                  {/* <br />({formatNumberFloat((data?.PercentAmount ?? 0) * 100)}
                  %) */}
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

export default withRouter(CardTotalValueOfLARequest)
