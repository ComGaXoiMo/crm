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
  Divider,
  Tooltip,
  Spin,
  Card,
} from "antd"
import {
  convertFilterDate,
  handleDownloadPdf,
  renderOptions,
  tableToExcel,
} from "@lib/helper"
import AppConsts, { dateFormat } from "@lib/appconst"
import { L } from "@lib/abpUtility"
import CountOfUnitByExpiryDay from "./components/CountOfUnitByExpiryDay"
import CountOfUnitByContractStatus from "./components/CountOfUnitByContractStatus"
import { debounce } from "lodash"
import { FilePdfOutlined } from "@ant-design/icons"
import withRouter from "@components/Layout/Router/withRouter"
import DashboardStore from "@stores/dashboardStore"
import Stores from "@stores/storeIdentifier"
import moment from "moment"
import projectService from "@services/projects/projectService"
import ReactToPrint from "react-to-print"
import { ExcelIcon } from "@components/Icon"
import LAreportColumns from "./components/LAreportColumns"
import MoveInReportTable from "./components/moveInMoveOut/MoveInReportTable"

const { itemDashboard, reportType } = AppConsts

const { RangePicker } = DatePicker
export interface ILeaseAgreementReportProps {
  selectItem: any
  dashboardStore: DashboardStore
}

@inject(Stores.DashboardStore)
@observer
class LeaseAgreementReport extends AppComponentListBase<ILeaseAgreementReportProps> {
  printRef: any = React.createRef()
  state = {
    isConvertting: false,
    filters: {
      reportType: "year",
      keyword: "",
      projectId: undefined,
      fromDate: moment().startOf("year").toJSON(),
      toDate: moment().toJSON(),
    },
    listProject: [] as any,
    listUser: [] as any,
    dataShow: [] as any,
    dataProjectLAstage: [] as any,
    dataExpiryDate: [] as any,
    dataTableLA: [] as any,

    dataChartLAOverView: [] as any,
  }

  handleDownloadPdfs = async (type) => {
    await this.setState({ isConvertting: true })
    const element = this.printRef.current
    await handleDownloadPdf(element, type, "LADashboard.pdf").finally(() => {
      this.setState({ isConvertting: false })
    })
  }
  componentDidMount() {
    this.getDashBoard()
    this.getProject("")
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selectItem !== this.props.selectItem) {
      if (this.props.selectItem === itemDashboard.LA) {
        this.getDashBoard()
      }
    }
    // if (prevState.dataTableLA !== this.state.dataTableLA) {
    //   console.log(this.state.dataTableLA)
    // }
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
      this.props.dashboardStore.getDashboarReportLAStatus({
        ...this.state.filters,
      }),
      this.props.dashboardStore.getDashboarRevenueStaff({
        ...this.state.filters,
      }),
    ]).then(async () => {
      this.setState({
        dataChartLAOverView: this.props.dashboardStore.dashboardReportLAStatus,
      })

      this.setState({
        dataExpiryDate: this.props.dashboardStore.dashboardReportLAExpired,
      })

      this.setState({
        dataTableLA: this.state.filters.projectId
          ? this.props.dashboardStore.dashboardReportRevenueStaff?.filter(
              (item) => item.ProjectId === this.state.filters.projectId
            )
          : this.props.dashboardStore.dashboardReportRevenueStaff,
      })
    })
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
      }
      if (name === "projectId") {
        this.setState({
          filters: {
            ...filters,
            projectId: value,
          },
        })
        if (value) {
          const dataLATable =
            this.props.dashboardStore.dashboardReportRevenueStaff?.filter(
              (item) => item.ProjectId === value
            )
          this.setState({
            dataTableLA: dataLATable,
          })
        } else {
          this.setState({
            dataTableLA: this.props.dashboardStore.dashboardReportRevenueStaff,
          })
        }
      }
    }
  }

  public render() {
    const columns = LAreportColumns()
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
              showArrow
              placeholder={L("PROJECT")}
              style={{ width: "100%" }}
              allowClear
              filterOption={false}
              showSearch
              onChange={(value) => this.handleSearch("projectId", value)}
              onSearch={debounce((e) => this.getProject(e), 300)}
            >
              {renderOptions(this.state.listProject)}
            </Select>
          </Col>
          <Col sm={{ span: 3, offset: 0 }}></Col>

          <Col sm={{ span: 11, offset: 0 }} style={{ textAlign: "right" }}>
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
              documentTitle={L("LEASE_AGREEMENT_REPORT")}
              pageStyle="@page { size:  19.8in 14in  }"
              removeAfterPrint
              content={() => this.printRef.current}
            />
          </Col>
        </Row>
        <Spin spinning={this.props.dashboardStore.isLoading}>
          <div ref={this.printRef} className="dashboard-style">
            <Row gutter={[4, 4]}>
              <Col sm={{ span: 12, offset: 0 }}>
                <CountOfUnitByExpiryDay data={this.state.dataExpiryDate} />
              </Col>
              <Col sm={{ span: 12, offset: 0 }}>
                <CountOfUnitByContractStatus
                  data={this.state.dataChartLAOverView}
                />
              </Col>

              <Divider
                orientation="left"
                orientationMargin="0"
                style={{ fontWeight: 600 }}
              >
                {L("LA_LIST")}
              </Divider>

              <Col sm={{ span: 24, offset: 0 }} style={{ marginBottom: 5 }}>
                <Card className="card-report-fit-height w-100">
                  <div className="content-right">
                    <Button
                      onClick={() => tableToExcel("tblLaReport")}
                      className="button-primary"
                      icon={<ExcelIcon />}
                    ></Button>
                  </div>
                  <Table
                    id={"tblLaReport"}
                    className="custom-ant-row"
                    scroll={{ y: this.state.isConvertting ? undefined : 590 }}
                    pagination={false}
                    size="middle"
                    bordered
                    columns={columns}
                    dataSource={this.state.dataTableLA}
                  />
                </Card>
              </Col>
              <Col sm={{ span: 24, offset: 0 }} style={{ marginBottom: 5 }}>
                <MoveInReportTable selectItem={this.props.selectItem} />
              </Col>
            </Row>
          </div>
        </Spin>
      </>
    )
  }
}

export default withRouter(LeaseAgreementReport)
