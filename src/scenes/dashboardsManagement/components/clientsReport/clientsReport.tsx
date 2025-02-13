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
  Tooltip,
  Spin,
  Card,
} from "antd"
import {
  convertFilterDate,
  filterOptions,
  formatNumber,
  handleDownloadPdf,
  renderDate,
  renderOptions,
  tableToExcel,
} from "@lib/helper"
import AppConsts from "@lib/appconst"
import { L } from "@lib/abpUtility"
import RentByCompany from "./components/RentByCompany"
import RentByIndustry from "./components/RentByIndustry"
import { FilePdfOutlined } from "@ant-design/icons"
import withRouter from "@components/Layout/Router/withRouter"
import Stores from "@stores/storeIdentifier"
import DashboardStore from "@stores/dashboardStore"
import moment from "moment"
import AppDataStore from "@stores/appDataStore"
import CompanyStore from "@stores/clientManagement/companyStore"
import ReactToPrint from "react-to-print"
import { ExcelIcon } from "@components/Icon"

const { RangePicker } = DatePicker
const { align, itemDashboard, reportType } = AppConsts

interface GroupedCompanyResult {
  CompanyId: number
  BusinessName: string
  ContractAmount: number
}
interface GroupedIndustryResult {
  IndustryId: number
  Industry: string
  ContractAmount: number
}
export interface IClientsReportProps {
  selectItem: any
  dashboardStore: DashboardStore
  appDataStore: AppDataStore
  companyStore: CompanyStore
}

const columns = [
  {
    title: L("COMPANY_NAME"),
    dataIndex: "BusinessName",
    key: "BusinessName",
    width: 200,
    render: (BusinessName) => <>{BusinessName}</>,
  },
  {
    title: L("INDUSTRY"),
    dataIndex: "Industry",
    key: "Industry",
    ellipsis: false,
    width: 130,
    render: (Industry) => <>{Industry}</>,
  },
  {
    title: L("REFERENCE_NUMBER"),
    dataIndex: "ReferenceNumber",
    key: "ReferenceNumber",
    ellipsis: false,
    align: align.left,
    width: 100,
    render: (ReferenceNumber) => <>{ReferenceNumber}</>,
  },

  {
    title: L("RENT"),
    dataIndex: "ContractAmount",
    ellipsis: false,
    key: "ContractAmount",
    align: align.right,
    width: 130,
    render: (ContractAmount) => <>{formatNumber(ContractAmount)}</>,
  },
  {
    title: L("COMMENCEMENT_DATE"),
    dataIndex: "CommencementDate",
    align: align.center,
    width: 120,
    render: renderDate,
  },
  {
    title: L("EXPIRED_DATE"),
    dataIndex: "ExpiryDate",
    ellipsis: false,
    key: "expiredDate",
    align: align.center,
    width: 120,
    render: renderDate,
  },
  {
    title: L("DEALER"),
    dataIndex: "Dealer",
    ellipsis: false,
    key: "Dealer",
    align: align.left,
    width: 130,
    render: (Dealer) => <>{Dealer}</>,
  },
  {
    title: L("CREATE_AT"),
    dataIndex: "CreationTime",
    ellipsis: false,
    key: "CreationTime",
    align: align.center,
    width: 170,
    render: renderDate,
  },
]

@inject(Stores.DashboardStore, Stores.AppDataStore, Stores.CompanyStore)
@observer
class ClientsReport extends AppComponentListBase<IClientsReportProps> {
  printRef: any = React.createRef()
  state = {
    filters: {
      reportType: "year",
      fromDate: moment().startOf("year").toJSON(),
      toDate: moment().toJSON(),
    },

    initCompanyGroup: [] as any,
    initIndustryGroup: [] as any,
    dataCompanyGroup: [] as any,
    dataIndustryGroup: [] as any,
    isConvertting: false,
    dataShow: [] as any,
  }

  componentDidMount() {
    this.getDashBoard()
    this.props.appDataStore.getIndustries("")
    this.getAll("")
  }
  componentDidUpdate(prevProps) {
    if (prevProps.selectItem !== this.props.selectItem) {
      if (this.props.selectItem === itemDashboard.client) {
        this.getDashBoard()
      }
    }
  }

  getAll = async (keyword) => {
    await this.props.companyStore.getAll({
      maxResultCount: 10,
      skipCount: 0,
      keyword: keyword,
    })
  }
  getDashBoard = async () => {
    await this.props.dashboardStore.getDashboardClient({
      ...this.state.filters,
    })
    this.setState({ dataShow: this.props.dashboardStore.dashboardClientData })
    this.groupData(this.props.dashboardStore.dashboardClientData)
  }

