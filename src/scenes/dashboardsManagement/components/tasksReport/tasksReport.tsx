import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import {
  Row,
  Col,
  Table,
  Button,
  Divider,
  Select,
  DatePicker,
  Tooltip,
  Spin,
  Card,
} from "antd"

import ChartCircleActivity from "./components/ChartCircleActivity"
import ChartCircleTask from "./components/ChartCircleTask"
import ChartBarTaskStaff from "../staffsReport/components/ChartBarTaskStaff"
import ChartBarActivityStaff from "../staffsReport/components/ChartBarActivityStaff"
import { L } from "@lib/abpUtility"
import {
  convertFilterDate,
  handleDownloadPdf,
  renderDate,
  renderOptions,
  tableToExcel,
} from "@lib/helper"
import AppConsts, { dateFormat } from "@lib/appconst"
import { FilePdfOutlined } from "@ant-design/icons"
import withRouter from "@components/Layout/Router/withRouter"
import DashboardStore from "@stores/dashboardStore"
import Stores from "@stores/storeIdentifier"
import moment from "moment"
import ReactToPrint from "react-to-print"
import { ExcelIcon } from "@components/Icon"

const { itemDashboard, reportType } = AppConsts

const { RangePicker } = DatePicker

export interface ITasksReportProps {
  selectItem: any
  dashboardStore: DashboardStore
}

const { align } = AppConsts

const columns = [
  {
    title: L("TASK_NAME"),
    dataIndex: "TaskName",
    key: "TaskName",
    width: "25%",
    ellipsis: true,
    render: (TaskName) => <>{TaskName}</>,
  },
  {
    title: L("TASK_STATUS"),
    dataIndex: "Status",
    key: "Status",
    width: "12%",
    render: (Status) => <>{Status}</>,
  },
  {
    title: L("RELATED_TO"),
    dataIndex: "RelatedTo",
    key: "RelatedTo",
    width: "15%",
    render: (RelatedTo) => <>{RelatedTo}</>,
  },

  {
    title: L("CREATE_USER"),
    dataIndex: "Staff",
    key: "Staff",
    width: "15%",
    render: (Staff) => <>{Staff}</>,
  },
  {
    title: L("CREATE_AT"),
    dataIndex: "CreateAt",
    ellipsis: false,
    key: "CreateAt",
    align: align.left,
    render: renderDate,
  },
]
@inject(Stores.DashboardStore)
@observer
class TasksReport extends AppComponentListBase<ITasksReportProps> {
  printRef: any = React.createRef()
  state = {
    filters: {
      reportType: "year",
      keyword: "",
      fromDate: moment().startOf("year").toJSON(),
      toDate: moment().toJSON(),
    },
    dataActivityGroup: [] as any,
    dataCircleTaskStatusGroup: [] as any,
    dataBarTaskStatusGroup: [] as any,
    dataCircleActivetatusGroup: [] as any,
    dataBarActivityStatusGroup: [] as any,
    isConvertting: false,
    dataShow: [] as any,
  }

  componentDidMount() {
    this.getDashBoard()
  }
  componentDidUpdate(prevProps) {
    if (prevProps.selectItem !== this.props.selectItem) {
      if (this.props.selectItem === itemDashboard.task) {
        this.getDashBoard()
      }
    }
  }

  getDashBoard = async () => {
    this.props.dashboardStore
      .getDashboardTask({
        ...this.state.filters,
      })
      .finally(() => {
        this.groupTaskData(this.props.dashboardStore.dashboardTaskData)
        this.setState({
          dataShow: this.props.dashboardStore.dashboardTaskData,
        })
      })
    await this.props.dashboardStore
      .getDashboardActivity({
        ...this.state.filters,
      })
      .finally(() => {
        this.groupActivityData(this.props.dashboardStore.dashboardActivityData)
      })
  }

  groupTaskData = (listData) => {
    const groupedData = {}
    listData.forEach((task) => {
      const key = task.Status + task.Color
      if (!groupedData[key]) {
        groupedData[key] = {
          Status: task.Status,
          Color: task.Color,
          Count: 0,
        }
      }

      groupedData[key].Count++
    })
    const outputTaskArray = Object.values(groupedData)
    this.setState({ dataCircleTaskStatusGroup: outputTaskArray })

    const staffStatusMap = {}

    listData.forEach((task) => {
      const staff = task.Staff
      const status = task.Status

      if (!staffStatusMap[staff]) {
        staffStatusMap[staff] = {}
      }

      if (!staffStatusMap[staff][status]) {
        staffStatusMap[staff][status] = 0
      }

      staffStatusMap[staff][status]++
    })

    const resultStaff = Object.keys(staffStatusMap).map((staff) => {
      const statusCount = staffStatusMap[staff]
      statusCount["Staff"] = staff
      return statusCount
    })

    this.setState({ dataBarTaskStatusGroup: resultStaff })
  }

