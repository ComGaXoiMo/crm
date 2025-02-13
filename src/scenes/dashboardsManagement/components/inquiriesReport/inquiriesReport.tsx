import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import {
  Row,
  Col,
  Table,
  Button,
  Select,
  DatePicker,
  Tag,
  Tooltip,
  Spin,
  Card,
} from "antd"

import CountOfInquiryNameByStateAndSubStage from "./components/CountOfInquiryNameByStateAndSubStage"
import {
  convertFilterDate,
  filterOptions,
  handleDownloadPdf,
  renderDate,
  renderOptions,
  tableToExcel,
} from "@lib/helper"
import { L } from "@lib/abpUtility"
import withRouter from "@components/Layout/Router/withRouter"
import Stores from "@stores/storeIdentifier"
import AppConsts, { dateFormat } from "@lib/appconst"
import { FilePdfOutlined } from "@ant-design/icons"
import DashboardStore from "@stores/dashboardStore"
import moment from "moment"
import InquiryStatusByMonthChart from "./components/InquiryStatusByMonthChart"
import { debounce } from "lodash"
import userService from "@services/administrator/user/userService"
import ReactToPrint from "react-to-print"
import { ExcelIcon } from "@components/Icon"
const { align, itemDashboard, reportType } = AppConsts
const { RangePicker } = DatePicker
export interface IInquiriesReportProps {
  selectItem: any
  dashboardStore: DashboardStore
}

@inject(Stores.DashboardStore)
@observer
class InquiriesReport extends AppComponentListBase<IInquiriesReportProps> {
  printRef: any = React.createRef()
  state = {
    filters: {
      reportType: "year",
      fromDate: moment().startOf("year").toJSON(),
      toDate: moment().toJSON(),
    },
    dataBarCharInquiryStatus: [] as any,
    dataBarCharInquiryMonth: [] as any,
    listStageColor: [] as any,
    listStatusColor: [] as any,
    isConvertting: false,
    listUser: [] as any,
    dataShow: [] as any,
  }
  componentDidMount() {
    this.getDashBoard()
    this.getStaff("")
  }
  componentDidUpdate(prevProps) {
    if (prevProps.selectItem !== this.props.selectItem) {
      if (this.props.selectItem === itemDashboard.inquiry) {
        this.getDashBoard()

        this.getStaff("")
      }
    }
  }
  getDashBoard = async () => {
    await this.props.dashboardStore
      .getDashboardInquiry({
        ...this.state.filters,
      })
      .finally(() => {
        this.setState({
          dataShow: this.props.dashboardStore.dashboardInquiryData,
        })
        this.groupData(this.props.dashboardStore.dashboardInquiryData)
        this.groupByMonth(this.props.dashboardStore.dashboardInquiryData)
      })
  }

  groupData = (listData) => {
    const groupedData = {}
    listData.forEach((inquiry) => {
      const key = inquiry.DetailStatus + inquiry.StageColor
      if (!groupedData[key]) {
        groupedData[key] = {
          Status: inquiry.DetailStatus,
          StageColor: inquiry.StageColor,
          Count: 0,
        }
      }

      groupedData[key].Count++
    })
    const outputInquiryArray = Object.values(groupedData)
    this.setState({ listStageColor: outputInquiryArray })

    const inquiryStatusMap = {}

    listData.forEach((item) => {
      const inquiry = item.InquiryStatus
      const status = item.DetailStatus

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
      statusCount["InquiryStatus"] = inquiry
      return statusCount
    })

    this.setState({ dataBarCharInquiryStatus: dataBarCharInquiry })
  }

  groupByMonth = (listData) => {
    const groupedData = {}
    listData.forEach((inquiry) => {
      const key = inquiry.Month + inquiry.StatusColor + inquiry.Year
      if (!groupedData[key]) {
        groupedData[key] = {
          Status: inquiry.InquiryStatus,
          StatusColor: inquiry.StatusColor,
          Count: 0,
        }
      }

      groupedData[key].Count++
    })
    const outputInquiryArray = Object.values(groupedData)

    this.setState({ listStatusColor: outputInquiryArray })

    const inquiryStatusMap = {}

    listData.forEach((item) => {
      const inquiry = item.Month
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
      statusCount["Month"] = inquiry
      return statusCount
    })
    this.setState({ dataBarCharInquiryMonth: dataBarCharInquiry })
  }

