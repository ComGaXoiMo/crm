import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Row, Col, Spin, DatePicker, Button, Select } from "antd"

import AppConsts, { dateFormat } from "@lib/appconst"
import Stores from "@stores/storeIdentifier"
import DashboardStore from "@stores/dashboardStore"
import withRouter from "@components/Layout/Router/withRouter"
import moment from "moment"
import CardTotalValueOfLA from "./component/overviewCard/cardTotalValueOfLA"
import CardAverageLengthOfStay from "./component/overviewCard/cardAverageLengthOfStay"
import CardTotalValueOfLARequest from "./component/overviewCard/cardTotalValueOfLARequest"
import CardDroppedLA from "./component/overviewCard/cardDroppedLA"
import Card4LAInfo from "./component/overviewCard/card4LAInfo"
import MostPorpularLeaseUnit from "./component/overviewChart/mostPorpularLeaseUnit"
import LeaseExprirationChart from "./component/overviewChart/leaseExprirationChart"
import LeaseStatusChart from "./component/overviewChart/leaseStatusChart"
import { filterOptions, formatNumberFloat, renderOptions } from "@lib/helper"
import _, { debounce } from "lodash"
import projectService from "@services/projects/projectService"
import CardOccRateByUnitStatus from "./component/overviewCard/cardOccRateByUnitStatus"
import CardOccBySQM from "./component/overviewCard/cardOccBySQM"
import CardOccByUnitType from "./component/overviewCard/cardOccByUnitType"
import OccRateByUnitStatusChart from "./component/overviewChart/occRateByUnitStatus"
import LaRevenueDetailsChart from "./component/overviewChart/laRevenueDetailsChart"
import { L } from "@lib/abpUtility"
import CardPerformanceQuickView from "./component/overviewCard/cardPerformanceQuickView"
const { itemDashboard } = AppConsts
export interface IOverviewProps {
  selectItem: any
  dashboardStore: DashboardStore
}

const { RangePicker } = DatePicker
@inject(Stores.DashboardStore)
@observer
class Overviews extends AppComponentListBase<IOverviewProps> {
  printRef: any = React.createRef()
  state = {
    filters: {
      thisFromDate: moment().startOf("year").endOf("days").toJSON(),
      thisToDate: moment().endOf("days").toJSON(),
      lastFromDate: moment()
        .startOf("year")
        .endOf("days")
        .subtract(1, "years")
        .toJSON(),
      lastToDate: moment().subtract(1, "years").endOf("days").toJSON(),
    },

    datesDisable: [] as any,
    listProject: [] as any,
    dataOfLa: {} as any,
    dataTotalOfLa: {} as any,
    dataOfLaRequest: {} as any,
    dataExpiryDate: [] as any,
    dataPopular: [] as any,
    dataLeaseUnitStatus: [] as any,
    dataLAModule: {} as any,
    dataLeaseDropStage: [] as any,
    dataLastOccUnitStatus: [] as any,
    dataThisOccUnitStatus: [] as any,
    dataLastSqmOccUnit: [] as any,
    dataThisSqmOccUnit: [] as any,

    dataLastUnitTypeOcc: [] as any,
    dataThisUnitTypeOcc: [] as any,
    dataThisUnitStatusByMonth: [] as any,
    dataLARevenueDetailsChart: [] as any,
  }

