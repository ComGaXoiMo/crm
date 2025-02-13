import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Row, Col, Button, Spin, DatePicker, Select } from "antd"

import AppConsts, { dateFormat, dateSortFormat } from "@lib/appconst"
import withRouter from "@components/Layout/Router/withRouter"
import DashboardStore from "@stores/dashboardStore"
import Stores from "@stores/storeIdentifier"
import moment from "moment"
import { ExcelIcon } from "@components/Icon"
import "../occTableStyle.less"
import { L } from "@lib/abpUtility"
import {
  filterOptions,
  formatNumber,
  formatNumberFloat,
  tableToExcel,
} from "@lib/helper"
import { debounce } from "lodash"
import projectService from "@services/projects/projectService"
const { itemDashboard } = AppConsts
const { RangePicker } = DatePicker

export interface IProps {
  selectItem: any
  dashboardStore: DashboardStore
  projects: any[]
}

@inject(Stores.DashboardStore)
@observer
class TableConsolidateOccupancy extends AppComponentListBase<IProps> {
  printRef: any = React.createRef()
  state = {
    filters: {
      fromDate: moment().startOf("months").endOf("days").toJSON(),
      toDate: moment().endOf("months").endOf("days").toJSON(),
    },

    isConvertting: false,
    dataTable: [] as any,
    dataTotalOfTable: {} as any,

    listProject: [] as any,

    dataAvgTable: [] as any,
  }

  componentDidMount() {
    this.getDashBoard()
    if (this.props.projects && this.props?.projects?.length > 0) {
      this.setState({ listProject: this.props.projects })
    } else {
      this.getProject("")
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.selectItem !== this.props.selectItem) {
      if (this.props.selectItem === itemDashboard.unitOcc) {
        this.getDashBoard()
        if (this.props.projects && this.props?.projects?.length > 0) {
          this.setState({ listProject: this.props.projects })
        } else {
          this.getProject("")
        }
      }
    }
  }
  getProject = async (keyword) => {
    const res = await projectService.getAll({
      maxResultCount: 10,
      skipCount: 0,
      keyword,
      isActive: true,
    })
    const newProjects = res.items.map((i) => {
      return { id: i.id, name: i.projectName }
    })
    this.setState({ listProject: newProjects })
  }
  getDashBoard = async () => {
    this.props.dashboardStore
      .getDashboardSummaryConsolidateOcc({
        ...this.state.filters,
      })
      .finally(() => {
        this.dataAnalysis(
          this.props.dashboardStore.dashboardConsolidateOccUnitData,
          this.props.dashboardStore.dashboardConsolidateOccsSQMData
        )
      })
    this.props.dashboardStore
      .getDataTableAvgByType({
        ...this.state.filters,
      })
      .finally(() => {
        this.setState({ dataAvgTable: this.props.dashboardStore.avgByTypeData })
      })
  }

