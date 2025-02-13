import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Row, Col, Table, Button, Spin, Card, DatePicker, Select } from "antd"

import { L } from "@lib/abpUtility"
import {
  handleDownloadPdf,
  formatNumber,
  tableToExcel,
  convertFilterDate,
  renderDate,
  filterOptions,
  renderOptions,
} from "@lib/helper"
import AppConsts, { dateFormat } from "@lib/appconst"
import withRouter from "@components/Layout/Router/withRouter"
import DashboardStore from "@stores/dashboardStore"
import Stores from "@stores/storeIdentifier"
import moment from "moment"
import { ExcelIcon } from "@components/Icon"
import unitService from "@services/projects/unitService"
import _ from "lodash"
const { itemDashboard, align } = AppConsts
const { RangePicker } = DatePicker

export interface IProps {
  selectItem: any
  dashboardStore: DashboardStore
}

@inject(Stores.DashboardStore)
@observer
class DepositReport extends AppComponentListBase<IProps> {
  printRef: any = React.createRef()
  state = {
    filters: {
      fromDate: moment().startOf("month").endOf("days").toJSON(),
      toDate: moment().endOf("month").endOf("days").toJSON(),
      unitId: undefined,
    },
    listUnit: [] as any,

    isConvertting: false,
    dataCommDeposit: [] as any,
  }

