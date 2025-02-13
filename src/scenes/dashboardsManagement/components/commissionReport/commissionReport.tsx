import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import {
  Row,
  Col,
  Table,
  Button,
  Divider,
  DatePicker,
  Tooltip,
  Spin,
  Card,
} from "antd"

import { L } from "@lib/abpUtility"
import {
  handleDownloadPdf,
  formatNumber,
  renderDate,
  renderQuarter,
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
const { RangePicker } = DatePicker
const { itemDashboard, align, billingStatus } = AppConsts

export interface IProps {
  selectItem: any
  dashboardStore: DashboardStore
}

const columnsSummary = [
  {
    title: L("ITEM"),
    dataIndex: "PhaseText",
    key: "PhaseText",
    width: "70%",
    ellipsis: true,
    render: (PhaseText) => <>{PhaseText}</>,
  },
  {
    title: L("PROPOSING_TO_RECEIVE"),
    dataIndex: "Amount",
    key: "Amount",
    width: "30%",
    align: align.right,
    render: (Amount) => <>{formatNumber(Amount)}</>,
  },
]

const columnsPropject = [
  {
    title: L("PROJECT"),
    dataIndex: "ProjectCode",
    key: "ProjectCode",
    width: "40%",
    ellipsis: true,
    render: (ProjectCode) => <>{ProjectCode}</>,
  },
  {
    title: L("BUDGET_CODE"),
    dataIndex: "BudgetCode",
    key: "BudgetCode",
    width: "30%",
    render: (BudgetCode) => <>{BudgetCode}</>,
  },
  {
    title: L("AMOUNT"),
    dataIndex: "Amount",
    key: "Amount",
    align: align.right,
    width: "30%",
    render: (Amount) => <>{formatNumber(Amount)}</>,
  },
]
const columnsCommDetail = [
  {
    title: L("COMPANY_NAME"),
    dataIndex: "BusinessName",
    key: "BusinessName",
    width: "20%",
    ellipsis: false,
    render: (BusinessName) => <>{BusinessName}</>,
  },
  {
    title: L("Unit"),
    dataIndex: "UnitName",
    key: "UnitName",
    width: "15%",
    ellipsis: true,
    render: (UnitName) => <>{UnitName}</>,
  },
  {
    title: L("PROJECT_CODE"),
    dataIndex: "ProjectCode",
    key: "ProjectCode",
    width: "20%",
    ellipsis: true,
    render: (ProjectCode) => <>{ProjectCode}</>,
  },
  {
    title: L("LEASE_TERM"),
    dataIndex: "LeaseTerm",
    key: "LeaseTerm",
    width: "25%",
    render: (LeaseTerm) => <>{LeaseTerm}</>,
  },
  {
    title: L("ACTUAL_SIZE"),
    dataIndex: "ActualSize",
    key: "ActualSize",
    align: align.right,
    width: "20%",
    render: (ActualSize) => <>{ActualSize}</>,
  },
  {
    title: L("COMMENCEMENT_DATE"),
    dataIndex: "CommencementDate",
    align: align.center,
    key: "CommencementDate",
    width: "18%",
    render: renderDate,
  },
  {
    title: L("EXPIRY_DATE"),
    dataIndex: "ExpiryDate",
    align: align.center,
    key: "ExpiryDate",
    width: "18%",
    render: renderDate,
  },
  {
    title: L("REPORT_RENT_INCL_VAT"),
    dataIndex: "RentInclVAT",
    key: "RentInclVAT",
    width: "20%",
    align: align.right,
    render: (Amount) => <>{formatNumber(Amount)}</>,
  },
  {
    title: L("REPORT_RENT_EXCL_VAT"),
    dataIndex: "RentExclVAT",
    key: "RentExclVAT",
    align: align.right,
    width: "20%",
    render: (Amount) => <>{formatNumber(Amount)}</>,
  },
  {
    title: L("REPORT_CONTRACT_AMOUNT"),
    dataIndex: "ContractAmount",
    key: "ContractAmount",
    width: "20%",
    align: align.right,
    render: (Amount) => <>{formatNumber(Amount)}</>,
  },
  {
    title: L("REPORT_DEPARTMENT_COMM_AMOUNT"),
    dataIndex: "DepartmentCommissionAmount",
    key: "DepartmentCommissionAmount",
    align: align.right,
    width: "20%",
    render: (Amount) => <>{formatNumber(Amount)}</>,
  },
  {
    title: L("REPORT_BILLING_STATUS"),
    dataIndex: "StatusId",
    key: "StatusId",
    align: align.center,
    width: "20%",
    render: (StatusId) => (
      <>{billingStatus.find((item) => item.id === StatusId)?.label}</>
    ),
  },
  {
    title: L("REPORT_BILLING_DATE"),
    dataIndex: "ActBillingDate",
    key: "ActBillingDate",
    align: align.center,
    width: "20%",
    render: renderQuarter,
  },
]

@inject(Stores.DashboardStore)
@observer
class CommissionReport extends AppComponentListBase<IProps> {
  printRef: any = React.createRef()
  state = {
    filters: {
      fromDate: moment().startOf("quarter").toJSON(),
      toDate: moment()
        .startOf("quarter")
        .add(3, "month")
        .subtract(1, "day")
        .toJSON(),
    },

    isConvertting: false,
    dataCommDealer: [] as any,
    dataCommSummary: [] as any,
    dataCommProject: [] as any,
    dataCommDealerDetail: [] as any,
  }
  getcolumnsDealer = (actionColumn?) => {
    const data = [{ ...actionColumn }] as any
    ;(this.props.dashboardStore.listDealerComm || []).forEach((item) => {
      data.push({
        title: item.displayName,
        width: "30%",
        dataIndex: item.displayName,
        key: item.displayName,
        align: align.right,
        render: (Amount) => <>{Amount ? formatNumber(Amount) : ""}</>,
      })
    })

    return data
  }
  componentDidMount() {
    this.getDashBoard()
  }
  componentDidUpdate(prevProps) {
    if (prevProps.selectItem !== this.props.selectItem) {
      if (this.props.selectItem === itemDashboard.commission) {
        this.getDashBoard()
      }
    }
  }

  getDashBoard = async () => {
    this.props.dashboardStore
      .getDashboardCommissionByProject({
        ...this.state.filters,
      })
      .finally(() => {
        this.setState({
          dataCommProject:
            this.props.dashboardStore.dashboardCommissionByProjectData,
        })
      })
    this.props.dashboardStore
      .getDashboardCommissionPhase({
        ...this.state.filters,
      })
      .finally(() => {
        this.setState({
          dataCommSummary: this.props.dashboardStore.dashboardCommissionByPhase,
        })
      })
    this.props.dashboardStore
      .getDashboardCommissionDealerDetail({
        ...this.state.filters,
      })
      .finally(() => {
        this.setState({
          dataCommDealerDetail:
            this.props.dashboardStore.dashboardCommissionDetails,
        })
      })
    await this.props.dashboardStore.getListDealerComm({
      ...this.state.filters,
    })

    this.props.dashboardStore
      .getDashboardCommissionForDealer({
        ...this.state.filters,
      })
      .finally(() => {
        this.setState({
          dataCommDealer:
            this.props.dashboardStore.dashboardCommissionForDealer,
        })
      })

    // const abc = await this.getcolumnsDealer();
  }

  handleSearch = async (name, value) => {
    if (name === "dateFromTo") {
      await this.setState({
        filters: {
          fromDate: moment(value).toJSON(),
          toDate: moment(value).add(3, "month").subtract(1, "day").toJSON(),
        },
      })
    }
    await this.getDashBoard()
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
    const columnsCommDealer = this.getcolumnsDealer({
      title: L(""),
      dataIndex: "PhaseText",
      key: "PhaseText",
      width: "25%",
      render: (a) => <>{a}</>,
    })

    return (
      <>
        <Row gutter={[4, 8]}>
          <Col sm={{ span: 3, offset: 0 }}>
            <DatePicker
              clearIcon={false}
              defaultValue={moment()}
              onChange={(value) => this.handleSearch("dateFromTo", value)}
              picker="quarter"
              className="full-width"
            />
          </Col>
          <Col sm={{ span: 4, offset: 0 }}>
            <RangePicker
              format={dateFormat}
              value={[
                moment(this.state.filters?.fromDate),
                moment(this.state.filters?.toDate),
              ]}
              disabled={[true, true]}
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
              documentTitle={L("COMMISSION_REPORT")}
              pageStyle="@page { size:  19.8in 14in  }"
              removeAfterPrint
              content={() => this.printRef.current}
            />
          </Col>
        </Row>

        <Spin spinning={this.props.dashboardStore.isLoading}>
          <div ref={this.printRef} className="dashboard-style">
            <Divider
              orientation="left"
              orientationMargin="0"
              style={{ fontWeight: 600 }}
            ></Divider>

            <Row gutter={[8, 16]}>
              <Col sm={{ span: 12, offset: 0 }}>
                <Card className="card-report-fit-height w-100">
                  <div className="header-report">
                    <strong>{L("BONUS_SUMMARY_FOR_LEASING_TEAM")}</strong>
                    <div className="content-right">
                      <Button
                        onClick={() =>
                          tableToExcel("tblBonusSummaryForLeasingTeam")
                        }
                        className="button-primary"
                        icon={<ExcelIcon />}
                      ></Button>
                    </div>
                  </div>

                  <Table
                    id={"tblBonusSummaryForLeasingTeam"}
                    size="middle"
                    className="custom-ant-row"
                    scroll={{ y: this.state.isConvertting ? undefined : 590 }}
                    pagination={false}
                    columns={columnsSummary}
                    dataSource={this.state.dataCommSummary}
                    summary={(pageData) => {
                      let total = 0
                      pageData.forEach((item) => {
                        total += item.Amount
                      })
                      return (
                        <Table.Summary.Row className="bg-total">
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1} className="text-right">
                            <strong>{L("TOTAL")}: </strong>
                            <strong>{formatNumber(total)}</strong>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      )
                    }}
                  />
                </Card>
              </Col>
              <Col sm={{ span: 12, offset: 0 }}>
                <Card className="card-report-fit-height w-100">
                  <div className="header-report">
                    <strong>{L("BONUS_SUMMARY_FOR_DEALER")}</strong>
                    <div className="content-right">
                      <Button
                        onClick={() => tableToExcel("tblCommProject")}
                        className="button-primary"
                        icon={<ExcelIcon />}
                      ></Button>
                    </div>
                  </div>
                  <Table
                    id={"tblCommProject"}
                    size="middle"
                    className="custom-ant-row"
                    scroll={{ y: this.state.isConvertting ? undefined : 590 }}
                    pagination={false}
                    columns={columnsPropject}
                    dataSource={this.state.dataCommProject}
                    summary={(pageData) => {
                      let total = 0
                      pageData.forEach((item) => {
                        total += item.Amount
                      })
                      return (
                        <Table.Summary.Row className="bg-total">
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1} className="text-right">
                            <strong>{L("TOTAL")}: </strong>
                            <strong>{formatNumber(total)}</strong>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      )
                    }}
                  />
                </Card>
              </Col>
              <Col sm={{ span: 24, offset: 0 }}>
                <Divider
                  orientation="left"
                  orientationMargin="0"
                  style={{ fontWeight: 600 }}
                ></Divider>
                <Card className="card-report-fit-height w-100">
                  <div className="header-report">
                    <strong>{L("COMMISSION_PHASE_AND_DEALER_REPORT")}</strong>
                    <div className="content-right">
                      <Button
                        onClick={() => tableToExcel("CommisionDealerByPhase")}
                        className="button-primary"
                        icon={<ExcelIcon />}
                      ></Button>
                    </div>
                  </div>
                  <Table
                    id={"CommisionDealerByPhase"}
                    size="middle"
                    className="custom-ant-row custom-comm-table"
                    scroll={{ y: this.state.isConvertting ? undefined : 590 }}
                    pagination={false}
                    columns={columnsCommDealer}
                    dataSource={this.state.dataCommDealer}
                  />
                </Card>
              </Col>
              <Col sm={{ span: 24, offset: 0 }}>
                <Card className="card-report-fit-height w-100">
                  <div className="header-report">
                    <strong className="flex align-items-end">
                      {L("PHASE_1")}
                    </strong>
                    <div className="content-right">
                      <Button
                        onClick={() => tableToExcel("CommissionDealerByPhase1")}
                        className="button-primary"
                        icon={<ExcelIcon />}
                      ></Button>
                    </div>
                  </div>
                  <Table
                    id={"CommissionDealerByPhase1"}
                    size="middle"
                    className="custom-ant-row custom-comm-table"
                    scroll={{
                      x: 2000,
                      y: this.state.isConvertting ? undefined : 590,
                    }}
                    pagination={false}
                    columns={columnsCommDetail}
                    dataSource={this.state.dataCommDealerDetail.filter(
                      (item) => item?.NumPhase === 1
                    )}
                    summary={(pageData) => {
                      let total = 0
                      pageData.forEach((item) => {
                        total += item.DepartmentCommissionAmount
                      })
                      return (
                        <Table.Summary.Row className="bg-total">
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1} className="text-right">
                            <strong>{L("TOTAL_BONUS")}</strong>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1} className="text-right">
                            <strong>{formatNumber(total)}</strong>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      )
                    }}
                  />
                </Card>
              </Col>
              <Col sm={{ span: 24, offset: 0 }}>
                <Card className="card-report-fit-height w-100">
                  <div className="header-report">
                    <strong className="flex align-items-end">
                      {L("PHASE_2")}
                    </strong>
                    <div className="content-right">
                      <Button
                        onClick={() => tableToExcel("CommissionDealerByPhase2")}
                        className="button-primary"
                        icon={<ExcelIcon />}
                      ></Button>
                    </div>
                  </div>
                  <Table
                    id={"CommissionDealerByPhase2"}
                    size="middle"
                    className="custom-ant-row custom-comm-table"
                    scroll={{
                      x: 2000,
                      y: this.state.isConvertting ? undefined : 590,
                    }}
                    pagination={false}
                    columns={columnsCommDetail}
                    dataSource={this.state.dataCommDealerDetail.filter(
                      (item) => item?.NumPhase === 2
                    )}
                    summary={(pageData) => {
                      let total = 0
                      pageData.forEach((item) => {
                        total += item.DepartmentCommissionAmount
                      })
                      return (
                        <Table.Summary.Row className="bg-total">
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1} className="text-right">
                            <strong>{L("TOTAL_BONUS")}</strong>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1} className="text-right">
                            <strong>{formatNumber(total)}</strong>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      )
                    }}
                  />
                </Card>
              </Col>
              <Col sm={{ span: 24, offset: 0 }}>
                <Card className="card-report-fit-height w-100">
                  <div className="header-report">
                    <strong className="flex align-items-end">
                      {L("PHASE_3")}
                    </strong>
                    <div className="content-right">
                      <Button
                        onClick={() => tableToExcel("CommissionDealerByPhase3")}
                        className="button-primary"
                        icon={<ExcelIcon />}
                      ></Button>
                    </div>
                  </div>
                  <Table
                    id={"CommissionDealerByPhase3"}
                    size="middle"
                    className="custom-ant-row"
                    scroll={{
                      x: 2000,
                      y: this.state.isConvertting ? undefined : 590,
                    }}
                    pagination={false}
                    columns={columnsCommDetail}
                    dataSource={this.state.dataCommDealerDetail.filter(
                      (item) => item?.NumPhase === 3
                    )}
                    summary={(pageData) => {
                      let total = 0
                      pageData.forEach((item) => {
                        total += item.DepartmentCommissionAmount
                      })
                      return (
                        <Table.Summary.Row className="bg-total">
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1} className="text-right">
                            <strong>{L("TOTAL_BONUS")}</strong>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1} className="text-right">
                            <strong>{formatNumber(total)}</strong>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      )
                    }}
                  />
                </Card>
              </Col>
              <Col sm={{ span: 24, offset: 0 }}>
                <Card className="card-report-fit-height w-100">
                  <div className="header-report">
                    <strong className="flex align-items-end">
                      {L("PHASE_OTHER")}
                    </strong>
                    <div className="content-right">
                      <Button
                        onClick={() =>
                          tableToExcel("CommissionDealerByOtherPhase")
                        }
                        className="button-primary"
                        icon={<ExcelIcon />}
                      ></Button>
                    </div>
                  </div>
                  <Table
                    id={"CommissionDealerByOtherPhase"}
                    size="middle"
                    className="custom-ant-row"
                    scroll={{
                      x: 2000,
                      y: this.state.isConvertting ? undefined : 590,
                    }}
                    pagination={false}
                    columns={columnsCommDetail}
                    dataSource={this.state.dataCommDealerDetail.filter(
                      (item) => item?.NumPhase > 3
                    )}
                    summary={(pageData) => {
                      let total = 0
                      pageData.forEach((item) => {
                        total += item.DepartmentCommissionAmount
                      })
                      return (
                        <Table.Summary.Row className="bg-total">
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1} className="text-right">
                            <strong>{L("TOTAL_BONUS")}</strong>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1} className="text-right">
                            <strong>{formatNumber(total)}</strong>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      )
                    }}
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

export default withRouter(CommissionReport)
