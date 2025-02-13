import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Row, Col, Spin, DatePicker, Button } from "antd"

import AppConsts, { dateFormat } from "@lib/appconst"
import Stores from "@stores/storeIdentifier"
import DashboardStore from "@stores/dashboardStore"
import withRouter from "@components/Layout/Router/withRouter"
import moment from "moment"

import CardTotalKeyOfAllUser from "./components/cardComponent/cardTotalKeyOfAllUser"
import MostActionInUse from "./components/chartComponent/mostActionInUse"
import MostActiveUser from "./components/chartComponent/mostActiveUser"
import MostActivities from "./components/tableComponent/mostActivities"
import ActivityByWeek from "./components/chartComponent/activityByWeek"

// import LaRevenueDetailsChart from "./component/overviewChart/laRevenueDetailsChart"
const { itemDashboard } = AppConsts
export interface IOverviewProps {
  selectItem: any
  dashboardStore: DashboardStore
}

const { RangePicker } = DatePicker
@inject(Stores.DashboardStore)
@observer
class AppUsageReport extends AppComponentListBase<IOverviewProps> {
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

    dataTotalKeyActivitiesOfAllUsers: [] as any,
    dataMostActionInUse: [] as any,
    dataActivityByWeek: [] as any,
    dataMostActiveUser: [] as any,
    dataUserActivities: [] as any,
  }

  componentDidMount() {
    this.getDashBoard()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectItem !== this.props.selectItem) {
      if (this.props.selectItem === itemDashboard.appUsage) {
        this.getDashBoard()
      }
    }
  }

  getDashBoard = async () => {
    await Promise.all([
      this.props.dashboardStore.getReportAppUsageActivity({
        ...this.state.filters,
      }),

      this.props.dashboardStore.getDashboardActivityByWeek({
        ...this.state.filters,
      }),
    ]).then(async () => {
      this.getDataTotalKeyActivitiesOfAllUsers(
        this.props.dashboardStore.dashboardAppUsageActivity
      )
      this.getDataMostActionInUse(
        this.props.dashboardStore.dashboardAppUsageActivity
      )
      this.getDataActivityByWeek(
        this.props.dashboardStore.dashboardActivityByWeek
      )
      this.getDataMostActiveUser(
        this.props.dashboardStore.dashboardAppUsageActivity
      )
      this.getDataUserActivities(
        this.props.dashboardStore.dashboardAppUsageActivity
      )
    })
  }

  getDataTotalKeyActivitiesOfAllUsers = (data) => {
    let thisValue = 0
    let lastValue = 0
    data?.map((item) => {
      if (item?.DateType === "ThisPeriod") {
        thisValue = thisValue + item?.CountNumber
      } else if (item?.DateType === "LastPeriod")
        lastValue = lastValue + item?.CountNumber
    })
    this.setState({
      dataTotalKeyActivitiesOfAllUsers: { thisValue, lastValue },
    })
  }
  getDataMostActionInUse = (data) => {
    const colArr = [] as any
    data.forEach((item) => {
      const colObj = colArr.find((dataCol) => dataCol?.Module === item?.Module)
      if (!colObj) {
        colArr.push({
          Module: item?.Module,
        })
      }
    })
    const dataReturn = colArr?.map((colItem) => {
      let thisValue = 0
      let lastValue = 0
      data?.map((item) => {
        if (item?.Module === colItem?.Module) {
          if (item?.DateType === "ThisPeriod") {
            thisValue = thisValue + item?.CountNumber
          } else if (item?.DateType === "LastPeriod")
            lastValue = lastValue + item?.CountNumber
        }
      })
      return {
        ...colItem,
        thisValue,
        lastValue,
      }
    })
    this.setState({
      dataMostActionInUse: dataReturn,
    })
  }

  getDataMostActiveUser = (data) => {
    const colArr = [] as any
    data.forEach((item) => {
      const colObj = colArr.find(
        (dataCol) => dataCol?.DisplayName === item?.DisplayName
      )
      if (!colObj) {
        colArr.push({
          DisplayName: item?.DisplayName,
        })
      }
    })
    const dataReturn = colArr?.map((colItem) => {
      let thisValue = 0
      let lastValue = 0
      data?.map((item) => {
        if (item?.DisplayName === colItem?.DisplayName) {
          if (item?.DateType === "ThisPeriod") {
            thisValue = thisValue + item?.CountNumber
          } else if (item?.DateType === "LastPeriod")
            lastValue = lastValue + item?.CountNumber
        }
      })
      return {
        ...colItem,
        thisValue,
        lastValue,
      }
    })
    this.setState({
      dataMostActiveUser: dataReturn,
    })
  }

  getDataUserActivities = (data) => {
    const colArr = [] as any
    data.forEach((item) => {
      const colObj = colArr.find(
        (dataCol) => dataCol?.DisplayName === item?.DisplayName
      )
      if (!colObj) {
        colArr.push({
          DisplayName: item?.DisplayName,
        })
      }
    })
    const dataReturn = [] as any
    colArr?.map((colItem) => {
      const thisPeriod = {
        LeaseAgreement: 0,
        Inquiry: 0,
        Reservation: 0,
        Company: 0,
        Contact: 0,
        Task: 0,
      }
      const lastPeriod = {
        LeaseAgreement: 0,
        Inquiry: 0,
        Reservation: 0,
        Company: 0,
        Contact: 0,
        Task: 0,
      }
      data?.map((item) => {
        if (item?.DisplayName === colItem?.DisplayName) {
          if (item?.DateType === "ThisPeriod") {
            switch (item?.Module) {
              case "LeaseAgreement": {
                thisPeriod.LeaseAgreement = item?.CountNumber
                break
              }
              case "Inquiry":
                thisPeriod.Inquiry = item?.CountNumber
                break
              case "Reservation":
                thisPeriod.Reservation = item?.CountNumber
                break
              case "Company":
                thisPeriod.Company = item?.CountNumber
                break
              case "Contact":
                thisPeriod.Contact = item?.CountNumber
                break
              case "Task":
                thisPeriod.Task = item?.CountNumber
                break
              default:
                break
            }
          } else if (item?.DateType === "LastPeriod")
            switch (item?.Module) {
              case "LeaseAgreement":
                lastPeriod.LeaseAgreement = item?.CountNumber
                break
              case "Inquiry":
                lastPeriod.Inquiry = item?.CountNumber
                break
              case "Reservation":
                lastPeriod.Reservation = item?.CountNumber
                break
              case "Company":
                lastPeriod.Company = item?.CountNumber
                break
              case "Contact":
                lastPeriod.Contact = item?.CountNumber
                break
              case "Task":
                lastPeriod.Task = item?.CountNumber
                break
              default:
                break
            }
        }
      })
      dataReturn.push({ ...colItem, DateType: "ThisPeriod", ...thisPeriod })
      dataReturn.push({ ...colItem, DateType: "LastPeriod", ...lastPeriod })
    })
    this.setState({
      dataUserActivities: dataReturn,
    })
  }
  getDataActivityByWeek = (data) => {
    const dataReturn = data?.map((item) => {
      const totalActivity =
        item.NumCompany +
        item.NumContact +
        item.NumReservation +
        item.NumTask +
        item.numLA

      return {
        weekNumber: item?.WeekNumber,
        DateType: item?.DateType,
        totalActivity: totalActivity,
      }
    })
    this.setState({
      dataActivityByWeek: dataReturn,
    })
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
        <Row gutter={[4, 8]}>
          <Col sm={{ span: 24 }}>
            {this.L("THIS_PERIOD")}&ensp;
            <RangePicker
              clearIcon={false}
              onChange={(value) => this.fillterChange("thisFromTo", value)}
              // }}
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
                <CardTotalKeyOfAllUser
                  data={this.state.dataTotalKeyActivitiesOfAllUsers}
                />
              </Col>
              <Col sm={{ span: 12 }}>
                <ActivityByWeek data={this.state.dataActivityByWeek} />
              </Col>
              <Col sm={{ span: 12 }}>
                <MostActionInUse data={this.state.dataMostActionInUse} />
              </Col>
              <Col sm={{ span: 12 }}>
                <MostActiveUser data={this.state.dataMostActiveUser} />
              </Col>
              <Col sm={{ span: 24 }}>
                <MostActivities data={this.state.dataUserActivities} />
              </Col>
            </Row>
          </div>
        </Spin>
      </>
    )
  }
}

export default withRouter(AppUsageReport)
