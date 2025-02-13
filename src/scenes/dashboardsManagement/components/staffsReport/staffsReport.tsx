import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import {
  Row,
  Col,
  Table,
  Card,
  Button,
  Select,
  DatePicker,
  Tooltip,
  Spin,
} from "antd"

import ChartBarActivityStaff from "./components/ChartBarActivityStaff"
import CountOfInquiryNameByTaskPICAndStaff from "../inquiriesReport/components/CountOfInquiryNameByTaskPICAndStaff"
import AppConsts, { dateFormat } from "@lib/appconst"
import {
  convertFilterDate,
  formatNumber,
  handleDownloadPdf,
  renderDate,
  renderDateTime,
  renderOptions,
  tableToExcel,
} from "@lib/helper"
import { L } from "@lib/abpUtility"
import CountReferalNumberByDealerChart from "../leaseAgreementReport/components/CountReferalNumberByDealerChart"
import { FilePdfOutlined } from "@ant-design/icons"
import withRouter from "@components/Layout/Router/withRouter"
import DashboardStore from "@stores/dashboardStore"
import Stores from "@stores/storeIdentifier"
import moment from "moment"
import ChartBarTaskStaff from "./components/ChartBarTaskStaff"
import userService from "@services/administrator/user/userService"
import { debounce } from "lodash"
import RevenueBarStaff from "../leaseAgreementReport/components/RevenueBarStaff"
import IntensiveBarStaff from "../leaseAgreementReport/components/IntensiveBarStaff"
import ReactToPrint from "react-to-print"
import { ExcelIcon } from "@components/Icon"
const { align, itemDashboard, reportType } = AppConsts
const { RangePicker } = DatePicker

export interface IStaffsReportProps {
  selectItem: any
  dashboardStore: DashboardStore
}