  dataAnalysis = (dataUnitInput, dataSQMInput) => {
    const dataResul = dataUnitInput.map((unitData) => {
      const unitType = unitData?.UnitTypeName
      const projectCode = unitData?.ProjectCode

      const sqmItem = dataSQMInput.find(
        (sqmData) => sqmData?.UnitTypeName === unitType
      )

      const result = {
        unitType: unitType,
        projectCode: projectCode,
        dataByUnit: unitData,
        dataBySqm: sqmItem,
      }
      return result
    })
    const totalUnitLeased = dataUnitInput?.reduce(
      (n, { Leased }) => n + Leased,
      0
    )
    const totalUnitleaseable = dataUnitInput?.reduce(
      (n, { TotalAvailable }) => n + TotalAvailable,
      0
    )
    const totalAreaLeased = dataSQMInput?.reduce(
      (n, { Leased }) => n + Leased,
      0
    )
    const totalArealeaseable = dataSQMInput?.reduce(
      (n, { TotalAvailable }) => n + TotalAvailable,
      0
    )
    const totalUnitUsedAll = dataUnitInput?.reduce(
      (n, { TotalUsedInclPMHInhouse }) => n + TotalUsedInclPMHInhouse,
      0
    )
    const totalAreaUsedAll = dataSQMInput?.reduce(
      (n, { TotalUsedInclPMHInhouse }) => n + TotalUsedInclPMHInhouse,
      0
    )

    const totalRentalFee = dataUnitInput?.reduce(
      (n, { TotalContractAmount }) => n + TotalContractAmount,
      0
    )
    const totalavgByUnit = dataUnitInput?.reduce(
      (n, { AvgContractAmount }) => n + AvgContractAmount,
      0
    )
    const totalavgBySqm = dataSQMInput?.reduce(
      (n, { AvgContractAmount }) => n + AvgContractAmount,
      0
    )
    const dataTotal = {
      totalUnitleaseable: totalUnitleaseable,
      totalArealeaseable: totalArealeaseable,
      totalUnitUnUsed: dataUnitInput?.reduce(
        (n, { TotalUnUsed }) => n + TotalUnUsed,
        0
      ),
      totalAreaUnUsed: dataSQMInput?.reduce(
        (n, { TotalUnUsed }) => n + TotalUnUsed,
        0
      ),
      totalUnitLeased: totalUnitLeased,
      totalAreaLeased: totalAreaLeased,
      totalUnitLeasedPercent: (totalUnitLeased * 100) / totalUnitleaseable,
      totalAreaLeasedPercent: (totalAreaLeased * 100) / totalArealeaseable,

      totalUnitUsedAll: totalUnitUsedAll,
      totalAreaUsedAll: totalAreaUsedAll,
      totalUnitUsedAllPercent: (totalUnitUsedAll * 100) / totalUnitleaseable,
      totalAreaUsedAllPercent:
        (totalAreaUsedAll * 100) /
        (totalArealeaseable +
          dataUnitInput?.reduce((n, { TotalUnUsed }) => n + TotalUnUsed, 0)),
      totalRentalFee: totalRentalFee,
      totalavgByUnit: totalavgByUnit,
      totalavgBySqm: totalavgBySqm,
    }
    this.setState({ dataTable: dataResul, dataTotalOfTable: dataTotal })
  }

  handleSearch = () => {
    this.getDashBoard()
  }

  fillterChange = async (name, value) => {
    const { filters } = this.state
    if (name === "dateFromTo") {
      this.setState({
        filters: {
          ...filters,
          fromDate: moment(value[0]).endOf("days").toJSON(),
          toDate: moment(value[1]).endOf("days").toJSON(),
        },
      })
    } else if (name === "projectId") {
      this.setState({
        filters: {
          ...filters,
          projectId: value,
        },
      })
    }
  }

  changeTab = (tabKey) => {
    this.setState({ tabActiveKey: tabKey })
  }

