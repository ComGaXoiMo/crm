import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Row, Card, Select, DatePicker, Spin, Tooltip } from "antd"

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
      pickerType: pickerType.year as
        | "date"
        | "year"
        | "month"
        | "week"
        | "quarter"
        | "time"
        | undefined,
      date: moment().endOf("days").toJSON(),
    },
    isQuickViewLoading: false,
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
          date: moment(value).endOf("days").toJSON(),
        },
      })

      await this.getDashBoard()
    } else if (name === "pickerType") {
      await this.setState({
        filters: {
          ...filters,
          pickerType: value,
        },
      })
      await this.getDashBoard()
    }
  }

  getDashBoard = async () => {
    const { filters } = this.state
    let newFilter = {} as any

    switch (filters.pickerType) {
      case pickerType.month: {
        newFilter = {
          ...filters,
          thisFromDate: moment(filters.date)
            .startOf("months")
            .endOf("days")
            .toJSON(),
          thisToDate: moment(filters.date)
            .endOf("months")
            .endOf("days")
            .toJSON(),
          lastFromDate: moment(filters.date)
            .subtract(1, "years")
            .startOf("months")
            .endOf("days")
            .toJSON(),
          lastToDate: moment(filters.date)
            .subtract(1, "years")
            .endOf("months")
            .endOf("days")
            .toJSON(),
        }
        break
      }
      case pickerType.quarter: {
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
        break
      }
      case pickerType.year: {
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
        break
      }
      default:
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
        break
    }
    await Promise.all([
      this.setState({ isQuickViewLoading: true }),
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
        isQuickViewLoading: false,
      })
    })
  }

  public render() {
    return (
      <>
        <Card className="card-report">
          <Row gutter={[16, 16]}>
            <Tooltip title={this.L("COMPARE_WITH_THE_SAME_PERIOD_LAST_YEAR")}>
              <span className="card-overview-title">
                {this.L("PERFORMANCE_QUICK_VIEW")}
              </span>{" "}
            </Tooltip>
            &ensp; &ensp;
            <Select
              value={this.state.filters.pickerType}
              filterOption={filterOptions}
              placeholder={this.L("pickerType")}
              onChange={(value) => this.fillterChange("pickerType", value)}
            >
              {renderOptions(datePickerType)}
            </Select>
            &ensp;
            <DatePicker
              defaultValue={moment()}
              allowClear={false}
              onChange={(value) => this.fillterChange("date", value)}
              picker={this.state.filters.pickerType}
            />
          </Row>
          <br />
          <Spin spinning={this.state.isQuickViewLoading}>
            <div className="performance-quick-view">
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
                  {/* {formatDynamicPercent(
                    (this.state.datatotalValueOfLaRequest?.PercentAmount ?? 0) *
                      100
                  )} */}
                </div>
              </div>
              {/* hiden 17/09/2024 */}
              {/* <div className="card-performance-quick-view">
                <div className="quick-view-title">
                  <span>Average Rental Rate</span>
                </div>
                <div className="quick-view-content">
                  <span>
                    {this.L("VND")}
                    <strong>
                      {formatNumber(
                        this.state.datatotalValueOfLa?.ThisAvgAmount
                      )}
                    </strong>
                  </span>
                  {formatDynamicPercent(
                    (this.state.datatotalValueOfLa?.PercentAvgAmount ?? 0) * 100
                  )}
                </div>
              </div> */}
            </div>
          </Spin>
        </Card>
      </>
    )
  }
}

export default withRouter(CardPerformanceQuickView)
