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
import LaInfoReservationModal from "./exportModal/laInfoReservationModal"
export interface IOverviewProps {
  data: any
  filters: any
  dashboardStore: DashboardStore
}

@inject(Stores.DashboardStore)
@observer
class Card4LAInfo extends AppComponentListBase<IOverviewProps> {
  printRef: any = React.createRef()
  state = {
    modalVisible: false,
    modalReservationVisible: false,
    dataExport: [] as any,
  }
  exportOpen = async (type) => {
    let nameStore = "V1SpExportOverviewLA"
    switch (type) {
      case 3: {
        nameStore = "V1SpExportOverviewLA"
        break
      }
      case 1: {
        nameStore = "V1SpExportOverviewInquiry"
        break
      }
      case 2: {
        nameStore = "V1SpExportOverviewReservation"
        break
      }
      default:
        break
    }
    if (type === 3) {
      const dataExport = await this.props.dashboardStore.exportOverviewLAInfo({
        ...this.props.filters,
        nameStore: nameStore,
      })
      this.setState({ modalVisible: true })
      this.setState({ dataExport: dataExport })
    } else {
      const dataExport = await this.props.dashboardStore.exportOverviewLAInfo({
        ...this.props.filters,
        nameStore: nameStore,
      })
      this.setState({ modalReservationVisible: true })
      this.setState({ dataExport: dataExport })
    }
  }
  public render() {
    const { data } = this.props
    return (
      <>
        <Card className="card-report">
          <Row gutter={[4, 4]}>
            <Col sm={{ span: 24 }}>
              <span className="card-overview-title">
                {this.L("NEW_INQUIRY_NEW_RESERVATION_NEW_LA")}
              </span>
            </Col>

            <Col sm={{ span: 24 }}>
              <Row gutter={[24, 4]}>
                <Col sm={{ span: 2 }}></Col>
                <Col
                  sm={{ span: 9 }}
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
                <Col sm={{ span: 3 }}></Col>
                <Col sm={{ span: 6 }} className="card-text-strong">
                  {this.L("NEW_INQUIRY")}
                </Col>
                <Col sm={{ span: 5 }} className="card-text-right">
                  {formatNumber(data?.LastCountInquiry)}
                </Col>
                <Col sm={{ span: 5 }} className="card-text-right">
                  {" "}
                  {formatNumber(data?.ThisCountInquiry)}
                </Col>
                <Col
                  sm={{ span: 6 }}
                  className={`card-text-strong ${
                    data?.DiffInquiry >= 0 ? "card-text-green" : "card-text-red"
                  } `}
                >
                  {formatNumberWithSignal(data?.DiffInquiry)} (
                  {formatNumberFloat((data?.PercentInquiry ?? 0) * 100)}%)
                </Col>
                <Col sm={{ span: 2 }} style={{ padding: 0 }}>
                  <Button
                    size="small"
                    className="button-secondary"
                    onClick={() => this.exportOpen(1)}
                    icon={<EyeOutlined />}
                  ></Button>
                </Col>
                <Col sm={{ span: 6 }} className="card-text-strong">
                  {this.L("NEW_RESERVATION")}
                </Col>
                <Col sm={{ span: 5 }} className="card-text-right">
                  {" "}
                  {formatNumber(data?.LastCountReservation)}
                </Col>
                <Col sm={{ span: 5 }} className="card-text-right">
                  {formatNumber(data?.ThisCountReservation)}
                </Col>
                <Col
                  sm={{ span: 6 }}
                  className={`card-text-strong ${
                    data?.DiffReservation >= 0
                      ? "card-text-green"
                      : "card-text-red"
                  } `}
                >
                  {formatNumberWithSignal(data?.DiffReservation)} (
                  {formatNumberFloat((data?.PercentReservation ?? 0) * 100)}
                  %)
                </Col>{" "}
                <Col sm={{ span: 2 }} style={{ padding: 0 }}>
                  <Button
                    size="small"
                    className="button-secondary"
                    onClick={() => this.exportOpen(2)}
                    icon={<EyeOutlined />}
                  ></Button>
                </Col>
                <Col sm={{ span: 6 }} className="card-text-strong">
                  {this.L("NEW_LA")}
                </Col>
                <Col sm={{ span: 5 }} className="card-text-right">
                  {formatNumber(data?.LastCountLA)}
                </Col>
                <Col sm={{ span: 5 }} className="card-text-right">
                  {formatNumber(data?.ThisCountLA)}
                </Col>
                <Col
                  sm={{ span: 6 }}
                  className={`card-text-strong ${
                    data?.DiffLA >= 0 ? "card-text-green" : "card-text-red"
                  } `}
                >
                  {formatNumberWithSignal(data?.DiffLA)} (
                  {formatNumberFloat((data?.PercentLA ?? 0) * 100)}
                  %)
                </Col>{" "}
                <Col sm={{ span: 2 }} style={{ padding: 0 }}>
                  <Button
                    size="small"
                    className="button-secondary"
                    onClick={() => this.exportOpen(3)}
                    icon={<EyeOutlined />}
                  ></Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
        <RevenueModal
          dataTable={this.state.dataExport}
          visible={this.state.modalVisible}
          onClose={() => this.setState({ modalVisible: false })}
        />{" "}
        <LaInfoReservationModal
          dataTable={this.state.dataExport}
          visible={this.state.modalReservationVisible}
          onClose={() => this.setState({ modalReservationVisible: false })}
        />
      </>
    )
  }
}

export default withRouter(Card4LAInfo)
