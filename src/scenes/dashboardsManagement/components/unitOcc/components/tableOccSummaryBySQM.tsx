import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Row, Col, Button, Spin, DatePicker, Select } from "antd"

import { L } from "@lib/abpUtility"
import { filterOptions, formatNumberFloat, tableToExcel } from "@lib/helper"
import AppConsts, { dateFormat, dateSortFormat } from "@lib/appconst"
import withRouter from "@components/Layout/Router/withRouter"
import DashboardStore from "@stores/dashboardStore"
import Stores from "@stores/storeIdentifier"
import moment from "moment"
import { ExcelIcon } from "@components/Icon"
import "../occTableStyle.less"
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
class TableOccSummaryBySQM extends AppComponentListBase<IProps> {
  printRef: any = React.createRef()
  state = {
    filters: {
      fromDate: moment().startOf("months").endOf("days").toJSON(),
      toDate: moment().endOf("months").endOf("days").toJSON(),
    },

    isConvertting: false,
    dataTable: [] as any,
    listProject: [] as any,
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
      .getDashboardSummaryOccSQM({
        ...this.state.filters,
      })
      .finally(() => {
        this.dataAnalysis(this.props.dashboardStore.dashboardOccSummarySqmData)
        this.setState({
          dataTable: this.props.dashboardStore.dashboardOccSummarySqmData,
        })
      })
  }

  dataAnalysis = (dataInput) => {
    return (
      <table className="table-occ-summary">
        <thead>
          <tr>
            <th rowSpan={2}>{L("STATUS")} </th>
            <th colSpan={dataInput?.length}>{L("TYPE")}</th>
            <th rowSpan={2}>{L("TOTAL")}</th>
          </tr>
          <tr>
            {dataInput.map((colData, index) => {
              return <th> {colData?.UnitTypeName}</th>
            })}
          </tr>
        </thead>
        <tbody>
          <tr className="bg-lease">
            <td>{L("LEASED")}</td>
            {dataInput.map((colData, index) => {
              return <td> {colData?.Leased ?? 0}</td>
            })}
            <td>{dataInput?.reduce((n, { Leased }) => n + Leased, 0)}</td>
          </tr>
          <tr className="bg-vacant">
            <td>{L("VACANT")}</td>
            {dataInput.map((colData, index) => {
              return <td> {colData?.TotalVacant ?? 0}</td>
            })}
            <td>
              {dataInput?.reduce((n, { TotalVacant }) => n + TotalVacant, 0)}
            </td>
          </tr>
          <tr>
            <td>{L("SHOWROOM")}</td>
            {dataInput.map((colData, index) => {
              return <td> {colData?.Showroom ?? 0}</td>
            })}
            <td>{dataInput?.reduce((n, { Showroom }) => n + Showroom, 0)}</td>
          </tr>{" "}
          <tr className="bg-yellow">
            <td>{L("RENOVATION")}</td>
            {dataInput.map((colData, index) => {
              return <td> {colData?.Renovation ?? 0}</td>
            })}
            <td>
              {dataInput?.reduce((n, { Renovation }) => n + Renovation, 0)}
            </td>
          </tr>{" "}
          <tr>
            <td className="text-red-hilight">{L("TOTAL_AVAILABLE")}</td>
            {dataInput.map((colData, index) => {
              return <td> {colData?.TotalAvailable ?? 0}</td>
            })}
            <td>
              {dataInput?.reduce(
                (n, { TotalAvailable }) => n + TotalAvailable,
                0
              )}
            </td>
          </tr>{" "}
          <tr className="bg-orange">
            <td>{L("PMH_USE")}</td>
            {dataInput.map((colData, index) => {
              return <td> {colData?.PMHuse ?? 0}</td>
            })}
            <td>{dataInput?.reduce((n, { PMHuse }) => n + PMHuse, 0)}</td>
          </tr>
          <tr className="bg-orange">
            <td>{L("INHOUSE_USE")}</td>
            {dataInput.map((colData, index) => {
              return <td> {colData?.Inhouseuse ?? 0}</td>
            })}
            <td>
              {dataInput?.reduce((n, { Inhouseuse }) => n + Inhouseuse, 0)}
            </td>
          </tr>
          <tr>
            <td className="text-red-hilight">{L("TOTAL_AREAS")}</td>
            {dataInput.map((colData, index) => {
              return <td> {colData?.TotalSQM}</td>
            })}
            <td>{dataInput?.reduce((n, { TotalSQM }) => n + TotalSQM, 0)}</td>
          </tr>
          <tr className="text-strong">
            <td>{L("LEASED_OCC_PERCENT")}</td>
            {dataInput.map((colData, index) => {
              return <td> {formatNumberFloat(colData?.Percent) ?? 0}%</td>
            })}
            <td>
              {formatNumberFloat(
                (100 * dataInput?.reduce((n, { Leased }) => n + Leased, 0)) /
                  dataInput?.reduce(
                    (n, { TotalAvailable }) => n + TotalAvailable,
                    0
                  )
              )}
              %
            </td>
          </tr>
        </tbody>
      </table>
    )
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
                          "tblOccSummarySQM",
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
                <div className="table-contr" id="tblOccSummarySQM">
                  {this.dataAnalysis(
                    this.props.dashboardStore.dashboardOccSummarySqmData
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </Spin>
      </>
    )
  }
}

export default withRouter(TableOccSummaryBySQM)