  componentDidMount() {
    this.getDashBoard()
    this.getUnit("")
  }
  componentDidUpdate(prevProps) {
    if (prevProps.selectItem !== this.props.selectItem) {
      if (this.props.selectItem === itemDashboard.deposit) {
        this.getDashBoard()
      }
    }
  }
  getUnit = async (keyword) => {
    const res = await unitService.getAllRes({
      maxResultCount: 10,
      skipCount: 0,
      keyword,
      isActive: true,
    })
    const newUnit = res.items.map((i) => {
      return { id: i.id, name: `${i.projectCode}-${i.unitName}` }
    })

    await this.setState({ listUnit: newUnit })
  }
  getDashBoard = async () => {
    this.props.dashboardStore
      .getDashboardDeposit({
        ...this.state.filters,
      })
      .finally(() => {
        this.setState({
          dataCommDeposit: this.state.filters?.unitId
            ? [...this.props.dashboardStore.dashboardDepositData].filter(
                (item) => item?.UnitId === this.state.filters?.unitId
              )
            : this.props.dashboardStore.dashboardDepositData,
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
    } else if (name == "UnitId") {
      this.setState(
        {
          filters: {
            ...filters,
            unitId: value,
          },
        },
        async () => {
          await this.getDashBoard()
        }
      )
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
    const columnsDeposit = [
      {
        title: L("PROJECT"),
        dataIndex: "ProjectCode",
        key: "ProjectCode",
        width: 100,
        ellipsis: true,
        render: (project, row, index) => {
          const obj = {
            children: project,
            props: {} as any,
          }
          // Check if this row's project matches the project of the previous row
          if (
            index > 0 &&
            project === this.state.dataCommDeposit[index - 1].ProjectCode
          ) {
            obj.props.rowSpan = 0
          } else {
            // Count the number of consecutive rows with the same project
            let count = 1
            for (
              let i = index + 1;
              i < this.state.dataCommDeposit.length;
              i++
            ) {
              if (this.state.dataCommDeposit[i].ProjectCode === project) {
                count++
              } else {
                break
              }
            }
            obj.props.rowSpan = count
          }
          return obj
        },
      },

      {
        title: L("UNIT"),
        dataIndex: "UnitName",
        key: "UnitName",
        width: 100,
        ellipsis: true,

        render: (unit, row, index) => {
          const obj = {
            children: unit,
            props: {} as any,
          }
          // Check if this row's project matches the project of the previous row
          if (
            index > 0 &&
            unit === this.state.dataCommDeposit[index - 1].UnitName
          ) {
            obj.props.rowSpan = 0
          } else {
            // Count the number of consecutive rows with the same project
            let count = 1
            for (
              let i = index + 1;
              i < this.state.dataCommDeposit.length;
              i++
            ) {
              if (this.state.dataCommDeposit[i].UnitName === unit) {
                count++
              } else {
                break
              }
            }
            obj.props.rowSpan = count
          }
          return obj
        },
      },
      {
        title: L("LA_REF_NUMBER"),
        dataIndex: "ReferenceNumber",
        key: "ReferenceNumber",
        width: 200,
        ellipsis: true,
        render: (refNumber, row, index) => {
          const obj = {
            children: refNumber,
            props: {} as any,
          }
          // Check if this row's project matches the project of the previous row
          if (
            index > 0 &&
            refNumber === this.state.dataCommDeposit[index - 1].ReferenceNumber
          ) {
            obj.props.rowSpan = 0
          } else {
            // Count the number of consecutive rows with the same project
            let count = 1
            for (
              let i = index + 1;
              i < this.state.dataCommDeposit.length;
              i++
            ) {
              if (this.state.dataCommDeposit[i].ReferenceNumber === refNumber) {
                count++
              } else {
                break
              }
            }
            obj.props.rowSpan = count
          }
          return obj
        },
      },
      {
        title: L("REPORT_DEPOSIT_CONTACT_NAME"),
        dataIndex: "ContactName",
        key: "ContactName",
        width: 200,
        ellipsis: false,
        render: (ContactName, row, index) => {
          const obj = {
            children: ContactName,
            props: {} as any,
          }
          // Check if this row's project matches the project of the previous row
          if (
            index > 0 &&
            ContactName === this.state.dataCommDeposit[index - 1].ContactName
          ) {
            obj.props.rowSpan = 0
          } else {
            // Count the number of consecutive rows with the same project
            let count = 1
            for (
              let i = index + 1;
              i < this.state.dataCommDeposit.length;
              i++
            ) {
              if (this.state.dataCommDeposit[i].ContactName === ContactName) {
                count++
              } else {
                break
              }
            }
            obj.props.rowSpan = count
          }
          return obj
        },
      },
      {
        title: L("BUSINESS_NAME"),
        dataIndex: "BusinessName",
        key: "BusinessName",
        width: 200,
        ellipsis: false,
        render: (BusinessName, row, index) => {
          const obj = {
            children: BusinessName,
            props: {} as any,
          }
          // Check if this row's project matches the project of the previous row
          if (
            index > 0 &&
            BusinessName === this.state.dataCommDeposit[index - 1].BusinessName
          ) {
            obj.props.rowSpan = 0
          } else {
            // Count the number of consecutive rows with the same project
            let count = 1
            for (
              let i = index + 1;
              i < this.state.dataCommDeposit.length;
              i++
            ) {
              if (this.state.dataCommDeposit[i].BusinessName === BusinessName) {
                count++
              } else {
                break
              }
            }
            obj.props.rowSpan = count
          }
          return obj
        },
      },
      // {
      //   title: L("ADMIN"),
      //   dataIndex: "admin",
      //   key: "admin",
      //   width: 160,
      //   ellipsis: true,
      //   render: (admin, row) => (
      //     <>
      //       {
      //         row?.UserIncharge?.find(
      //           (item) => item.PositionId === positionUser.admin
      //         )?.DisplayName
      //       }
      //     </>
      //   ),
      // },

      // {
      //   title: L("DEALER"),
      //   dataIndex: "dealer",
      //   key: "dealer",
      //   width: 160,
      //   ellipsis: true,
      //   render: (dealer, row) => (
      //     <>
      //       {
      //         row?.UserIncharge?.find(
      //           (item) => item.PositionId === positionUser.dealer
      //         )?.DisplayName
      //       }
      //     </>
      //   ),
      // },

      {
        title: L("DEPOSIT"),
        dataIndex: "DepositAmount",
        key: "DepositAmount",
        width: 150,
        align: align.right,
        render: (DepositAmount, row, index) => {
          const obj = {
            children: formatNumber(DepositAmount),
            props: {} as any,
          }
          // Check if this row's project matches the project of the previous row
          if (
            index > 0 &&
            DepositAmount ===
              this.state.dataCommDeposit[index - 1].DepositAmount
          ) {
            obj.props.rowSpan = 0
          } else {
            // Count the number of consecutive rows with the same project
            let count = 1
            for (
              let i = index + 1;
              i < this.state.dataCommDeposit.length;
              i++
            ) {
              if (
                this.state.dataCommDeposit[i].DepositAmount === DepositAmount
              ) {
                count++
              } else {
                break
              }
            }
            obj.props.rowSpan = count
          }
          return obj
        },
      },
      // {
      //   title: L("NO"),
      //   dataIndex: "NoOfUnitInProject",
      //   key: "NoOfUnitInProject",
      //   width: 50,
      //   align: align.center,
      //   ellipsis: true,
      //   render: (text, row, index) => {
      //     const obj = {
      //       children: text,
      //     }

      //     if (
      //       index > 0 &&
      //       row?.ReferenceNumber ===
      //         this.state.dataCommDeposit[index - 1].ReferenceNumber
      //     ) {
      //       let count = 0
      //       for (let i = index; i > -1; i--) {
      //         if (
      //           this.state.dataCommDeposit[i].ReferenceNumber ===
      //           row?.ReferenceNumber
      //         ) {
      //           count++
      //         }
      //       }
      //       obj.children = count
      //     } else {
      //       obj.children = 1
      //     }
      //     return obj
      //   },
      // },
      {
        title: L("RECEIPT_DETAIL"),
        children: [
          {
            title: L("RECEIPT_NO"),
            dataIndex: "ReceiptNo",
            key: "ReceiptNo",
            width: 120,
            ellipsis: true,
            render: (ReceiptNo) => <>{ReceiptNo}</>,
          },
          {
            title: L("RECEIPT_DATE"),
            dataIndex: "ReceiptDate",
            key: "ReceiptDate",
            width: 120,
            align: align.center,
            ellipsis: true,
            render: renderDate,
          },
        ],
      },

      {
        title: L("PAYMENT_DETAIL"),
        children: [
          {
            title: L("AMOUNT"),
            dataIndex: "ReceiptAmount",
            key: "ReceiptAmount",
            width: 120,
            align: align.right,
            ellipsis: true,
            render: (ReceiptAmount) => <>{formatNumber(ReceiptAmount)}</>,
          },
          {
            title: L("PAYMENT_DATE"),
            dataIndex: "PaymentDate",
            key: "PaymentDate",
            width: 120,
            align: align.center,
            ellipsis: true,
            render: renderDate,
          },
        ],
      },
    ]

    return (
      <>
        <Row gutter={[4, 8]}>
          <Col sm={{ span: 5, offset: 0 }}>
            <RangePicker
              clearIcon={false}
              format={dateFormat}
              value={[
                moment(this.state.filters?.fromDate),
                moment(this.state.filters?.toDate),
              ]}
              onChange={(value) => this.handleSearch("dateFromTo", value)}
            />
          </Col>
          <Col sm={{ span: 4, offset: 0 }}>
            <Select
              placeholder={L("UNIT")}
              style={{ width: "100%" }}
              onSearch={_.debounce((e) => this.getUnit(e), 200)}
              allowClear
              showSearch
              filterOption={filterOptions}
              onChange={(value) => this.handleSearch("UnitId", value)}
            >
              {renderOptions(this.state.listUnit)}
            </Select>
          </Col>
        </Row>
        <br />
        <Spin spinning={this.props.dashboardStore.isLoading}>
          <div ref={this.printRef} className="dashboard-style">
            <Row gutter={[8, 8]}>
              <Col sm={{ span: 24, offset: 0 }}>
                <Card className="card-report-fit-height w-100">
                  <div className="header-report">
                    <strong>{L("DEPOSIT_REPORT")}</strong>
                    <div className="content-right">
                      <Button
                        onClick={() => tableToExcel("tblDepositReport")}
                        className="button-primary"
                        icon={<ExcelIcon />}
                      ></Button>
                    </div>
                  </div>

                  <Table
                    id={"tblDepositReport"}
                    bordered
                    size="middle"
                    className="custom-ant-row"
                    scroll={{ y: this.state.isConvertting ? undefined : 590 }}
                    pagination={false}
                    columns={columnsDeposit}
                    dataSource={this.state.dataCommDeposit}
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

export default withRouter(DepositReport)
