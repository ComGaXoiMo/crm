import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Row, Col, Button, Select, DatePicker, Tooltip, Spin } from "antd"

import ReportByUnit from "../overview/component/reportTable/ReportByUnit"
import ReportByUnitType from "../overview/component/reportTable/reportByUnitType"
// import { random } from "lodash";
import { L } from "@lib/abpUtility"
import {
  convertFilterDate,
  filterOptions,
  handleDownloadPdf,
  renderOptions,
} from "@lib/helper"
import CountOfUnitByProject from "./components/CountOfUnitByProject"
import CountOfUnitByUnitType from "./components/CountOfUnitByUnitType"
import { FilePdfOutlined } from "@ant-design/icons"
import AppConsts, { dateFormat } from "@lib/appconst"
import DashboardStore from "@stores/dashboardStore"
import Stores from "@stores/storeIdentifier"
import moment from "moment"
import withRouter from "@components/Layout/Router/withRouter"
import projectService from "@services/projects/projectService"
import { debounce } from "lodash"
import ReactToPrint from "react-to-print"
// import ReportAvgByProject from "../overview/component/reportTable/reportAvgByProject"
const { RangePicker } = DatePicker
const { itemDashboard, reportType } = AppConsts

export interface IPropertiesReportProps {
  dashboardStore: DashboardStore
  selectItem: any
}

@inject(Stores.DashboardStore)
@observer
class PropertiesReport extends AppComponentListBase<IPropertiesReportProps> {
  printRef: any = React.createRef()
  state = {
    filters: {
      reportType: "year",
      fromDate: moment().startOf("year").endOf("days").toJSON(),
      toDate: moment().endOf("days").toJSON(),
    },

    listProject: [] as any,
    listUser: [] as any,
    dataTableSQMOcc: [] as any,
    dataTableUnitOcc: [] as any,
    dataTableUnitTypeOcc: [] as any,
    // dataTableAvgByProject: [] as any,

    dataChartUnitStatus: [] as any,
    listClorChartUnitStatus: [] as any,

    dataChartUnitType: [] as any,
    listColorChartUnitType: [] as any,
    isConvertting: false,
  }

