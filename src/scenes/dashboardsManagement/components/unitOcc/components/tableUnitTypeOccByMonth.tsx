import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Row, Col, Button, Spin, DatePicker, Select } from "antd"

import { L } from "@lib/abpUtility"
import {
  filterOptions,
  formatNumberFloat,
  handleDownloadPdf,
  tableToExcel,
} from "@lib/helper"
import AppConsts, {
  dateSortFormat,
  monthCharFormat,
  monthFormat,
} from "@lib/appconst"
import withRouter from "@components/Layout/Router/withRouter"
import DashboardStore from "@stores/dashboardStore"
import Stores from "@stores/storeIdentifier"
import moment from "moment"
import { ExcelIcon } from "@components/Icon"
import "../occTableStyle.less"
import projectService from "@services/projects/projectService"
import { debounce } from "lodash"
const { itemDashboard, dashboardOccType } = AppConsts
const { RangePicker } = DatePicker

export interface IProps {
  selectItem: any
  dashboardStore: DashboardStore
  projects: any[]
}

@inject(Stores.DashboardStore)
@observer
class TableUnitTypeOccByMonth extends AppComponentListBase<IProps> {
  printRef: any = React.createRef()
  state = {
    filters: {
      type: dashboardOccType.month,
      fromDate: moment().startOf("years").endOf("days").toJSON(),
      toDate: moment().endOf("years").endOf("days").toJSON(),
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
      .getDashboardUnitTypeOcc({
        ...this.state.filters,
      })
      .finally(() => {
        this.dataAnalysis(
          this.props.dashboardStore.dashboardUnitTypeOccDetailsMonthData
        )
        this.setState({
          dataTable:
            this.props.dashboardStore.dashboardUnitTypeOccDetailsMonthData,
        })
      })
  }

  dataAnalysis = (dataInput) => {
    const colArr = [] as any
    const projectArr = [] as any
    dataInput.forEach((item) => {
      const colObj = colArr.find(
        (dataCol) => dataCol?.colName === item?.FormattedDateName
      )
      const projectObj = projectArr.find(
        (project) => project?.projectId === item?.ProjectId
      )
      if (!colObj) {
        colArr.push({
          colName: item?.FormattedDateName,
        })
      }
      if (!projectObj) {
        projectArr.push({
          projectId: item?.ProjectId,
          projectName: item?.ProjectName,
        })
      }
    })

    const dataProject = projectArr.map((project) => {
      const dataFilter = dataInput.filter(
        (item) => item.ProjectId === project?.projectId
      )
      const unitTypeArr = [] as any

      dataFilter.forEach((item) => {
        const colObj = unitTypeArr.find(
          (dataCol) => dataCol?.unitTypeId === item?.UnitTypeId
        )

        if (!colObj) {
          unitTypeArr.push({
            unitTypeId: item?.UnitTypeId,
            unitTypeName: item?.UnitTypeName,
          })
        }
      })

      // let unitTypeArr = colArr.map((colObj) => {
      //   const data = dataFilter.filter(
      //     (item) => item.FormattedDateName === colObj?.colName
      //   )
      //   return data
      // })
      // Tạo data của row lọc theo từng type
      const aggregatedResult: any = Object.values(
        dataFilter.reduce((acc, item) => {
          const key = item.FormattedDateName
          if (!acc[key]) {
            acc[key] = {
              ...item,
              TotalAvailable: item.TotalAvailable ?? 0,
              Leased: item.Leased ?? 0,
              TotalVacant: item.TotalVacant ?? 0 - item.Leased ?? 0,
              Showroom: item.Showroom ?? 0,
              Renovation: item.Renovation ?? 0,
              Outoforder: item.Outoforder ?? 0,
              Outofservices: item.Outofservices ?? 0,
              PMHuse: item.PMHuse ?? 0,
              Inhouseuse: item.Inhouseuse ?? 0,
            }
          } else {
            acc[key].Leased += item.Leased ?? 0
            acc[key].Showroom += item.Showroom ?? 0
            acc[key].Renovation += item.Renovation ?? 0
            acc[key].Outoforder += item.Outoforder ?? 0
            acc[key].Outofservices += item.Outofservices ?? 0
            acc[key].PMHuse += item.PMHuse ?? 0
            acc[key].Inhouseuse += item.Inhouseuse ?? 0

            acc[key].TotalAvailable -=
              (item.PMHuse ?? 0) + (item.Inhouseuse ?? 0)

            acc[key].TotalVacant -=
              (item.Leased ?? 0) +
              (item.Showroom ?? 0) +
              (item.Renovation ?? 0) +
              (item.Outoforder ?? 0) +
              (item.Outofservices ?? 0) +
              (item.PMHuse ?? 0) +
              (item.Inhouseuse ?? 0)
          }
          return { ...acc }
        }, {})
      )

      const unitType = unitTypeArr
        .filter((u) => u.unitTypeId)
        .map((item) => {
          const unitList = dataFilter.filter(
            (unit) => unit.UnitTypeId === item?.unitTypeId
          )
          const unitTypes = colArr.map((item2) => {
            const unit = unitList.find(
              (u) => u.FormattedDateName === item2.colName
            )
            // thêm mới: tạo true Percent theo unit type (do data hiện đang lấy Lease/TotalAvailable(của type đó)=> trường hợp type khác cũng có pmhUse||inhouseUse thì sẽ ra data sai)
            const trueAvailable = aggregatedResult.find(
              (proj) =>
                proj?.FormattedDateName === unit?.FormattedDateName &&
                proj?.ProjectId === unit?.ProjectId
            )?.TotalAvailable
            const truePercent =
              Math.round((unit?.Leased * 10000) / trueAvailable) / 100

            return { ...unit, Percent: truePercent }
          })
          return {
            ...item,

            dataUnitType: unitTypes,
          }
        })
      return {
        projectId: project?.projectId,
        projectName: project?.projectName,
        unitTypes: unitType,
        dataProject: aggregatedResult,
      }
    })
    return (
      <table className="table-occ">
        <thead>
          <tr>
            <th></th>
            {colArr.map((colData, index) => {
              return <th>{moment(colData?.colName).format(monthCharFormat)}</th>
            })}
            <th>{L("AVG_OCC")}</th>
          </tr>
        </thead>
        <tbody>
          {dataProject.map((project, index) => {
            return (
              <>
                <tr>
                  <td className="project-row">{L("PROJECT_NAME")}</td>
                  <td
                    colSpan={project?.dataProject?.length}
                    className="project-row"
                  >
                    <div>{project?.projectName}</div>
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>{L("TOTAL_AVAILABLE")}</td>
                  {project?.dataProject.map((item) => {
                    return (
                      <td className="text-right">
                        {formatNumberFloat(item?.TotalAvailable)}
                      </td>
                    )
                  })}
                  <td></td>
                </tr>
                <tr>
                  <td>{L("LEASED")}</td>
                  {project?.dataProject.map((item) => {
                    return (
                      <td className="text-right">
                        {formatNumberFloat(item?.Leased)}
                      </td>
                    )
                  })}
                  <td></td>
                </tr>
                {project?.unitTypes.map((unitType) => {
                  const maxOcc = Math.max(
                    ...(unitType?.dataUnitType ?? ([] as any)).map(
                      (item) => item?.Percent ?? 0
                    )
                  )
                  const minOcc = Math.min(
                    ...(unitType?.dataUnitType ?? ([] as any)).map(
                      (item) => item?.Percent ?? 0
                    )
                  )

                  const rageOccPercent = maxOcc - minOcc

                  const avgOcc =
                    unitType?.dataUnitType?.reduce(
                      (accumulator, currentValue) =>
                        accumulator + (currentValue?.Percent ?? 0),
                      0
                    ) / project?.dataProject?.length

                  return (
                    <>
                      <tr>
                        <td className="lease-cell">
                          {L(unitType?.unitTypeName)}
                        </td>
                        {unitType?.dataUnitType.map((item) => {
                          return (
                            <td className="text-right lease-cell">
                              {formatNumberFloat(item?.Leased)}
                            </td>
                          )
                        })}
                        <td className="lease-cell"></td>
                      </tr>
                      <tr>
                        <td className="occ-cell">({L("OCC_%")})</td>
                        {unitType?.dataUnitType.map((item) => {
                          const colorRank =
                            ((item?.Percent - minOcc) /
                              (rageOccPercent > 0 ? rageOccPercent : 1)) *
                            1000
                          const colorCell = `rgba(7, 143, 233, ${
                            Math.round(colorRank) / 1000
                          })`
                          return (
                            <td
                              style={{ backgroundColor: colorCell }}
                              className="text-right occ-cell"
                            >
                              {formatNumberFloat(item?.Percent)}%
                            </td>
                          )
                        })}
                        <td className="text-right occ-cell">
                          {formatNumberFloat(avgOcc)}%
                        </td>
                      </tr>
                    </>
                  )
                })}

                <tr>
                  <td>{L("VACANT")}</td>
                  {project?.dataProject.map((item) => {
                    return (
                      <td className="text-right">
                        {formatNumberFloat(item?.TotalVacant)}
                      </td>
                    )
                  })}
                  <td></td>
                </tr>
                <tr>
                  <td>{L("SHOWROOM")}</td>
                  {project?.dataProject.map((item) => {
                    return (
                      <td className="text-right">
                        {formatNumberFloat(item?.Showroom)}
                      </td>
                    )
                  })}
                  <td></td>
                </tr>
                <tr>
                  <td>{L("RENOVATION")}</td>
                  {project?.dataProject.map((item) => {
                    return (
                      <td className="text-right">
                        {formatNumberFloat(item?.Renovation)}
                      </td>
                    )
                  })}
                  <td></td>
                </tr>
                <tr>
                  <td>{L("OOO")}</td>
                  {project?.dataProject.map((item) => {
                    return (
                      <td className="text-right">
                        {formatNumberFloat(item?.Outoforder)}
                      </td>
                    )
                  })}
                  <td></td>
                </tr>
                <tr>
                  <td>{L("OOS")}</td>
                  {project?.dataProject.map((item) => {
                    return (
                      <td className="text-right">
                        {formatNumberFloat(item?.Outofservices)}
                      </td>
                    )
                  })}
                  <td></td>
                </tr>
                <tr>
                  <td>{L("PMH_USE")}</td>
                  {project?.dataProject.map((item) => {
                    return (
                      <td className="text-right">
                        {formatNumberFloat(item?.PMHuse)}
                      </td>
                    )
                  })}
                  <td></td>
                </tr>
                <tr>
                  <td>{L("INHOUSE_USE")}</td>
                  {project?.dataProject.map((item) => {
                    return (
                      <td className="text-right">
                        {formatNumberFloat(item?.Inhouseuse)}
                      </td>
                    )
                  })}
                  <td></td>
                </tr>
                <tr>
                  <td>{L("TOTAL_UNIT")}</td>
                  {project?.dataProject.map((item) => {
                    return (
                      <td className="text-right">
                        {formatNumberFloat(item?.TotalUnit)}
                      </td>
                    )
                  })}
                  <td></td>
                </tr>
              </>
            )
          })}
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
          fromDate: moment(value[0]).startOf("months").endOf("days").toJSON(),
          toDate: moment(value[1]).endOf("months").endOf("days").toJSON(),
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
  handleDownloadPdfs = async (type) => {
    await this.setState({ isConvertting: true })
    const element = this.printRef.current
    await handleDownloadPdf(element, type, "CommissionDashboard.pdf").finally(
      () => {
        this.setState({ isConvertting: false })
      }
    )
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
                    <span>{L("BY_MONTH")}</span> &ensp;
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
                      format={monthFormat}
                      picker="month"
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
                          "tblOccUnitTypeByMonth",
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
                <div className="table-contr" id="tblOccUnitTypeByMonth">
                  {this.dataAnalysis(
                    this.props.dashboardStore
                      .dashboardUnitTypeOccDetailsMonthData
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

export default withRouter(TableUnitTypeOccByMonth)
