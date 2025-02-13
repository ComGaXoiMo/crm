import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Row, Col, Table, Button, DatePicker, Spin, Card, Select } from "antd"
import {
  convertFilterDate,
  handleDownloadPdf,
  renderOptions,
  tableToExcel,
} from "@lib/helper"
import AppConsts, { dateFormat } from "@lib/appconst"
import withRouter from "@components/Layout/Router/withRouter"
import DashboardStore from "@stores/dashboardStore"
import Stores from "@stores/storeIdentifier"
import moment from "moment"
import { ExcelIcon } from "@components/Icon"
import LAreportColumns from "../LAreportColumns"
import { L } from "@lib/abpUtility"
import projectService from "@services/projects/projectService"
import { debounce } from "lodash"

const { itemDashboard } = AppConsts

const { RangePicker } = DatePicker
export interface ILeaseAgreementReportProps {
  selectItem: any
  dashboardStore: DashboardStore
}

@inject(Stores.DashboardStore)
@observer
class MoveInReportTable extends AppComponentListBase<ILeaseAgreementReportProps> {
  printRef: any = React.createRef()
  state = {
    isConvertting: false,
    filters: {
      reportType: "year",
      projectId: undefined,
      keyword: "",
      fromDate: moment().startOf("year").toJSON(),
      toDate: moment().toJSON(),
    },
    dataTableMoveIn: [] as any,
    dataTableMoveOut: [] as any,
    listProject: [] as any,
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
  componentDidUpdate(prevProps) {
    if (prevProps.selectItem !== this.props.selectItem) {
      if (this.props.selectItem === itemDashboard.LA) {
        this.getDashBoard()
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
      this.props.dashboardStore.getDashboardRevenueStaffMoveIn({
        ...this.state.filters,
      }),
      this.props.dashboardStore.getDashboardRevenueStaffMoveOut({
        ...this.state.filters,
      }),
    ]).then(async () => {
      this.setState({
        dataTableMoveIn: this.state.filters.projectId
          ? this.props.dashboardStore.dashboardReportRevenueStaffMoveIn.filter(
              (item) => item.ProjectId === this.state.filters.projectId
            )
          : this.props.dashboardStore.dashboardReportRevenueStaffMoveIn,
        dataTableMoveOut: this.state.filters.projectId
          ? this.props.dashboardStore.dashboardReportRevenueStaffMoveOut.filter(
              (item) => item.ProjectId === this.state.filters.projectId
            )
          : this.props.dashboardStore.dashboardReportRevenueStaffMoveOut,
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
      if (name === "projectId") {
        this.setState({
          filters: {
            ...filters,
            projectId: value,
          },
        })
        if (value) {
          this.setState({
            dataTableMoveIn:
              this.props.dashboardStore.dashboardReportRevenueStaffMoveIn.filter(
                (item) => item.ProjectId === value
              ),
            dataTableMoveOut:
              this.props.dashboardStore.dashboardReportRevenueStaffMoveOut.filter(
                (item) => item.ProjectId === value
              ),
          })
        } else {
          this.setState({
            dataTableMoveIn:
              this.props.dashboardStore.dashboardReportRevenueStaffMoveIn,
            dataTableMoveOut:
              this.props.dashboardStore.dashboardReportRevenueStaffMoveOut,
          })
        }
      }
    }
  }

  public render() {
    const columns = LAreportColumns()
    return (
      <>
        <Spin spinning={this.props.dashboardStore.isLoading}>
          <div ref={this.printRef} className="dashboard-style">
            <Row gutter={[4, 4]}>
              <Col sm={{ span: 24, offset: 0 }}></Col>
              <Col sm={{ span: 24, offset: 0 }} style={{ marginBottom: 5 }}>
                <Card className="card-report-fit-height w-100">
                  <Row gutter={[4, 4]}>
                    <Col sm={{ span: 5, offset: 0 }}>
                      <RangePicker
                        clearIcon={false}
                        format={dateFormat}
                        value={[
                          moment(this.state.filters.fromDate),
                          moment(this.state.filters.toDate),
                        ]}
                        placeholder={["From", "To"]}
                        className="full-width"
                        onChange={(value) =>
                          this.handleSearch("dateFromTo", value)
                        }
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
                        onChange={(value) =>
                          this.handleSearch("projectId", value)
                        }
                        onSearch={debounce((e) => this.getProject(e), 300)}
                      >
                        {renderOptions(this.state.listProject)}
                      </Select>
                    </Col>
                  </Row>
                  <div className="header-report pl-2 pt-3">
                    <span className="card-overview-title">
                      {L("LA_REPORT_MOVE_IN")}
                    </span>
                    <div className="content-right">
                      <Button
                        onClick={() => tableToExcel("tblLaReportMoveIn")}
                        className="button-primary"
                        icon={<ExcelIcon />}
                      ></Button>
                    </div>
                  </div>
                  <Table
                    id={"tblLaReportMoveIn"}
                    className="custom-ant-row"
                    scroll={{ y: this.state.isConvertting ? undefined : 590 }}
                    pagination={false}
                    size="middle"
                    bordered
                    columns={columns}
                    dataSource={this.state.dataTableMoveIn}
                  />
                  <div className="header-report pl-2 pt-3">
                    <span className="card-overview-title">
                      {L("LA_REPORT_MOVE_OUT")}
                    </span>
                    <div className="content-right">
                      <Button
                        onClick={() => tableToExcel("tblLaReportMoveOut")}
                        className="button-primary"
                        icon={<ExcelIcon />}
                      ></Button>
                    </div>
                  </div>
                  <Table
                    id={"tblLaReportMoveOut"}
                    className="custom-ant-row"
                    scroll={{ y: this.state.isConvertting ? undefined : 590 }}
                    pagination={false}
                    size="middle"
                    bordered
                    columns={columns}
                    dataSource={this.state.dataTableMoveOut}
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

export default withRouter(MoveInReportTable)