  componentDidMount() {
    this.getDashBoard()
    this.getProject("")
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectItem !== this.props.selectItem) {
      if (this.props.selectItem === itemDashboard.overView) {
        this.getDashBoard()
        this.getProject("")
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
    await Promise.all([
      this.props.dashboardStore.getOverviewOfLA({
        ...this.state.filters,
      }),
      this.props.dashboardStore.getOverviewTotalOfLA({
        ...this.state.filters,
      }),
      this.props.dashboardStore.getOverviewOfLARequest({
        ...this.state.filters,
      }),
      this.props.dashboardStore.getDashboarOverviewLAExpired({
        ...this.state.filters,
      }),
      this.props.dashboardStore.getDashboarPopularLeaseUnit({
        ...this.state.filters,
      }),
      this.props.dashboardStore.getDashboarLeaseUnitStatus({
        ...this.state.filters,
      }),
      this.props.dashboardStore.getDashboarOverviewModule({
        ...this.state.filters,
      }),
      this.props.dashboardStore.getDashboarLADropStage({
        ...this.state.filters,
      }),
      this.props.dashboardStore.getDashboardV1UnitCountOcc({
        ...this.state.filters,
      }),
      this.props.dashboardStore.getDashboardV1SqmOccUnit({
        ...this.state.filters,
      }),
      this.props.dashboardStore.getDashboardV1UnitTypeOcc({
        ...this.state.filters,
      }),
      this.props.dashboardStore.getDashboardUnitCountOccByMonth(),
      this.props.dashboardStore.getDashboardLARevenueDetails(),
    ]).then(async () => {
      this.setState({
        dataOfLa: this.props.dashboardStore.dashboardOveriewOfLa[0],
        dataTotalOfLa: this.props.dashboardStore.dashboardOveriewTotalOfLa[0],
        dataOfLaRequest:
          this.props.dashboardStore.dashboardOveriewOfLaRequest[0],
        dataExpiryDate: this.props.dashboardStore.dashboardReportLAExpired,
        dataPopular: this.props.dashboardStore.dashboardPopularLeaseUnit,
        dataLeaseUnitStatus: this.props.dashboardStore.dashboardLeaseUnitStatus,
        dataLAModule: this.props.dashboardStore.dashboardOverviewLAModule[0],
        dataLeaseDropStage: this.props.dashboardStore.dashboardLAdropStage,

        dataThisOccUnitStatus:
          this.props.dashboardStore.dashboardOccUnitCountThis,
        dataLastOccUnitStatus:
          this.props.dashboardStore.dashboardOccUnitCountLast,
        dataThisSqmOccUnit: this.props.dashboardStore.dashboardSqmOccUnitThis,
        dataLastSqmOccUnit: this.props.dashboardStore.dashboardSqmOccUnitLast,

        dataThisUnitTypeOcc: this.getDataUnitTypeOcc(
          this.props.dashboardStore.dashboardUnitTypeOccThis
        ),
        dataLastUnitTypeOcc: this.getDataUnitTypeOcc(
          this.props.dashboardStore.dashboardUnitTypeOccLast
        ),
        dataThisUnitStatusByMonth: this.getDataUnitCountOccByMonth(
          this.props.dashboardStore.dashboardUnitTypeOccByMonth
        ),

        dataLARevenueDetailsChart: this.getDataLARevenueDetails(
          this.props.dashboardStore.dataLARevenueDetailsChart,
          this.props.dashboardStore.dataLARevenueDetailsChartLastYear
        ),
      })
    })
  }

  getDataLARevenueDetails = (arrInput, arrayLastYear) => {
    const thisArr = [] as any
    arrInput.forEach((item) => {
      const monthObj = thisArr.find(
        (monthData) => monthData?.FormatDate === item?.FormatDate
      )

      if (!monthObj) {
        thisArr.push({
          FormatDate: item?.FormatDate,
        })
      }
    })

    const arrRes = thisArr.map((monthObj) => {
      const projectThis = arrInput
        .filter((item) => item.FormatDate === monthObj.FormatDate)
        .map((unitType) => {
          return {
            projectCode: unitType?.ProjectCode,
            contractAmount: unitType?.ContractAmount,
          }
        })
      const projectLast = arrayLastYear
        .filter((item) => item.FormatDate === monthObj.FormatDate)
        .map((unitType) => {
          return {
            projectCode: unitType?.ProjectCode,
            contractAmount: unitType?.ContractAmount,
          }
        })
      const resValue = _.sumBy(projectThis, "contractAmount")
      const resLastValue = _.sumBy(projectLast, "contractAmount")
      const newProjectItem = {
        ...monthObj,
        data: [
          {
            projectCode: L("THIS_TOTAL_VALUE"),
            contractAmount: resValue,
          },
          {
            projectCode: L("LAST_TOTAL_VALUE"),
            contractAmount: resLastValue,
          },
          ...projectThis,
        ],
      }
      return newProjectItem
    })

    return arrRes
  }

  getDataUnitTypeOcc = (arrInput) => {
    const thisArr = [] as any
    arrInput.forEach((item) => {
      const existingProject = thisArr.find(
        (project) => project.ProjectId === item.ProjectId
      )

      if (!existingProject) {
        const { UnitTypeName, Percent, ...projectInfo } = item

        thisArr.push(projectInfo)
      }
    })
    const arrRes = thisArr.map((project) => {
      let leased = 0
      let occPercent = 0
      const unitTypes = arrInput
        .filter((item) => item.ProjectId === project.ProjectId)
        .map((unitType) => {
          leased = leased + unitType.Leased
          occPercent = occPercent + unitType.Percent
          return {
            unitType: unitType?.UnitTypeName,
            percent: unitType?.Percent,
            TotalUnitByType: unitType?.TotalUnitByType,
            TotalVacantByType: unitType?.TotalVacantByType,
            TotalLeasedByType: unitType.Leased, // unitType?.TotalUnitByType - unitType?.TotalVacantByType,s
          }
        })

      const newProjectItem = {
        ...project,
        OccPercent: occPercent,
        Leased: leased,

        unitTypes: unitTypes,
      }
      return newProjectItem
    })
    return arrRes
  }

  getDataUnitCountOccByMonth = (arrInput) => {
    const thisArr = [] as any
    arrInput.forEach((item) => {
      const monthObj = thisArr.find(
        (monthData) => monthData?.MonthRange === item?.MonthRange
      )

      if (!monthObj) {
        thisArr.push({
          FormattedMonthName: item?.FormattedMonthName,
          MonthRange: item?.MonthRange,
        })
      }
    })

    const arrRes = thisArr.map((monthObj) => {
      const projectList = arrInput
        .filter((item) => item.MonthRange === monthObj.MonthRange)
        .map((unitType) => {
          return {
            projectName: unitType?.ProjectName,
            percent: formatNumberFloat(unitType?.Percent),
          }
        })
      const newProjectItem = { ...monthObj, data: projectList }
      return newProjectItem
    })

    return arrRes
  }
  handleSearch = () => {
    this.getDashBoard()
  }
  fillterChange = async (name, value) => {
    const { filters } = this.state
    if (name === "thisFromTo") {
      this.setState({
        filters: {
          ...filters,
          thisFromDate: moment(value[0]).endOf("days").toJSON(),
          thisToDate: moment(value[1]).endOf("days").toJSON(),
        },
      })
    } else if (name === "lastFromTo") {
      this.setState({
        filters: {
          ...filters,
          lastFromDate: moment(value[0]).endOf("days").toJSON(),
          lastToDate: moment(value[1]).endOf("days").toJSON(),
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

  public render() {
    return (
      <>
        <div ref={this.printRef} className="dashboard-style">
          <Row gutter={[12, 16]}>
            <>
              <Col sm={{ span: 24 }}>
                <LaRevenueDetailsChart
                  data={this.state.dataLARevenueDetailsChart}
                />
              </Col>
              <Col sm={{ span: 24 }}>
                <OccRateByUnitStatusChart
                  data={this.state.dataThisUnitStatusByMonth}
                />
              </Col>
            </>
          </Row>
          <br />
          <Row gutter={[12, 16]}>
            <Col sm={{ span: 24 }}>
              <CardPerformanceQuickView />
            </Col>
          </Row>
          <br />
          <Row gutter={[4, 8]}>
            <Col sm={{ span: 24 }}>
              {this.L("THIS_PERIOD")}&ensp;
              <RangePicker
                clearIcon={false}
                onChange={(value) => this.fillterChange("thisFromTo", value)}
                format={dateFormat}
                value={[
                  moment(this.state.filters.thisFromDate),
                  moment(this.state.filters.thisToDate),
                ]}
                placeholder={["From", "To"]}
              />
              &ensp;&ensp;
              {this.L("COMPARATION_PERIOD")}&ensp;
              <RangePicker
                clearIcon={false}
                onChange={(value) => this.fillterChange("lastFromTo", value)}
                format={dateFormat}
                value={[
                  moment(this.state.filters.lastFromDate),
                  moment(this.state.filters.lastToDate),
                ]}
                placeholder={["From", "To"]}
              />
              &ensp;
              <Select
                getPopupContainer={(trigger) => trigger.parentNode}
                filterOption={filterOptions}
                placeholder={this.L("Project")}
                allowClear
                onChange={(value) => this.fillterChange("projectId", value)}
                onSearch={debounce((e) => this.getProject(e), 600)}
                showSearch
              >
                {renderOptions(this.state.listProject)}
              </Select>
              &ensp;
              <Button className="button-primary" onClick={this.handleSearch}>
                {this.L("SEARCH")}
              </Button>
            </Col>
          </Row>
          <br />
          <Spin spinning={this.props.dashboardStore.isLoading}>
            <Row gutter={[12, 16]}>
              <Col sm={{ span: 8 }}>
                <CardTotalValueOfLA
                  data={this.state.dataTotalOfLa}
                  filters={this.state.filters}
                />
              </Col>
              <Col sm={{ span: 16 }}>
                <Row gutter={[12, 16]}>
                  <Col sm={{ span: 12 }}>
                    <CardTotalValueOfLARequest
                      data={this.state.dataOfLaRequest}
                      filters={this.state.filters}
                    />
                  </Col>
                  {/* hiden 17/09/2024 */}
                  {/* <Col sm={{ span: 12 }}>
                    <CardAverageRentalRate
                      data={this.state.dataOfLa}
                      filters={this.state.filters}
                    />
                  </Col> */}
                  <Col sm={{ span: 12 }}>
                    <CardAverageLengthOfStay
                      data={this.state.dataOfLa}
                      filters={this.state.filters}
                    />
                  </Col>
                  <Col sm={{ span: 12 }}>
                    <Card4LAInfo
                      data={this.state.dataLAModule}
                      filters={this.state.filters}
                    />
                  </Col>
                  <Col sm={{ span: 12 }}>
                    <CardDroppedLA
                      data={this.state.dataLeaseDropStage}
                      filters={this.state.filters}
                    />
                  </Col>
                </Row>
              </Col>
              <Col sm={{ span: 9 }}>
                <MostPorpularLeaseUnit data={this.state.dataPopular} />
              </Col>
              <Col sm={{ span: 6 }}>
                <LeaseExprirationChart data={this.state.dataExpiryDate} />
              </Col>
              <Col sm={{ span: 9 }}>
                <LeaseStatusChart data={this.state.dataLeaseUnitStatus} />
              </Col>
              <Col sm={{ span: 8 }}>
                <CardOccRateByUnitStatus
                  dataThis={this.state.dataThisOccUnitStatus}
                  dataLast={this.state.dataLastOccUnitStatus}
                />
              </Col>{" "}
              <Col sm={{ span: 8 }}>
                <CardOccBySQM
                  dataThis={this.state.dataThisSqmOccUnit}
                  dataLast={this.state.dataLastSqmOccUnit}
                />
              </Col>{" "}
              <Col sm={{ span: 8 }}>
                <CardOccByUnitType
                  dataThis={this.state.dataThisUnitTypeOcc}
                  dataLast={this.state.dataLastUnitTypeOcc}
                />
              </Col>
            </Row>
          </Spin>
        </div>
      </>
    )
  }
}

export default withRouter(Overviews)