  handleDownloadPdfs = async (type) => {
    await this.setState({ isConvertting: true })
    const element = this.printRef.current
    await handleDownloadPdf(element, type, "InquiryDashboard.pdf").finally(
      () => {
        this.setState({ isConvertting: false })
      }
    )
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
            },
            async () => {
              await this.getDashBoard()
            }
          )
        }
      } else {
        this.filterDataClient(
          this.props.dashboardStore.dashboardInquiryData,
          name,
          value
        )
      }
    }
  }
  filterDataClient = (listData, nameSearch, valueSeach) => {
    const { filters } = this.state
    if (nameSearch === "projectId") {
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
        const dataFilter = listData.filter(
          (item) => item.CompanyId === valueSeach
        )
        this.setState({ dataShow: dataFilter })

        this.groupData(dataFilter)
        this.groupByMonth(dataFilter)
      }
    }
    if (nameSearch === "userIds") {
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
        const dataFilter = listData.filter(
          (item) => item.StaffId === valueSeach
        )
        this.setState({ dataShow: dataFilter })

        this.groupData(dataFilter)
        this.groupByMonth(dataFilter)
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
              defaultValue={this.state.filters.reportType}
              style={{ width: "100%" }}
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

          <Col sm={{ span: 5, offset: 0 }}>
            <Select
              getPopupContainer={(trigger) => trigger.parentNode}
              placeholder={L("STAFF")}
              style={{ width: "100%" }}
              allowClear
              showSearch
              filterOption={filterOptions}
              showArrow
              onChange={(value) => this.handleSearch("userIds", value)}
              onSearch={debounce((e) => this.getStaff(e), 1000)}
            >
              {renderOptions(this.state.listUser)}
            </Select>
          </Col>
          <Col sm={{ span: 4, offset: 0 }} />
          <Col sm={{ span: 8, offset: 0 }} style={{ textAlign: "right" }}>
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
              documentTitle={L("INQUIRY_REPORT")}
              pageStyle="@page { size:  19.8in 14in  }"
              removeAfterPrint
              content={() => this.printRef.current}
            />
          </Col>
        </Row>
        <Spin spinning={this.props.dashboardStore.isLoading}>
          <div ref={this.printRef} className="dashboard-style">
            <Row gutter={[8, 16]}>
              <Col sm={{ span: 12, offset: 0 }}>
                <CountOfInquiryNameByStateAndSubStage
                  listColor={this.state.listStageColor}
                  data={this.state.dataBarCharInquiryStatus}
                />
              </Col>
              <Col sm={{ span: 12, offset: 0 }}>
                <InquiryStatusByMonthChart
                  listColor={this.state.listStatusColor}
                  data={this.state.dataBarCharInquiryMonth}
                />
              </Col>
              <Col sm={{ span: 24, offset: 0 }}>
                <Card className="card-report-fit-height w-100">
                  <div className="content-right">
                    <Button
                      onClick={() => tableToExcel("tblInquiryReport")}
                      className="button-primary"
                      icon={<ExcelIcon />}
                    ></Button>
                  </div>

                  <Table
                    id={"tblInquiryReport"}
                    size="middle"
                    scroll={{ y: this.state.isConvertting ? undefined : 500 }}
                    className="custom-ant-row"
                    pagination={false}
                    columns={columns}
                    bordered
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

export default withRouter(InquiriesReport)

const columns = [
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
    align: align.left,
    ellipsis: true,
    render: (InquiryStatus, row) => <>{InquiryStatus}</>,
  },
  {
    title: L("DETAIL_STATUS"),
    dataIndex: "DetailStatus",
    width: "10%",
    ellipsis: true,
    render: (DetailStatus, row) => <>{DetailStatus}</>,
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
    title: L("OCCUPIER"),
    dataIndex: "OccupierName",
    width: "10%",
    ellipsis: true,
    render: (OccupierName) => <>{OccupierName}</>,
  },

  {
    title: L("INQUIRY_PROPERTY_TYPE"),
    dataIndex: "ProductTypes",
    width: "15%",
    ellipsis: false,
    render: (ProductTypes, row) => (
      <>
        {JSON.parse(ProductTypes)?.map((item, index) => (
          <Tag key={index}>{item?.ProductType}</Tag>
        ))}
      </>
    ),
  },

  {
    title: L("INQUIRY_UNIT_TYPE"),
    dataIndex: "UnitTypes",
    width: "10%",
    ellipsis: false,
    render: (UnitTypes, row) => (
      <>
        {JSON.parse(UnitTypes)?.map((item, index) => (
          <Tag key={index}>{item?.UnitType}</Tag>
        ))}
      </>
    ),
  },
  {
    title: L("EST_MOVE_IN_DATE"),
    dataIndex: "EstMovinDate",
    width: "10%",
    ellipsis: true,
    render: renderDate,
  },

  {
    title: L("DESCRIPTION"),
    dataIndex: "Description",
    width: "10%",
    ellipsis: true,
    render: (Description) => Description,
  },
]
