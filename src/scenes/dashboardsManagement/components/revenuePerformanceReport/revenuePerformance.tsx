import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Row, Col, Spin, DatePicker, Button, Select, Card } from "antd"

import AppConsts from "@lib/appconst"
import Stores from "@stores/storeIdentifier"
import DashboardStore from "@stores/dashboardStore"
import withRouter from "@components/Layout/Router/withRouter"
import moment from "moment"

import {
  filterOptions,
  formatNumber,
  formatNumberFloat,
  formatNumberWithSignal,
  renderOptions,
} from "@lib/helper"

const { itemDashboard, pickerType, datePickerType } = AppConsts
export interface IProps {
  selectItem: any
  dashboardStore: DashboardStore
}
export interface IState {
  filters: any
}
@inject(Stores.DashboardStore)
@observer
class RevenuePerformances extends AppComponentListBase<IProps, IState> {
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
  }

  componentDidMount() {
    this.getDashBoard()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectItem !== this.props.selectItem) {
      if (this.props.selectItem === itemDashboard.performances) {
        this.getDashBoard()
      }
    }
  }

  getDashBoard = async () => {
    const { filters } = this.state

    let newFilter = {} as any

    switch (filters.pickerType) {
      case pickerType.month: {
        newFilter = {
          ...filters,
          fromDate: moment(filters.date)
            .startOf("month")
            .endOf("days")
            .toJSON(),
          toDate: moment(filters.date).endOf("month").endOf("days").toJSON(),
          year: moment(filters.date).year(),
          months: moment(filters.date).month() + 1,
        }
        break
      }
      case pickerType.quarter: {
        let monthMaster = moment(filters.date).month() + 1
        let monthString = monthMaster.toString()
        for (let i = 0; i < 2; i++) {
          monthMaster += 1
          monthString += ", " + monthMaster.toString()
        }
        newFilter = {
          ...filters,
          fromDate: moment(filters.date)
            .startOf("quarter")
            .endOf("days")
            .toJSON(),
          toDate: moment(filters.date).endOf("quarter").endOf("days").toJSON(),
          year: moment(filters.date).year(),
          months: monthString,
        }
        break
      }
      case pickerType.year: {
        let monthMaster = 1
        let monthString = monthMaster.toString()
        for (let i = 0; i < 11; i++) {
          monthMaster += 1
          monthString += ", " + monthMaster.toString()
        }
        newFilter = {
          ...filters,
          fromDate: moment(filters.date).startOf("year").endOf("days").toJSON(),
          toDate: moment(filters.date).endOf("year").endOf("days").toJSON(),
          year: moment(filters.date).year(),
          months: monthString,
        }
        break
      }
      default:
        let monthMaster = 1
        let monthString = monthMaster.toString()
        for (let i = 0; i < 11; i++) {
          monthMaster += 1
          monthString += ", " + monthMaster.toString()
        }
        newFilter = {
          ...filters,
          fromDate: moment(filters.date).startOf("year").endOf("days").toJSON(),
          toDate: moment(filters.date).endOf("year").endOf("days").toJSON(),
          year: moment(filters.date).year(),
          months: monthString,
        }
        break
    }
    this.props.dashboardStore.getDashboardBudget({
      ...newFilter,
    })
  }

  handleSearch = () => {
    this.getDashBoard()
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
    } else if (name === "pickerType") {
      await this.setState({
        filters: {
          ...filters,
          pickerType: value,
        },
      })
    }
  }

  public render() {
    const { filters } = this.state
    const {
      dashboardStore: { dashboardBudgetUnitData, dashboardBudgetRevenueData },
    } = this.props
    return (
      <>
        <Row gutter={[16, 16]}>
          <Col sm={{ span: 24 }}>
            <span className="card-overview-title">
              {this.L("PERFORMANCE_QUICK_VIEW")}
            </span>
          </Col>
          <Col sm={{ span: 24 }}>
            <Select
              value={this.state.filters.pickerType}
              filterOption={filterOptions}
              placeholder={this.L("type")}
              onChange={(value) => this.fillterChange("pickerType", value)}
            >
              {renderOptions(datePickerType)}
            </Select>
            &ensp;
            <DatePicker
              defaultValue={moment()}
              allowClear={false}
              onChange={(value) => this.fillterChange("date", value)}
              picker={filters.pickerType}
            />
            &ensp;
            <Button className="button-primary" onClick={this.handleSearch}>
              {this.L("SEARCH")}
            </Button>
          </Col>
        </Row>

        <br />
        <Spin spinning={this.props.dashboardStore.isLoading}>
          <div ref={this.printRef} className="dashboard-style">
            <Row gutter={[12, 16]}>
              <Col sm={{ span: 12 }}>
                <Card className="card-report">
                  <Row gutter={[4, 4]}>
                    <Col sm={{ span: 20 }}>
                      <span className="card-overview-title">
                        {this.L("UNIT_")}: {this.L("BUDGET_VS_ACTUAL")}
                      </span>
                    </Col>

                    <Col sm={{ span: 24 }}>
                      <Row gutter={[24, 4]}>
                        <Col sm={{ span: 6 }}></Col>
                        <Col
                          sm={{ span: 6 }}
                          className="card-text-strong card-text-right"
                        >
                          {this.L("BUDGET")}
                        </Col>
                        <Col
                          sm={{ span: 5 }}
                          className="card-text-strong card-text-right"
                        >
                          {this.L("ACTUAL")}
                        </Col>
                        <Col
                          sm={{ span: 5 }}
                          className="card-text-strong card-text-right"
                        >
                          {this.L("VARIANCE")}
                        </Col>
                        {/* project */}
                        {dashboardBudgetUnitData.map((unitBudgetItem) => {
                          return (
                            <>
                              <Col
                                sm={{ span: 6 }}
                                className="card-text-strong"
                              >
                                {unitBudgetItem.ProjectName}
                              </Col>
                              <Col sm={{ span: 6 }} className="card-text-right">
                                {formatNumberFloat(
                                  unitBudgetItem.AvgPercent ?? 0
                                )}
                                %
                              </Col>
                              <Col sm={{ span: 5 }} className="card-text-right">
                                {formatNumberFloat(unitBudgetItem.Percent ?? 0)}
                                %
                              </Col>
                              <Col
                                sm={{ span: 5 }}
                                className={`card-text-strong ${
                                  unitBudgetItem.Variance >= 0
                                    ? "card-text-green"
                                    : "card-text-red"
                                }  card-text-right`}
                              >
                                (
                                {formatNumberWithSignal(
                                  unitBudgetItem.Variance * 100
                                )}
                                %)
                              </Col>
                            </>
                          )
                        })}
                      </Row>
                    </Col>
                  </Row>
                </Card>
              </Col>

              <Col sm={{ span: 12 }}>
                <Card className="card-report">
                  <Row gutter={[4, 4]}>
                    <Col sm={{ span: 20 }}>
                      <span className="card-overview-title">
                        {this.L("REVENUE_")}: {this.L("BUDGET_VS_ACTUAL")}
                      </span>
                    </Col>

                    <Col sm={{ span: 24 }}>
                      <Row gutter={[24, 4]}>
                        <Col sm={{ span: 6 }}></Col>
                        <Col
                          sm={{ span: 6 }}
                          className="card-text-strong card-text-right"
                        >
                          {this.L("BUDGET")}
                        </Col>
                        <Col
                          sm={{ span: 6 }}
                          className="card-text-strong card-text-right"
                        >
                          {this.L("ACTUAL")}
                        </Col>
                        <Col
                          sm={{ span: 6 }}
                          className="card-text-strong card-text-right"
                        >
                          {this.L("VARIANCE")}
                        </Col>
                        {/* project */}
                        {dashboardBudgetRevenueData.map((revenueBudgetItem) => {
                          return (
                            <>
                              <Col
                                sm={{ span: 6 }}
                                className="card-text-strong"
                              >
                                {revenueBudgetItem.ProjectName}
                              </Col>
                              <Col sm={{ span: 6 }} className="card-text-right">
                                {formatNumber(
                                  revenueBudgetItem.TotalBudgetAmount ?? 0
                                )}
                              </Col>
                              <Col sm={{ span: 6 }} className="card-text-right">
                                {formatNumber(
                                  revenueBudgetItem.ContractValue ?? 0
                                )}
                              </Col>
                              <Col
                                sm={{ span: 6 }}
                                className={`card-text-strong ${
                                  revenueBudgetItem.Variance >= 0
                                    ? "card-text-green"
                                    : "card-text-red"
                                }  card-text-right`}
                              >
                                (
                                {formatNumberWithSignal(
                                  revenueBudgetItem.Variance * 100
                                )}
                                %)
                              </Col>
                            </>
                          )
                        })}
                      </Row>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </div>
        </Spin>
      </>
    )
  }
}

export default withRouter(RevenuePerformances)