  componentDidMount() {
    this.getDashBoard()
    this.getProject("")
  }
  componentDidUpdate(prevProps) {
    if (prevProps.selectItem !== this.props.selectItem) {
      if (this.props.selectItem === itemDashboard.property) {
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
    this.props.dashboardStore
      .getDashboardUnitCountOcc({
        ...this.state.filters,
      })
      .finally(() =>
        this.setState({
          dataTableUnitOcc: this.props.dashboardStore.dashboardUnitCountOccData,
        })
      ),
      this.props.dashboardStore
        .getDashboardUnitSQMOcc({
          ...this.state.filters,
        })
        .finally(() =>
          this.setState({
            dataTableSQMOcc: this.props.dashboardStore.dashboardUnitSQMOccData,
          })
        ),
      this.props.dashboardStore
        .getDashboardUnitTypeCountOcc({
          ...this.state.filters,
        })
        .finally(() => {
          this.setState({
            dataTableUnitTypeOcc:
              this.props.dashboardStore.dashboardUnitTypeCountOccData.filter(
                (item) => item?.UnitTypeId
              ),
          })
        })
    this.props.dashboardStore.getDataChartUnitTypeCountOcc().finally(() => {
      this.groupDataChartUnitType(
        this.props.dashboardStore.dataChartUnitTypeCountOccData
      )
    })
    // this.props.dashboardStore.getDataTableAvgByProject().finally(() => {
    //   this.setState({
    //     dataTableAvgByProject: this.props.dashboardStore.avgByProjectData,
    //   })
    // })
    this.props.dashboardStore
      .getDataChartUnitCountOcc({ ...this.state.filters })
      .finally(() => {
        this.groupDataChartUnitStatus(
          this.props.dashboardStore.dataChartUnitCountOccData
        )
      })
  }

  groupDataChartUnitStatus = (listData) => {
    const thisArr = [] as any
    listData.forEach((item) => {
      const existingProject = thisArr.find(
        (project) => project.ProjectName === item.ProjectName
      )

      if (!existingProject) {
        const { NumCount, StatusName, ...projectInfo } = item

        const statusKey = item.StatusName

        thisArr.push({ ...projectInfo, [statusKey]: item.NumCount })
      } else {
        const project = thisArr.find(
          (item) => item.ProjectName === existingProject.ProjectName
        )
        const index = thisArr.findIndex(
          (item) => item.ProjectName === existingProject.ProjectName
        )
        const statusKey = item.StatusName
        const newProject = { ...project, [statusKey]: item.NumCount }
        thisArr.splice(index, 1, newProject)
      }
    })
    const listColor = [
      { name: "Leased", color: "#3d53f2" },
      { name: "Inhouse use", color: "#118dff" },
      { name: "PMH use", color: "#f00" },
      { name: "Renovation", color: "#128b4c" },
      { name: "Showroom", color: "#ff7300" },
      { name: "Vacant", color: "#e063ff" },
      { name: "Out of services", color: "#b3a4d485" },
      { name: "Out of order", color: "#f0a6aa81" },
    ]

    this.setState({ dataChartUnitStatus: thisArr })
    this.setState({ listClorChartUnitStatus: listColor })
  }
  groupDataChartUnitType = (listData) => {
    const groupedData = {}
    listData.forEach((inquiry) => {
      const key = inquiry.UnitTypeName + inquiry.UnitTypeId
      if (!groupedData[key]) {
        groupedData[key] = {
          UnitTypeName: inquiry.UnitTypeName,
          StageColor:
            "#" +
            Math.floor(Math.random() * 16777215)
              .toString(16)
              .padStart(6, "0")
              .toUpperCase(),
          Count: 0,
        }
      }

      groupedData[key].Count++
    })
    const outputInquiryArray = Object.values(groupedData)

    this.setState({ listColorChartUnitType: outputInquiryArray })

    const UnitTypeMap = {}
    listData.forEach((item) => {
      const ProjectName = item.ProjectName
      const UnitTypeName = item.UnitTypeName

      if (!UnitTypeMap[ProjectName]) {
        UnitTypeMap[ProjectName] = {}
      }

      if (!UnitTypeMap[ProjectName][UnitTypeName]) {
        UnitTypeMap[ProjectName][UnitTypeName] = item.NumCount
      }
    })

    const dataBarCharInquiry = Object.keys(UnitTypeMap).map((item) => {
      const statusCount = UnitTypeMap[item]
      statusCount["ProjectName"] = item
      return statusCount
    })
    this.setState({ dataChartUnitType: dataBarCharInquiry })
  }
  handleDownloadPdfs = async (type) => {
    await this.setState({ isConvertting: true })
    const element = this.printRef.current
    await handleDownloadPdf(element, type, "PropertyDashboard.pdf").finally(
      () => {
        this.setState({ isConvertting: false })
      }
    )
  }
  handleSearch = async (name, value) => {
    const { filters } = this.state
    if (name === "dateFromTo") {
      if (value === null || value === undefined) {
        this.setState(
          {
            filters: {
              ...filters,
              reportType: "year",
              fromDate: moment().startOf("year").endOf("days").toJSON(),
              toDate: moment().endOf("days").toJSON(),
            },
            skipCount: 0,
          },
          async () => {
            await this.getDashBoard()
          }
        )
      } else {
        this.setState(
          { filters: convertFilterDate(filters, value) },
          async () => {
            await this.getDashBoard()
          }
        )
      }
    } else {
      if (name === "reportType") {
        if (value === "year") {
          this.setState(
            {
              filters: {
                ...filters,
                fromDate: moment().startOf("year").endOf("days").toJSON(),
                toDate: moment().endOf("days").toJSON(),
              },
            },
            async () => {
              await this.getDashBoard()
            }
          )
        } else {
          this.setState(
            {
              filters: {
                ...filters,
                fromDate: moment().startOf("month").endOf("days").toJSON(),
                toDate: moment().endOf("days").toJSON(),
              },
            },
            async () => {
              await this.getDashBoard()
            }
          )
        }
      } else {
        if (name === "projectId") {
          if (value === null || value === undefined) {
            this.setState(
              {
                filters: {
                  ...filters,
                  reportType: "year",
                  fromDate: moment().startOf("year").endOf("days").toJSON(),
                  toDate: moment().endOf("days").toJSON(),
                },
                skipCount: 0,
              },
              async () => {
                await this.getDashBoard()
              }
            )
          } else {
            const dataTableSQMOccNew =
              this.props.dashboardStore.dashboardUnitSQMOccData.filter(
                (item) => item.ProjectId === value
              )
            this.setState({ dataTableSQMOcc: dataTableSQMOccNew })

            const dataTableUnitOccNew =
              this.props.dashboardStore.dashboardUnitCountOccData.filter(
                (item) => item.ProjectId === value
              )
            this.setState({ dataTableUnitOcc: dataTableUnitOccNew })

            const dataTableUnitTypeOccNew =
              this.props.dashboardStore.dashboardUnitTypeCountOccData.filter(
                (item) => item.ProjectId === value
              )
            this.setState({ dataTableUnitTypeOcc: dataTableUnitTypeOccNew })

            // const dataTableAvgByProjectNew =
            //   this.props.dashboardStore.dashboardUnitTypeCountOccData.filter(
            //     (item) => item.ProjectId === value
            //   )
            // this.setState({ dataTableAvgByProject: dataTableAvgByProjectNew })
          }
        }
      }
    }
  }

  public render() {
    return (
      <>
        <Row gutter={[4, 8]}>
          <Col sm={{ span: 3, offset: 0 }}>
            <Select
              getPopupContainer={(trigger) => trigger.parentNode}
              placeholder={L("REPORT_TYPE")}
              style={{ width: "100%" }}
              defaultValue={this.state.filters.reportType}
              onChange={(value) => this.handleSearch("reportType", value)}
            >
              {renderOptions(reportType)}
            </Select>
          </Col>
          <Col sm={{ span: 4, offset: 0 }}>
            <RangePicker
              clearIcon={false}
              onChange={(value) => this.handleSearch("dateFromTo", value)}
              format={dateFormat}
              value={[
                moment(this.state.filters.fromDate),
                moment(this.state.filters.toDate),
              ]}
              placeholder={["From", "To"]}
            />
          </Col>

          <Col sm={{ span: 4, offset: 0 }}>
            <Select
              getPopupContainer={(trigger) => trigger.parentNode}
              filterOption={filterOptions}
              placeholder={L("Project")}
              style={{ width: "100%" }}
              allowClear
              onChange={(value) => this.handleSearch("projectId", value)}
              onSearch={debounce((e) => this.getProject(e), 600)}
              showSearch
            >
              {renderOptions(this.state.listProject)}
            </Select>
          </Col>
          <Col sm={{ span: 4, offset: 0 }} />

          <Col sm={{ span: 9, offset: 0 }} style={{ textAlign: "right" }}>
            <ReactToPrint
              onBeforeGetContent={() => {
                this.setState({ isConvertting: true })

                return Promise.resolve()
              }}
              onAfterPrint={() => this.setState({ isConvertting: false })}
              trigger={() => (
                <Tooltip title={L("REVIEW_PDF")} placement="topLeft">
                  <Button
                    icon={<FilePdfOutlined />}
                    className="button-primary"
                  ></Button>
                </Tooltip>
              )}
              documentTitle={L("PROPERTY_REPORT")}
              pageStyle="@page { size:  19.8in 14in  }"
              removeAfterPrint
              content={() => this.printRef.current}
            />
          </Col>
        </Row>
        <Spin spinning={this.props.dashboardStore.isLoading}>
          <div ref={this.printRef} className="dashboard-style">
            <Row gutter={[8, 16]} className="w-100">
              <Col sm={{ span: 12, offset: 0 }} className="w-100">
                <CountOfUnitByProject
                  data={this.state.dataChartUnitStatus}
                  listColor={this.state.listClorChartUnitStatus}
                />
              </Col>
              <Col sm={{ span: 12, offset: 0 }}>
                <CountOfUnitByUnitType
                  data={this.state.dataChartUnitType}
                  listColor={this.state.listColorChartUnitType}
                />
              </Col>
              <Col sm={{ span: 24, offset: 0 }}>
                <ReportByUnit
                  dataUnitOcc={this.state.dataTableUnitOcc}
                  isConvertting={this.state.isConvertting}
                  dataSQMOcc={this.state.dataTableSQMOcc}
                />
              </Col>
              <Col sm={{ span: 24, offset: 0 }}>
                <ReportByUnitType
                  data={this.state.dataTableUnitTypeOcc}
                  isConvertting={this.state.isConvertting}
                />
              </Col>
              {/* <Col sm={{ span: 24, offset: 0 }}>
                <ReportAvgByProject
                  data={this.state.dataTableAvgByProject}
                  isConvertting={this.state.isConvertting}
                />
              </Col> */}
            </Row>
          </div>
        </Spin>
      </>
    )
  }
}

export default withRouter(PropertiesReport)