@inject(Stores.DashboardStore)
@observer
class StaffsReport extends AppComponentListBase<IStaffsReportProps> {
  printRef: any = React.createRef()
  state = {
    filters: {
      reportType: "year",
      fromDate: moment().startOf("year").toJSON(),
      toDate: moment().toJSON(),
    },
    dataCircleTaskStatusGroup: [] as any,
    dataBarTaskStatusGroup: [] as any,
    dataCircleActivetatusGroup: [] as any,
    dataBarActivityStatusGroup: [] as any,
    listColorInquiryGroup: [] as any,
    dataBarInquiryStatusGroup: [] as any,
    dataLAByStaff: [] as any,
    dataCircleRevenue: [] as any,
    dataCircleNumber: [] as any,
    isConvertting: false,
    listUser: [] as any,
    dataBarCharRevenueStaff: [] as any,
    dataBarCharIntensiveStaff: [] as any,

    dataTableTask: [] as any,
    dataTableInquiry: [] as any,
    dataTableLA: [] as any,
    dataTableIntensive: [] as any,
  }
  componentDidMount() {
    this.getDashBoard()
    this.getStaff("")
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectItem !== this.props.selectItem) {
      if (this.props.selectItem === itemDashboard.staff) {
        this.getDashBoard()
        this.getStaff("")
      }
    }
  }
  getStaff = async (keyword) => {
    const res = await userService.getAll({
      maxResultCount: 10,
      skipCount: 0,
      keyword: keyword,
    })
    const lsitUser = [...res.items]

    lsitUser.map((i) => {
      return { id: i.id, name: i.name }
    })
    this.setState({ listUser: lsitUser })
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
        this.filterDataClient(name, value)
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
      }),
      this.props.dashboardStore
        .getDashboardActivity({
          ...this.state.filters,
        })
        .finally(() => {
          this.groupActivityData(
            this.props.dashboardStore.dashboardActivityData
          )
        }),
      this.props.dashboardStore
        .getDashboardInquiry({
          ...this.state.filters,
        })
        .finally(() => {
          this.groupStaffInInquiry(
            this.props.dashboardStore.dashboardInquiryData
          )
        }),
      this.props.dashboardStore
        .getDashboarRevenueStaff({
          ...this.state.filters,
        })
        .finally(() => {
          this.groupNumOfLAData(
            this.props.dashboardStore.dashboardReportRevenueStaff
          )
          this.groupRevenueStaff(
            this.props.dashboardStore.dashboardReportRevenueStaff
          )
        }),
      this.props.dashboardStore
        .getDashboarReportIntensiveStaff({
          ...this.state.filters,
        })
        .finally(() => {
          this.groupIntensiveStaff(
            this.props.dashboardStore.dashboardReportIntensiveStaff
          )
        })
  }

  groupTaskData = (listData) => {
    this.setState({
      dataTableTask: listData,
    })
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
  groupStaffInInquiry = (listData) => {
    this.setState({ dataTableInquiry: listData })
    const groupedData = {}
    listData.forEach((inquiry) => {
      const key = inquiry.InquiryStatusId + inquiry.StatusColor
      if (!groupedData[key]) {
        groupedData[key] = {
          InquiryStatus: inquiry.InquiryStatus,
          StatusColor: inquiry.StatusColor,
          Count: 0,
        }
      }

      groupedData[key].Count++
    })
    const outputInquiryArray = Object.values(groupedData)

    this.setState({ listColorInquiryGroup: outputInquiryArray })

    const inquiryStatusMap = {}

    listData.forEach((item) => {
      const inquiry = item.Staff
      const status = item.InquiryStatus

      if (!inquiryStatusMap[inquiry]) {
        inquiryStatusMap[inquiry] = {}
      }

      if (!inquiryStatusMap[inquiry][status]) {
        inquiryStatusMap[inquiry][status] = 0
      }
      inquiryStatusMap[inquiry][status]++
    })

    const dataBarCharInquiry = Object.keys(inquiryStatusMap).map((inquiry) => {
      const statusCount = inquiryStatusMap[inquiry]
      statusCount["Staff"] = inquiry
      return statusCount
    })
    this.setState({ dataBarInquiryStatusGroup: dataBarCharInquiry })
  }
  groupNumOfLAData = (listData) => {
    this.setState({ dataTableLA: listData })
    const groupedData = {}
    listData.forEach((item) => {
      const key = item.Dealer
      if (!groupedData[key]) {
        groupedData[key] = {
          Dealer: item.Dealer,
          Color: "#" + Math.floor(Math.random() * 16777215).toString(16),
          Count: 0,
        }
      }

      groupedData[key].Count++
    })

    const outputArray = Object.values(groupedData)
    this.setState({ dataLAByStaff: outputArray })
  }
  groupRevenueStaff = (listData) => {
    const groupedData = {}
    listData.forEach((item) => {
      const key = item.DealerId
      if (!groupedData[key]) {
        groupedData[key] = {
          Dealer: item.Dealer,
          Color: "#" + Math.floor(Math.random() * 16777215).toString(16),
          RentIncVATAmount: 0,
        }
      }

      groupedData[key].RentIncVATAmount += item.RentIncVATAmount
    })

    const outputArray = Object.values(groupedData)

    this.setState({ dataBarCharRevenueStaff: outputArray })
  }

  groupIntensiveStaff = (listData) => {
    this.setState({ dataTableIntensive: listData })
    const groupedData = {}
    listData.forEach((item) => {
      const key = item.DealerId
      if (!groupedData[key]) {
        groupedData[key] = {
          Dealer: item.Dealer,
          Color: "#" + Math.floor(Math.random() * 16777215).toString(16),
          CommissionAmount: 0,
        }
      }

      groupedData[key].CommissionAmount += item.CommissionAmount
    })

    const outputArray = Object.values(groupedData)

    this.setState({ dataBarCharIntensiveStaff: outputArray })
  }

  filterDataClient = (nameSearch, valueSeach) => {
    const { filters } = this.state
    if (nameSearch === "userId") {
      if (valueSeach === null || valueSeach === undefined) {
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
        const dataTableTaskNew =
          this.props.dashboardStore.dashboardTaskData.filter(
            (item) => item.UserId === valueSeach
          )
        this.groupTaskData(dataTableTaskNew)

        const dashboardActivityData =
          this.props.dashboardStore.dashboardActivityData.filter(
            (item) => item.UserId === valueSeach
          )
        this.groupActivityData(dashboardActivityData)

        const dataTableInquiryNew =
          this.props.dashboardStore.dashboardInquiryData.filter(
            (item) => item.StaffId === valueSeach
          )
        this.groupStaffInInquiry(dataTableInquiryNew)

        const dataTableLANew =
          this.props.dashboardStore.dashboardReportRevenueStaff.filter(
            (item) => item.DealerId === valueSeach
          )
        this.groupNumOfLAData(dataTableLANew)
        this.groupRevenueStaff(dataTableLANew)
        const dataTableIntensiveNew =
          this.props.dashboardStore.dashboardReportIntensiveStaff.filter(
            (item) => item.DealerId === valueSeach
          )
        this.groupIntensiveStaff(dataTableIntensiveNew)
      }
    }
  }

  changeTab = (tabKey) => {
    this.setState({ tabActiveKey: tabKey })
  }
  handleDownloadPdfs = async (type) => {
    await this.setState({ isConvertting: true })
    const element = this.printRef.current
    await handleDownloadPdf(element, type, "StaffDashboard.pdf").finally(() => {
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
          <Col sm={{ span: 3, offset: 0 }}>
            <Select
              getPopupContainer={(trigger) => trigger.parentNode}
              placeholder={L("STAFF")}
              style={{ width: "100%" }}
              allowClear
              showArrow
              onChange={(value) => this.handleSearch("userId", value)}
              onSearch={debounce((e) => this.getStaff(e), 1000)}
            >
              {renderOptions(this.state.listUser)}
            </Select>
          </Col>

          <Col sm={{ span: 14, offset: 0 }} style={{ textAlign: "right" }}>
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
              documentTitle={L("STAFF_REPORT")}
              pageStyle="@page { size:  19.8in 14in  }"
              removeAfterPrint
              content={() => this.printRef.current}
            />
          </Col>
        </Row>
        <Spin spinning={this.props.dashboardStore.isLoading}>
          <div ref={this.printRef} className="dashboard-style">
            <Row gutter={[16, 8]}>
              <Card className="card-report">
                <Row gutter={[8, 16]}>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <ChartBarActivityStaff
                      data={this.state.dataBarActivityStatusGroup}
                      listColor={this.state.dataCircleActivetatusGroup}
                    />
                    <div style={{ height: 10 }}></div>
                    <ChartBarTaskStaff
                      data={this.state.dataBarTaskStatusGroup}
                      listColor={this.state.dataCircleTaskStatusGroup}
                    />
                  </Col>

                  <Col sm={{ span: 16, offset: 0 }}>
                    <div className="content-right">
                      <Button
                        onClick={() => tableToExcel("tblTaskInStaffReport")}
                        className="button-primary"
                        icon={<ExcelIcon />}
                      ></Button>
                    </div>
                    <Table
                      id={"tblTaskInStaffReport"}
                      style={{ width: "80vw" }}
                      size="middle"
                      className="custom-ant-row"
                      scroll={{ y: this.state.isConvertting ? undefined : 320 }}
                      pagination={false}
                      columns={columnsTask}
                      dataSource={this.state.dataTableTask}
                    />
                  </Col>
                </Row>
              </Card>
              <Card className="card-report">
                <Row gutter={[16, 16]}>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <CountOfInquiryNameByTaskPICAndStaff
                      data={this.state.dataBarInquiryStatusGroup}
                      listColor={this.state.listColorInquiryGroup}
                      height={210}
                    />
                  </Col>
                  <Col sm={{ span: 16, offset: 0 }}>
                    <div className="content-right">
                      <Button
                        onClick={() => tableToExcel("tblInquiryInStaffReport")}
                        className="button-primary"
                        icon={<ExcelIcon />}
                      ></Button>
                    </div>
                    <Table
                      id={"tblInquiryInStaffReport"}
                      style={{ width: "80vw" }}
                      size="middle"
                      scroll={{ y: this.state.isConvertting ? undefined : 230 }}
                      className="custom-ant-row"
                      pagination={false}
                      columns={columnInquiry}
                      dataSource={this.state.dataTableInquiry}
                    />
                  </Col>
                </Row>
              </Card>
              <Card className="card-report">
                <Row gutter={[16, 16]}>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <CountReferalNumberByDealerChart
                      data={this.state.dataLAByStaff}
                      height={210}
                    />
                    <RevenueBarStaff
                      data={this.state.dataBarCharRevenueStaff}
                      height={220}
                    />
                  </Col>
                  <Col sm={{ span: 16, offset: 0 }}>
                    <div className="content-right">
                      <Button
                        onClick={() => tableToExcel("tblLaInStaffReport")}
                        className="button-primary"
                        icon={<ExcelIcon />}
                      ></Button>
                    </div>
                    <Table
                      id={"tblLaInStaffReport"}
                      style={{ width: "80vw" }}
                      size="middle"
                      scroll={{ y: this.state.isConvertting ? undefined : 460 }}
                      className="custom-ant-row"
                      pagination={false}
                      columns={columns3}
                      dataSource={this.state.dataTableLA}
                    />
                  </Col>
                </Row>
              </Card>
              <Card className="card-report">
                <Row gutter={[16, 16]}>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <IntensiveBarStaff
                      data={this.state.dataBarCharIntensiveStaff}
                      height={210}
                    />
                  </Col>
                  <Col sm={{ span: 16, offset: 0 }}>
                    <div className="content-right">
                      <Button
                        onClick={() => tableToExcel("tblStaffReport")}
                        className="button-primary"
                        icon={<ExcelIcon />}
                      ></Button>
                    </div>
                    <Table
                      id="tblStaffReport"
                      size="middle"
                      className="custom-ant-row"
                      scroll={{ y: this.state.isConvertting ? undefined : 230 }}
                      pagination={false}
                      columns={columnsCustom}
                      dataSource={this.state.dataTableIntensive}
                    />
                  </Col>
                </Row>
              </Card>
            </Row>
          </div>
        </Spin>
      </>
    )
  }
}
export default withRouter(StaffsReport)

const columnsTask = [
  {
    title: L("TASK"),
    dataIndex: "TaskName",
    key: "TaskName",
    ellipsis: true,
    width: "20%",
    render: (TaskName) => <>{TaskName}</>,
  },
  {
    title: L("TASK_STATUS"),
    dataIndex: "Status",
    key: "Status",
    ellipsis: false,
    width: "15%",
    render: (Status) => <>{Status}</>,
  },
  {
    title: L("RELATED_TO"),
    dataIndex: "RelatedTo",
    key: "RelatedTo",
    ellipsis: false,
    width: "30%",
    render: (RelatedTo) => <>{RelatedTo}</>,
  },
  {
    title: L("STAFF"),
    dataIndex: "Staff",
    ellipsis: false,
    key: "Staff",
    width: "20%",
    render: (Staff) => <>{Staff}</>,
  },
  {
    title: L("CREATE_AT"),
    dataIndex: "CreateAt",
    ellipsis: false,
    key: "CreateAt",
    align: align.center,
    render: renderDate,
  },
]
const columnInquiry = [
  {
    title: L("INQUIRY_NAME"),
    dataIndex: "InquiryName",
    width: "15%",
    ellipsis: true,
    render: (InquiryName) => <>{InquiryName}</>,
  },
  {
    title: L("INQUIRY_STATUS"),
    dataIndex: "InquiryStatus",
    width: "10%",
    align: align.center,
    ellipsis: true,
    render: (InquiryStatus, row) => <>{InquiryStatus}</>,
  },

  {
    title: L("STAFF"),
    dataIndex: "Staff",
    width: "10%",
    ellipsis: true,
    render: (Staff, row) => <>{Staff}</>,
  },
  {
    title: L("INQUIRY_CONTACT"),
    dataIndex: "ContactName",
    width: "10%",
    ellipsis: true,
    render: (ContactName) => <>{ContactName}</>,
  },
  {
    title: L("COMPANY"),
    dataIndex: "CompanyName",
    width: "10%",
    ellipsis: true,
    render: (CompanyName) => <>{CompanyName}</>,
  },

  {
    title: L("DESCRIPTION"),
    dataIndex: "Description",
    width: "10%",
    ellipsis: true,
    render: (Description) => Description,
  },
]
const columns3 = [
  {
    title: L("REFERENCE_NUMBER"),
    ellipsis: false,
    dataIndex: "ReferenceNumber",
    key: "ReferenceNumber",
    width: 200,
    render: (ReferenceNumber) => <>{ReferenceNumber}</>,
  },

  {
    title: L("UNIT"),
    ellipsis: false,
    dataIndex: "UnitName",
    key: "UnitName",
    width: 140,
    render: (UnitName, row) => (
      <>
        {row?.ProjectCode} - {UnitName}
      </>
    ),
  },
  {
    title: L("STATUS"),
    ellipsis: false,
    dataIndex: "Status",
    key: "Status",
    align: align.left,
    width: 100,
    render: (Status) => <>{Status}</>,
  },

  {
    title: L("DEALER"),
    dataIndex: "Dealer",
    ellipsis: false,
    key: "Dealer",
    align: align.left,
    width: 170,
    render: (Dealer) => <>{Dealer}</>,
  },

  {
    title: L("RENT_ONLY"),
    dataIndex: "OnlyRent",
    ellipsis: false,
    key: "OnlyRent",
    align: align.right,
    width: 170,
    render: (OnlyRent) => <>{formatNumber(OnlyRent)}</>,
  },

  {
    title: L("RENT_VAT"),
    dataIndex: "RentVATAmount",
    key: "RentVATAmount",
    ellipsis: false,
    align: align.right,
    width: 170,
    render: (RentVATAmount) => <>{formatNumber(RentVATAmount)}</>,
  },

  {
    title: L("CREATE_AT"),
    dataIndex: "CreationTime",
    ellipsis: false,
    key: "CreationTime",
    align: align.center,
    width: 170,
    render: (CreationTime) => <>{renderDateTime(CreationTime)}</>,
  },
]
const columnsCustom = [
  {
    title: L("STAFF"),
    dataIndex: "Dealer",
    key: "Dealer",
    width: "15%",
    render: (Dealer) => <>{Dealer}</>,
  },
  {
    title: L("MONTH"),
    dataIndex: "Month",
    key: "Month",
    align: align.center,
    width: "15%",
    render: (Month, row) => (
      <>
        {Month}/{row?.Year}
      </>
    ),
  },
  {
    title: L("COMMISSION_AMOUNT"),
    dataIndex: "CommissionAmount",
    align: align.right,
    key: "CommissionAmount",
    width: "15%",
    render: (CommissionAmount) => <>{formatNumber(CommissionAmount)}</>,
  },
]