  public render() {
    const { filters } = this.state

    return (
      <>
        <Spin spinning={this.props.dashboardStore.isLoading}>
          <div ref={this.printRef} className="dashboard-style">
            <Row gutter={[8, 8]}>
              <Col sm={{ span: 24, offset: 0 }}>
                <div className="header-report">
                  <div>
                    <RangePicker
                      clearIcon={false}
                      onChange={(value) =>
                        this.fillterChange("dateFromTo", value)
                      }
                      // disabledDate={disabledDate}
                      // onOpenChange={onOpenChange}
                      // onCalendarChange={(val) => {
                      //   this.setState({ datesDisable: val })
                      // }}
                      format={dateFormat}
                      value={[
                        moment(this.state.filters.fromDate),
                        moment(this.state.filters.toDate),
                      ]}
                      placeholder={["From", "To"]}
                    />
                    &ensp;
                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode}
                      filterOption={filterOptions}
                      placeholder={this.L("Project")}
                      allowClear
                      onChange={(value) =>
                        this.fillterChange("projectId", value)
                      }
                      onSearch={debounce((e) => this.getProject(e), 600)}
                      showSearch
                    >
                      {this.renderOptions(this.state.listProject)}
                    </Select>
                    &ensp;
                    <Button
                      className="button-primary"
                      onClick={this.handleSearch}
                    >
                      {this.L("SEARCH")}
                    </Button>
                  </div>
                  <div className="content-right">
                    <Button
                      onClick={() =>
                        tableToExcel(
                          "tblConsolidateOcc",
                          "_" +
                            moment(filters?.fromDate).format(dateSortFormat) +
                            "_to_" +
                            moment(filters?.toDate).format(dateSortFormat)
                        )
                      }
                      className="button-primary"
                      icon={<ExcelIcon />}
                    ></Button>
                  </div>
                </div>
              </Col>
              <Col sm={{ span: 24, offset: 0 }}>
                <div className="table-contr" id="tblConsolidateOcc">
                  <table className="table-occ-summary">
                    <thead>
                      <tr className="bg-head-consolidate">
                        <th rowSpan={2}> {L("PROJECT_CODE")} </th>
                        <th rowSpan={2}> {L("UNIT_TYPE")}</th>
                        <th colSpan={2}>{L("LEASEABLE")} </th>
                        <th colSpan={2}>{L("RESERVED_AND_INHOUSE_USE")} </th>
                        <th colSpan={4}>{L("TOTAL_LEASED")} </th>
                        <th colSpan={4}>
                          {L("NOT_INCLUDED_RESERVED_AND_INHOUSE_USE")}
                        </th>
                        <th colSpan={2}>{L("AVERAGE_RENT")}</th>
                      </tr>
                      <tr className="bg-head-consolidate">
                        <th>{L("UNIT")} </th>
                        <th>{L("AREA")} </th>
                        <th>{L("UNIT")} </th>
                        <th>{L("AREA")} </th>
                        <th>{L("UNIT")} </th>
                        <th>{L("PERCENT")} </th>
                        <th>{L("AREA")} </th>
                        <th>{L("PERCENT")} </th>
                        <th>{L("UNIT")} </th>
                        <th>{L("PERCENT")} </th>
                        <th>{L("AREA")} </th>
                        <th>{L("PERCENT")} </th>
                        {/* <th>{L("RENTAL_FEE_VND")} </th> */}
                        <th>{L("PER_UNIT_VND")} </th>
                        <th>{L("PER_SQM_VND")} </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.dataTable?.map((rowData) => {
                        return (
                          <tr>
                            <th>{rowData?.projectCode} </th>
                            <th>{rowData?.unitType} </th>
                            <td>{rowData?.dataByUnit?.TotalAvailable} </td>
                            <td>{rowData?.dataBySqm?.TotalAvailable} </td>
                            <td>{rowData?.dataByUnit?.TotalUnUsed} </td>
                            <td>{rowData?.dataBySqm?.TotalUnUsed} </td>
                            <td>{rowData?.dataByUnit?.Leased} </td>
                            <td>
                              {formatNumberFloat(rowData?.dataByUnit?.Percent)}%{" "}
                            </td>
                            <td>{rowData?.dataBySqm?.Leased} </td>
                            <td>
                              {formatNumberFloat(rowData?.dataBySqm?.Percent)}%
                            </td>
                            <td>
                              {formatNumberFloat(
                                rowData?.dataByUnit?.TotalUsedInclPMHInhouse
                              )}
                            </td>
                            <td>
                              {formatNumberFloat(
                                rowData?.dataByUnit?.PercentnclPMHInhouse
                              )}
                              %
                            </td>
                            <td>
                              {formatNumberFloat(
                                rowData?.dataBySqm?.TotalUsedInclPMHInhouse
                              )}
                            </td>
                            <td>
                              {formatNumberFloat(
                                rowData?.dataBySqm?.PercentInclPMHInhouse
                              )}
                              %
                            </td>
                            {/* <td>
                              <span>
                                {formatNumber(
                                  rowData?.dataByUnit?.TotalContractAmount
                                )}
                              </span>
                            </td> */}
                            <td>
                              {formatNumber(
                                rowData?.dataByUnit?.AvgContractAmount
                              )}
                            </td>
                            <td>
                              {formatNumber(
                                rowData?.dataBySqm?.AvgContractAmount
                              )}
                            </td>
                          </tr>
                        )
                      })}
                      <tr className="text-strong">
                        <td></td>
                        <td>{L("TOTAL")} </td>