  groupData = (listData) => {
    const groupedCompanyData: { [key: string]: GroupedCompanyResult } = {}
    const groupedIndustryData: { [key: string]: GroupedIndustryResult } = {}
    listData.forEach((entry) => {
      const keyCompanyId = `${entry.CompanyId}`
      if (!groupedCompanyData[keyCompanyId]) {
        groupedCompanyData[keyCompanyId] = {
          BusinessName: entry.BusinessName,
          CompanyId: entry.CompanyId,
          ContractAmount: 0,
        }
      }
      groupedCompanyData[keyCompanyId].ContractAmount += entry.ContractAmount

      const keyIndustryId = `${entry.IndustryId}`
      if (!groupedIndustryData[keyIndustryId]) {
        groupedIndustryData[keyIndustryId] = {
          Industry: entry.Industry,
          IndustryId: entry.IndustryId,
          ContractAmount: 0,
        }
      }
      groupedIndustryData[keyIndustryId].ContractAmount += entry.ContractAmount
    })

    const resultCompany: GroupedCompanyResult[] =
      Object.values(groupedCompanyData)

    const resultIndustry: GroupedIndustryResult[] =
      Object.values(groupedIndustryData)

    this.setState({
      dataCompanyGroup: resultCompany,
      initCompanyGroup: resultCompany,
      dataIndustryGroup: resultIndustry,
      initIndustryGroup: resultIndustry,
    })
  }

  handleSearch = async (name, value) => {
    const { filters } = this.state
    if (name === "dateFromTo") {
      if (value === undefined || value === null) {
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
          { filters: convertFilterDate(filters, value), skipCount: 0 },
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
        this.filterDataClient(
          this.props.dashboardStore.dashboardClientData,
          name,
          value
        )
      }
    }
  }
  filterDataClient = (listData, nameSearch, valueSeach) => {
    const { filters } = this.state
    if (nameSearch === "filterTop") {
      const sortedDataCompanyGroup = this.state.initCompanyGroup
        .sort((a, b) => b.ContractAmount - a.ContractAmount)
        .slice(0, valueSeach)
      this.setState({ dataCompanyGroup: sortedDataCompanyGroup })

      const sortedDataIndustryGroup = this.state.initIndustryGroup
        .sort((a, b) => b.ContractAmount - a.ContractAmount)
        .slice(0, valueSeach)
      this.setState({ dataIndustryGroup: sortedDataIndustryGroup })
    }
    if (nameSearch === "companyId") {
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
      }
    }
    if (nameSearch === "industryId") {
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
          (item) => item.IndustryId === valueSeach
        )
        this.setState({ dataShow: dataFilter })

        this.groupData(dataFilter)
      }
    }
  }

  changeTab = (tabKey) => {
    this.setState({ tabActiveKey: tabKey })
  }
  handleDownloadPdfs = async (type) => {
    await this.setState({ isConvertting: true })
    const element = this.printRef.current
    await handleDownloadPdf(element, type, "ClientDashboard.pdf").finally(
      () => {
        this.setState({ isConvertting: false })
      }
    )
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
              placeholder={["From", "To"]}
              clearIcon={false}
              value={[
                moment(this.state.filters.fromDate),
                moment(this.state.filters.toDate),
              ]}
              onChange={(value) => this.handleSearch("dateFromTo", value)}
            />
          </Col>
          <Col sm={{ span: 3, offset: 0 }}>
            <Select
              getPopupContainer={(trigger) => trigger.parentNode}
              placeholder={L("FILTER_TOP")}
              style={{ width: "100%" }}
              allowClear
              onChange={(value) => this.handleSearch("filterTop", value)}
            >
              {renderOptions([
                { value: 5, name: L("TOP_5") },
                { value: 10, name: L("TOP_10") },
                { value: 20, name: L("TOP_20") },
              ])}
            </Select>
          </Col>
          <Col sm={{ span: 3, offset: 0 }}>
            <Select
              getPopupContainer={(trigger) => trigger.parentNode}
              placeholder={L("Industry")}
              style={{ width: "100%" }}
              allowClear
              showSearch
              filterOption={filterOptions}
              onChange={(value) => this.handleSearch("industryId", value)}
            >
              {renderOptions(this.props.appDataStore.industriesLv1)}
            </Select>
          </Col>
          <Col sm={{ span: 3, offset: 0 }}>
            <Select
              getPopupContainer={(trigger) => trigger.parentNode}
              placeholder={L("Company")}
              style={{ width: "100%" }}
              allowClear
              showSearch
              filterOption={false}
              onSearch={this.getAll}
              onChange={(value) => this.handleSearch("companyId", value)}
            >
              {renderOptions(this.props.companyStore.tableData?.items)}
            </Select>
          </Col>

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
              documentTitle={L("CLIENT_REPORT")}
              pageStyle="@page { size:  19.8in 14in  }"
              removeAfterPrint
              content={() => this.printRef.current}
            />
          </Col>
        </Row>
        <Spin spinning={this.props.dashboardStore.isLoading}>
          <div ref={this.printRef} className="dashboard-style">
            <Row gutter={[16, 20]}>
              <Col sm={{ span: 12, offset: 0 }}>
                <RentByCompany data={this.state.dataCompanyGroup} />
              </Col>
              <Col sm={{ span: 12, offset: 0 }}>
                <RentByIndustry data={this.state.dataIndustryGroup} />
              </Col>
              <Col sm={{ span: 24, offset: 0 }}>
                <Card className="card-report-fit-height w-100">
                  <div className="content-right">
                    <Button
                      onClick={() => tableToExcel("tblCompany")}
                      className="button-primary"
                      icon={<ExcelIcon />}
                    ></Button>
                  </div>
                  <Table
                    id={"tblCompany"}
                    scroll={{ y: this.state.isConvertting ? undefined : 450 }}
                    size="middle"
                    pagination={false}
                    className="custom-ant-row"
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

export default withRouter(ClientsReport)
