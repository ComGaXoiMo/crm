import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Row, Col, Card, Select, DatePicker } from "antd"

import Stores from "@stores/storeIdentifier"
import withRouter from "@components/Layout/Router/withRouter"

import {
  filterOptions,
  formatDynamicPercent,
  formatNumber,
  renderOptions,
} from "@lib/helper"
import DashboardStore from "@stores/dashboardStore"
import moment from "moment"
import AppConsts from "@lib/appconst"
const { itemDashboard, datePickerType, pickerType } = AppConsts
export interface IOverviewProps {
  selectItem: any

  dashboardStore: DashboardStore
}

@inject(Stores.DashboardStore)
@observer
class CardPerformanceQuickView extends AppComponentListBase<IOverviewProps> {
  printRef: any = React.createRef()
  state = {
    filters: {
      type: pickerType.year,
      date: moment().endOf("days").toJSON(),
    },
    datatotalValueOfLa: {} as any,
    datatotalValueOfLaRequest: {} as any,
    datatAverage: {} as any,
  }
  componentDidMount() {
    this.getDashBoard()
  }
  componentDidUpdate(prevProps) {
    if (prevProps.selectItem !== this.props.selectItem) {
      if (this.props.selectItem === itemDashboard.overView) {
        this.getDashBoard()
      }
    }
  }

  fillterChange = async (name, value) => {
    const { filters } = this.state
    if (name === "date") {
      await this.setState({
        filters: {
          ...filters,
          date: moment(value).toJSON(),
        },
      })

      await this.getDashBoard()
    } else if (name === "type") {
      await this.setState({
        filters: {
          ...filters,
          type: value,
        },
      })
      await this.getDashBoard()
    }
  }

  getDashBoard = async () => {
    const { filters } = this.state
    let newFilter = {} as any
    if (filters.type === pickerType.year) {
      newFilter = {
        ...filters,
        thisFromDate: moment(filters.date)
          .startOf("year")
          .endOf("days")
          .toJSON(),
        thisToDate: moment(filters.date).endOf("year").endOf("days").toJSON(),
        lastFromDate: moment(filters.date)
          .subtract(1, "years")
          .startOf("year")
          .endOf("days")
          .toJSON(),
        lastToDate: moment(filters.date)
          .subtract(1, "years")
          .endOf("year")
          .endOf("days")
          .toJSON(),
      }
    } else if (filters.type === pickerType.quarter) {
      newFilter = {
        ...filters,
        thisFromDate: moment(filters.date)
          .startOf("quarters")
          .endOf("days")
          .toJSON(),
        thisToDate: moment(filters.date)
          .endOf("quarters")
          .endOf("days")
          .toJSON(),
        lastFromDate: moment(filters.date)
          .subtract(1, "years")
          .startOf("quarters")
          .endOf("days")
          .toJSON(),
        lastToDate: moment(filters.date)
          .subtract(1, "years")
          .endOf("quarters")
          .endOf("days")
          .toJSON(),
      }
    }

    await Promise.all([
      console.log(newFilter),
      this.props.dashboardStore.getOverviewOfLA({
        ...newFilter,
      }),
      this.props.dashboardStore.getOverviewOfLARequest({
        ...newFilter,
      }),
    ]).then(async () => {
      this.setState({
        datatotalValueOfLa: this.props.dashboardStore.dashboardOveriewOfLa[0],
        datatotalValueOfLaRequest:
          this.props.dashboardStore.dashboardOveriewOfLaRequest[0],
      })
    })
  }

  public render() {
    return (
      <>
        <Card className="card-report">
          <Row gutter={[16, 16]}>
            <Col sm={{ span: 24 }}>
              <span className="card-overview-title">
                {this.L("PERFORMANCE_QUICK_VIEW")}
              </span>
            </Col>
            <Col sm={{ span: 24 }} className="text-right">
              <Select
                value={this.state.filters.type}
                filterOption={filterOptions}
                placeholder={this.L("type")}
                onChange={(value) => this.fillterChange("type", value)}
              >
                {renderOptions(datePickerType)}
              </Select>
              &ensp;
              <DatePicker
                onChange={(value) => this.fillterChange("date", value)}
                picker={
                  this.state.filters.type === pickerType.quarter
                    ? "quarter"
                    : "year"
                }
              />
            </Col>
          </Row>
          <div className="performance-quick-view  ">
            <div className="card-performance-quick-view">
              <div className="quick-view-title">
                <span>Total Value Of Lease Agreement</span>
              </div>
              <div className="quick-view-content">
                <span>
                  {this.L("VND")}
                  <strong>
                    {formatNumber(
                      this.state.datatotalValueOfLa?.ThisContractAmount
                    )}
                  </strong>
                </span>
                {formatDynamicPercent(
                  (this.state.datatotalValueOfLa?.PercentAmount ?? 0) * 100
                )}
              </div>
            </div>
            <div className="card-performance-quick-view ">
              <div className="quick-view-title">
                <span>Total Value Of Lease Agreement Request</span>
              </div>
              <div className="quick-view-content">
                <span>
                  {this.L("VND")}
                  <strong>
                    {formatNumber(
                      this.state.datatotalValueOfLaRequest?.ThisContractAmount
                    )}
                  </strong>
                </span>
                {formatDynamicPercent(
                  (this.state.datatotalValueOfLaRequest?.PercentAmount ?? 0) *
                    100
                )}
              </div>
            </div>
            <div className="card-performance-quick-view">
              <div className="quick-view-title">
                <span>Average Rental Rate</span>
              </div>
              <div className="quick-view-content">
                <span>
                  {this.L("VND")}
                  <strong>
                    {formatNumber(this.state.datatotalValueOfLa?.ThisAvgAmount)}
                  </strong>
                </span>
                {formatDynamicPercent(
                  (this.state.datatotalValueOfLa?.PercentAvgAmount ?? 0) * 100
                )}
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  }
}

export default withRouter(CardPerformanceQuickView)