  groupActivityData = (listData) => {
    const groupedData = {}
    listData.forEach((item) => {
      const key = item.Module + item.Color
      if (!groupedData[key]) {
        groupedData[key] = {
          Module: item.Module,
          Color: item.Color,
          Count: 0,
        }
      }

      groupedData[key].Count++
    })
    const outputArray = Object.values(groupedData)
    this.setState({ dataCircleActivetatusGroup: outputArray })

    const staffStatusMap = {}

    listData.forEach((task) => {
      const displayName = task.DisplayName
      const module = task.Module

      if (!staffStatusMap[displayName]) {
        staffStatusMap[displayName] = {}
      }

      if (!staffStatusMap[displayName][module]) {
        staffStatusMap[displayName][module] = 0
      }

      staffStatusMap[displayName][module]++
    })

    const resultStaff = Object.keys(staffStatusMap).map((displayName) => {
      const statusCount = staffStatusMap[displayName]
      statusCount["DisplayName"] = displayName
      return statusCount
    })

    this.setState({ dataBarActivityStatusGroup: resultStaff })
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
              fromDate: moment().startOf("year").toJSON(),
              toDate: moment().toJSON(),
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
                fromDate: moment().startOf("year").toJSON(),
                toDate: moment().toJSON(),
              },
              skipCount: 0,
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
                fromDate: moment().startOf("month").toJSON(),
                toDate: moment().toJSON(),
              },
              skipCount: 0,
            },
            async () => {
              await this.getDashBoard()
            }
          )
        }
      } else {
        this.setState(
          { filters: { ...filters, [name]: value }, skipCount: 0 },
          async () => {
            await this.getDashBoard()
          }
        )
      }
    }
  }
  changeTab = (tabKey) => {
    this.setState({ tabActiveKey: tabKey })
  }
  handleDownloadPdfs = async (type) => {
    await this.setState({ isConvertting: true })
    const element = this.printRef.current
    await handleDownloadPdf(element, type, "TaskDashboard.pdf").finally(() => {
      this.setState({ isConvertting: false })
    })
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
              format={dateFormat}
              value={[
                moment(this.state.filters.fromDate),
                moment(this.state.filters.toDate),
              ]}
              placeholder={["From", "To"]}
              onChange={(value) => this.handleSearch("dateFromTo", value)}
            />
          </Col>

          <Col sm={{ span: 17, offset: 0 }} style={{ textAlign: "right" }}>
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
              documentTitle={L("TASK_REPORT")}
              pageStyle="@page { size:  19.8in 14in  }"
              removeAfterPrint
              content={() => this.printRef.current}
            />
          </Col>
        </Row>

        <Spin spinning={this.props.dashboardStore.isLoading}>
          <div ref={this.printRef} className="dashboard-style">
            <Row gutter={[8, 8]}>
              <Col sm={{ span: 5, offset: 0 }}>
                <ChartCircleActivity
                  data={this.state.dataCircleActivetatusGroup}
                />
              </Col>
              <Col sm={{ span: 19, offset: 0 }}>
                <ChartBarActivityStaff
                  data={this.state.dataBarActivityStatusGroup}
                  listColor={this.state.dataCircleActivetatusGroup}
                />
              </Col>
              <Col sm={{ span: 5, offset: 0 }}>
                <ChartCircleTask data={this.state.dataCircleTaskStatusGroup} />
              </Col>
              <Col sm={{ span: 19, offset: 0 }}>
                <ChartBarTaskStaff
                  data={this.state.dataBarTaskStatusGroup}
                  listColor={this.state.dataCircleTaskStatusGroup}
                />
              </Col>
              <Col sm={{ span: 24, offset: 0 }}>
                <Divider
                  orientation="left"
                  orientationMargin="0"
                  style={{ fontWeight: 600 }}
                ></Divider>
                <Card className="card-report-fit-height w-100">
                  <strong>{L("OCCUPANCY_REPORT_BY_UNIT_TYPE")}</strong>
                  <div className="content-right">
                    <Button
                      onClick={() => tableToExcel("tblTaskReport")}
                      className="button-primary"
                      icon={<ExcelIcon />}
                    ></Button>
                  </div>
                  <Table
                    id={"tblTaskReport"}
                    size="middle"
                    className="custom-ant-row"
                    scroll={{ y: this.state.isConvertting ? undefined : 590 }}
                    pagination={false}
                    columns={columns}
                    dataSource={this.state.dataShow}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </Spin>
      </>
    )
  }
}

export default withRouter(TasksReport)