                        <td>
                          {formatNumberFloat(
                            this.state.dataTotalOfTable?.totalUnitleaseable
                          )}
                        </td>
                        <td>
                          {formatNumberFloat(
                            this.state.dataTotalOfTable?.totalArealeaseable
                          )}
                        </td>
                        <td>
                          {formatNumberFloat(
                            this.state.dataTotalOfTable?.totalUnitUnUsed
                          )}{" "}
                        </td>
                        <td>
                          {formatNumberFloat(
                            this.state.dataTotalOfTable?.totalAreaUnUsed
                          )}{" "}
                        </td>
                        <td>
                          {formatNumberFloat(
                            this.state.dataTotalOfTable?.totalUnitLeased
                          )}{" "}
                        </td>
                        <td>
                          {formatNumberFloat(
                            this.state.dataTotalOfTable?.totalUnitLeasedPercent
                          )}
                          %
                        </td>
                        <td>{this.state.dataTotalOfTable?.totalAreaLeased} </td>
                        <td>
                          {formatNumberFloat(
                            this.state.dataTotalOfTable?.totalAreaLeasedPercent
                          )}
                          %
                        </td>
                        <td>
                          {this.state.dataTotalOfTable?.totalUnitUsedAll}{" "}
                        </td>
                        <td>
                          {formatNumberFloat(
                            this.state.dataTotalOfTable?.totalUnitUsedAllPercent
                          )}
                          %
                        </td>
                        <td>
                          {this.state.dataTotalOfTable?.totalAreaUsedAll}{" "}
                        </td>
                        <td>
                          {formatNumberFloat(
                            this.state.dataTotalOfTable?.totalAreaUsedAllPercent
                          )}
                          %
                        </td>

                        {/* <td>
                          {formatNumber(
                            this.state.dataTotalOfTable?.totalRentalFee
                          )}
                        </td> */}
                        <td>
                          {formatNumber(
                            this.state.dataTotalOfTable?.totalavgByUnit
                          )}
                        </td>
                        <td>
                          {formatNumber(
                            this.state.dataTotalOfTable?.totalavgBySqm
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Col>
              <Col sm={{ span: 16, offset: 0 }}>
                <div className="table-contr" id="tblConsolidateOcc">
                  <table className="table-occ-summary">
                    <thead>
                      <tr className="bg-head-consolidate">
                        <th rowSpan={2}>{L("PROJECT_CODE")} </th>
                        <th rowSpan={2}>{L("UNIT_TYPE")} </th>
                        <th colSpan={3}>{L("HIGHEST_RENT")} </th>
                        <th colSpan={3}>{L("LOWEST_RENT")} </th>
                      </tr>
                      <tr className="bg-head-consolidate">
                        <th>{L("UNIT")} </th>
                        <th>{L("AMOUNT_VND")} </th>
                        <th>{L("LOCATION_/_VIEW")} </th>
                        <th>{L("UNIT")} </th>
                        <th>{L("AMOUNT_VND")} </th>
                        <th>{L("LOCATION_/_VIEW")} </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.dataAvgTable?.map((rowData) => {
                        return (
                          <tr>
                            <th>{rowData?.ProjectCode} </th>
                            <th>{rowData?.UnitTypeName} </th>
                            <td>{rowData?.UnitNameMaxRent} </td>
                            <td>{formatNumber(rowData?.MaxRent)}</td>
                            <td> </td>
                            <td>{rowData?.UnitNameMintRent} </td>
                            <td>{formatNumber(rowData?.MinRent)}</td>
                            <td> </td>
                          </tr>
                        )
                      })}
                      {/* <tr className="text-strong">
                        <td colSpan={2}>{L("TOTAL")} </td>

                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr> */}
                    </tbody>
                  </table>
                </div>
              </Col>
            </Row>
          </div>
        </Spin>
      </>
    )
  }
}

export default withRouter(TableConsolidateOccupancy)
