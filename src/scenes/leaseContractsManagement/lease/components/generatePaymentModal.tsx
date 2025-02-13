import { L } from "@lib/abpUtility"
import { Col, Form, Modal, Row, Table } from "antd"
import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import AppConsts, { dateDifference, dateFormat } from "@lib/appconst"
import _ from "lodash"
import DataTable from "@components/DataTable"
import dayjs from "dayjs"
import { formatCurrency } from "@lib/helper"
import LeaseAgreementStore from "@stores/communication/leaseAgreementStore"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
const { align, term } = AppConsts
interface Props {
  visible: boolean
  onClose: () => void
  onOk: (params) => void
  leaseAgreementId: any
  dataForGenrerate: any
  otherFee: any
  leaseAgreementStore: LeaseAgreementStore
}

interface State {
  dataTable: any[]
  firstPeriodTime: any
  feeToGenarate: any[]
}

@inject(Stores.LeaseAgreementStore)
@observer
class GeneratePaymentModal extends AppComponentListBase<Props, State> {
  formRef: any = React.createRef()

  constructor(props) {
    super(props)
    this.state = {
      dataTable: [] as any,
      firstPeriodTime: 0,
      feeToGenarate: [] as any,
    }
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        const firstPeriodTime = dayjs(
          this.props.dataForGenrerate.paymentDate
        ).diff(dayjs(this.props.dataForGenrerate.commencementDate), "days")
        await this.setState({ firstPeriodTime })
        await this.initData()
      }
    }
  }
  checkisFullPeriod = (startPeriod, endPeriod) => {
    return (
      dayjs(endPeriod).add(1, "days").diff(dayjs(startPeriod), "days") ===
      dayjs(startPeriod)
        .add(this.props.dataForGenrerate?.paymentTerm.countMonth, "months")
        .diff(dayjs(startPeriod), "days")
    )
  }
  filteredData = (data, fromDate, toDate) => {
    const res = data.filter((item) => {
      const itemFrom = dayjs(item.startDate)
      const itemTo = dayjs(item.endDate)
      const filterStartDate = dayjs(fromDate)
      const filterEndDate = dayjs(toDate)
      return (
        itemFrom.isBetween(filterStartDate, filterEndDate, null, "[]") ||
        itemTo.isBetween(filterStartDate, filterEndDate, null, "[]") ||
        filterStartDate.isBetween(itemFrom, itemTo, null, "[]") ||
        filterEndDate.isBetween(itemFrom, itemTo, null, "[]")
      )
    })
    return res
  }
  countAmountByDate = async (startPeriod, endPeriod) => {
    // const { dataForGenrerate } = this.props;
    let rentPeriod = 0
    const feeInPeriod = await this.filteredData(
      this.state.feeToGenarate,
      startPeriod,
      endPeriod
    )

    let beforeFee = 0
    let betwenFee = 0
    let afterFee = 0
    let PeriodINFeeRent = 0

    await feeInPeriod.map(async (item) => {
      const dateBeforPayment = dateDifference(
        dayjs(item?.startDate).endOf("days"),
        dayjs(item?.endDate).endOf("days").add(1, "days")
      )

      if (
        !dayjs(item.startDate).isBetween(
          dayjs(startPeriod).startOf("day"),
          dayjs(endPeriod).endOf("day"),
          null,
          "[]"
        ) &&
        dayjs(item.endDate).isBetween(
          dayjs(startPeriod).startOf("day"),
          dayjs(endPeriod).endOf("day"),
          null,
          "[]"
        )
      ) {
        const dateBefor = dateDifference(
          dayjs(startPeriod).endOf("days"),
          dayjs(item.endDate).endOf("days").add(1, "days")
        )
        const monthLast = await this.getDateByNumDay(
          item.endDate,
          dateBefor.days
        )
        const rentOfDay =
          (item?.amountIncludeVat * monthLast.last) /
            dayjs(item.endDate).daysInMonth() +
          (item?.amountIncludeVat * monthLast.first) /
            dayjs(item.endDate).subtract(1, "months").daysInMonth()

        beforeFee =
          item?.amountIncludeVat * (dateBefor.years * 12 + dateBefor.months) +
          rentOfDay
      } else if (
        dayjs(item.startDate).isBetween(
          dayjs(startPeriod).startOf("day"),
          dayjs(endPeriod).endOf("day"),
          null,
          "[]"
        ) &&
        dayjs(item.endDate).isBetween(
          dayjs(startPeriod).startOf("day"),
          dayjs(endPeriod).endOf("day"),
          null,
          "[]"
        )
      ) {
        const monthLast = await this.getDateByNumDay(
          item.endDate,
          dateBeforPayment.days
        )
        const rentOfDay =
          (item?.amountIncludeVat * monthLast.last) /
            dayjs(item.endDate).daysInMonth() +
          (item?.amountIncludeVat * monthLast.first) /
            dayjs(item.endDate).subtract(1, "months").daysInMonth()
        betwenFee =
          betwenFee +
          item?.amountIncludeVat *
            (dateBeforPayment.years * 12 + dateBeforPayment.months) +
          rentOfDay
      } else if (
        dayjs(item.startDate).isBetween(
          dayjs(startPeriod).startOf("day"),
          dayjs(endPeriod).endOf("day"),
          null,
          "[]"
        ) &&
        !dayjs(item.endDate).isBetween(
          dayjs(startPeriod).startOf("day"),
          dayjs(endPeriod).endOf("day"),
          null,
          "[]"
        )
      ) {
        const dateAfter = dateDifference(
          dayjs(item?.startDate).endOf("days"),
          dayjs(endPeriod).endOf("days").add(1, "days")
        )
        const monthLast = await this.getDateByNumDay(endPeriod, dateAfter.days)

        const rentOfDay =
          (item?.amountIncludeVat * monthLast.last) /
            dayjs(endPeriod).daysInMonth() +
          (item?.amountIncludeVat * monthLast.first) /
            dayjs(endPeriod).subtract(1, "months").daysInMonth()

        afterFee =
          item?.amountIncludeVat * (dateAfter.years * 12 + dateAfter.months) +
          rentOfDay
      } else if (startPeriod >= item.startDate && endPeriod <= item.endDate) {
        const datePeriodDiff = dateDifference(
          dayjs(startPeriod).endOf("days"),
          dayjs(endPeriod).endOf("days").add(1, "days")
        )
        PeriodINFeeRent =
          item?.amountIncludeVat *
            (datePeriodDiff.years * 12 + datePeriodDiff.months) +
          (item?.amountIncludeVat * datePeriodDiff.days) /
            dayjs(endPeriod).daysInMonth()

        // PeriodINFeeRent =
        //   item?.amountIncludeVat * dataForGenrerate?.paymentTerm.countMonth;
      }
    })
    rentPeriod = beforeFee + betwenFee + afterFee + PeriodINFeeRent
    return rentPeriod
  }

  getDateByNumDay = async (date, numday) => {
    let last = numday

    const first = numday - dayjs(date).date()
    if (first > 0) {
      last = numday - first
    }
    return {
      first: first > 0 ? first : 0,
      last: last,
    }
  }

  addToSchdulePayment = async (startPeriod, endPeriod, rowIndex) => {
    const dateBeforPayment = dateDifference(
      dayjs(startPeriod).endOf("days"),
      dayjs(endPeriod).endOf("days").add(1, "days")
    )
    const amountCount = await this.countAmountByDate(
      dayjs(startPeriod).toJSON(),
      dayjs(endPeriod).toJSON()
    )
    // let amountCount = await this.breakPeriodToMonth(startPeriod, endPeriod);
    const newRentPeriod = {
      startDate: startPeriod,
      endDate: endPeriod,
      feeTypeId: 1,
      leaseAgreementId: this.props.leaseAgreementId,
      rowIndex: rowIndex,
      month: dateBeforPayment.years * 12 + dateBeforPayment.months,
      day: dateBeforPayment.days,
      amountIncludeVat: amountCount,
      amount: amountCount,
    }
    return {
      rent: newRentPeriod,
    }
  }

  initData = async () => {
    const { dataForGenrerate, otherFee } = this.props
    const schedulePayment = [] as any
    const newTB = [...dataForGenrerate?.feeDetail]
    dataForGenrerate?.feeDetail.map((item, index) => {
      const initRow = { ...item }
      const discount = dataForGenrerate?.feeDiscount.filter(
        (discountFee) =>
          dayjs(discountFee?.startDate) >= dayjs(item?.startDate) &&
          dayjs(discountFee?.endDate) <= dayjs(item?.endDate)
      )
      if (discount.length > 0) {
        const indexFind = _.findIndex(newTB, (e) => {
          return e?.startDate == item?.startDate
        })
        newTB.splice(indexFind, 1)
        let startDateDiscount = dayjs(item?.startDate)
        const endDateDiscount = dayjs(item?.endDate)
        discount.map((discountItem) => {
          if (
            dayjs(discountItem?.startDate) >
            dayjs(startDateDiscount).add(1, "days")
          ) {
            const before = {
              ...initRow,
              name:
                dayjs(startDateDiscount) > dayjs(item?.startDate)
                  ? "between"
                  : "before",
              startDate:
                dayjs(startDateDiscount) > dayjs(item?.startDate)
                  ? dayjs(startDateDiscount).add(1, "days").toJSON()
                  : dayjs(startDateDiscount).toJSON(),
              endDate: dayjs(discountItem?.startDate)
                .subtract(1, "days")
                .toJSON(),
            }
            newTB.splice(index, 0, before)
          }
          if (
            dayjs(discountItem?.startDate) >= dayjs(startDateDiscount) &&
            dayjs(discountItem?.endDate) <= dayjs(endDateDiscount)
          ) {
            const main = {
              ...initRow,
              name: "Discount",
              isDiscount: true,
              amountIncludeVat:
                discountItem?.rentIncludeVat -
                discountItem?.discountIncludeVatPerMonth,
              startDate: dayjs(discountItem?.startDate).toJSON(),
              endDate: dayjs(discountItem?.endDate).toJSON(),
            }
            newTB.splice(index, 0, main)
          }
          if (dayjs(discountItem?.endDate) < dayjs(endDateDiscount)) {
            const after = {
              ...initRow,
              name: "after",
              startDate: dayjs(discountItem?.endDate).add(1, "days").toJSON(),
              endDate: dayjs(endDateDiscount).toJSON(),
            }
            const oldAfterIndex = newTB.findIndex(
              (tbItem) => tbItem.name === "after"
            )
            if (oldAfterIndex > 0) {
              newTB.splice(oldAfterIndex, 1)
            }
            newTB.splice(index, 0, after)
          }

          startDateDiscount = dayjs(discountItem?.endDate)
        })
      }
    })
    await newTB.sort(function (left, right) {
      return dayjs.utc(left.startDate).diff(dayjs.utc(right.startDate))
    })
    const dataGropRent = [] as any
    const otherFeeRent = otherFee.reduce(
      (sum, item) => sum + item.amountIncludeVat,
      0
    )
    let tagetValue: any
    await newTB.map((item, index) => {
      if (
        tagetValue &&
        tagetValue?.amountIncludeVat === item?.amountIncludeVat
      ) {
        tagetValue.name = `${tagetValue.name}-${item.name}`
        tagetValue.endDate = item?.endDate
      } else {
        tagetValue = {
          ...item,
          amountIncludeVat: item.isDiscount
            ? item.amountIncludeVat + otherFeeRent
            : item.amountIncludeVat,
        }
      }
      dataGropRent.push(tagetValue)
    })

    await this.setState({
      feeToGenarate: _.uniqWith(dataGropRent, (obj1: any, obj2: any) => {
        return (
          obj1.startDate === obj2.startDate && obj1.endDate === obj2.endDate
        )
      }),
    })
    if (dataForGenrerate?.paymentTerm?.id === term.oneTimePayment) {
      const startPeriod = dayjs(dataForGenrerate?.commencementDate).toJSON()
      const endPeriod = dayjs(dataForGenrerate?.expiryDate).toJSON()
      const newPeriod = await this.addToSchdulePayment(
        startPeriod,
        endPeriod,
        0
      )

      await schedulePayment.push(newPeriod?.rent)
      await this.setState({ dataTable: schedulePayment })
    } else {
      if (this.state.firstPeriodTime > 0) {
        const startPeriod = dayjs(dataForGenrerate?.commencementDate).toJSON()
        const endPeriod = dayjs(dataForGenrerate?.paymentDate)
          .subtract(1, "days")
          .toJSON()

        const newPeriod = await this.addToSchdulePayment(
          startPeriod,
          endPeriod,
          0
        )
        await schedulePayment.push(newPeriod?.rent)
      }
      let startDate = dataForGenrerate?.paymentDate
      let i = 1
      do {
        i++

        const startPeriod = await dayjs(startDate).toJSON()
        let endPeriod = await dayjs(startPeriod)
          .add(dataForGenrerate?.paymentTerm?.countMonth, "months")
          .subtract(1, "days")
          .toJSON()

        if (
          dayjs(endPeriod).endOf("months") <
          dayjs(dataForGenrerate?.paymentDate)
        ) {
          endPeriod = await dayjs(endPeriod)
            .set(
              "date",
              parseInt(
                dayjs(endPeriod)
                  .endOf("months")
                  .subtract(1, "days")
                  .format("DD")
              )
            )
            .toJSON()
        }
        if (dayjs(endPeriod) > dayjs(dataForGenrerate?.expiryDate)) {
          endPeriod = await dayjs(dataForGenrerate?.expiryDate).toJSON()
        }
        const newPeriod = await this.addToSchdulePayment(
          startPeriod,
          endPeriod,
          i
        )
        if (
          dayjs(startPeriod)
            .add(dataForGenrerate?.paymentTerm?.countMonth, "months")
            .endOf("months")
            .format("DD") >= dayjs(dataForGenrerate?.paymentDate).format("DD")
        ) {
          startDate = await dayjs(startPeriod)
            .add(dataForGenrerate?.paymentTerm?.countMonth, "months")
            .set(
              "date",
              parseInt(dayjs(dataForGenrerate?.paymentDate).format("DD"))
            )
            .toJSON()
        } else {
          startDate = await dayjs(startPeriod)
            .add(dataForGenrerate?.paymentTerm?.countMonth, "months")

            .toJSON()
        }
        await schedulePayment.push(newPeriod?.rent)
      } while (dayjs(startDate) < dayjs(dataForGenrerate?.expiryDate))

      const scheduleRemoveDate = schedulePayment.filter(
        (item) =>
          dayjs(item.endDate) <=
          dayjs(dataForGenrerate.expiryDate).add(
            dataForGenrerate?.paymentTerm?.countMonth,
            "month"
          )
      )
      this.setState({ dataTable: scheduleRemoveDate })
    }
  }
  onOk = async () => {
    const dataSend = [...this.state.dataTable].map((item) => {
      return {
        ...item,
        startDate: dayjs(item.startDate).endOf("days").toJSON(),
        endDate: dayjs(item.endDate).endOf("days").toJSON(),
      }
    })

    this.props.onOk(dataSend)
  }
  render(): React.ReactNode {
    const {
      dataForGenrerate,
      visible,
      onClose,
      leaseAgreementStore: { isLoading },
    } = this.props
    const columns = [
      {
        title: L("START_PERIOD"),
        dataIndex: "startDate",
        key: "startDate",
        align: align.center,
        width: 100,
        render: this.renderDate,
      },
      {
        title: L("END_PERIOD"),
        dataIndex: "endDate",
        key: "endDate",
        width: 100,
        align: align.center,
        render: this.renderDate,
      },
      {
        title: L("LEASE_TERM"),
        align: align.center,
        children: [
          {
            title: L("MONTH_S"),
            dataIndex: "month",
            align: align.center,
            width: 40,
            key: "month",
            render: (input) => <h4>{input}</h4>,
          },
          {
            title: L("DAY_S"),
            dataIndex: "day",
            align: align.center,
            width: 40,
            key: "day",
            render: (input) => <h4>{input}</h4>,
          },
        ],
      },
      {
        title: L("TOTAL_AMOUNT"),
        dataIndex: "totalAmount",
        align: align.right,
        width: 110,
        key: "totalAmount",
        render: (rentWithVat, row) => (
          <h4>{formatCurrency(row?.amountIncludeVat)}</h4>
        ),
      },

      {
        title: L("DUE_DATE"),
        dataIndex: "startDate",
        align: align.center,
        width: 80,
        key: "startDate",
        render: this.renderDate,
      },
    ]
    return (
      this.props.visible && (
        <Modal
          style={{ top: 20 }}
          title={<strong>{L("GENERATE_PAYMENT")}</strong>}
          visible={visible}
          // visible={true}
          width={"60%"}
          onOk={() => this.onOk()}
          onCancel={onClose}
          closable={false}
          confirmLoading={isLoading}
        >
          <Form ref={this.formRef} layout={"vertical"} size="middle">
            <div className="w-100">
              <Row gutter={[8, 0]} style={{ alignItems: "center" }}>
                <Col className="pl-4" sm={{ span: 6 }}>
                  <strong>
                    {L("PAYMENT_TERM")}: {dataForGenrerate.paymentTerm.name}
                  </strong>
                </Col>

                <Col sm={{ span: 6 }}>
                  <strong>
                    {L("COMMENCEMENT_DATE")}:{"  "}
                    {dayjs(dataForGenrerate.commencementDate).format(
                      dateFormat
                    )}
                  </strong>
                </Col>
                <Col sm={{ span: 6 }}>
                  <strong>
                    {L("PAYMENT_DATE")}:{"  "}
                    {dayjs(dataForGenrerate.paymentDate).format(dateFormat)}
                  </strong>
                </Col>
                <Col sm={{ span: 6 }}>
                  <strong>
                    {L("EXPIRY_DATE")}:{"  "}
                    {dayjs(dataForGenrerate.expiryDate).format(dateFormat)}
                  </strong>
                </Col>
                <Col sm={{ span: 24 }}>
                  <DataTable
                    title={this.L("SCHEDULE_PAYMENT")}
                    pagination={false}
                  >
                    <Table
                      size="middle"
                      className="custom-ant-table"
                      rowKey={(record, index) => `sp-${index}`}
                      columns={columns}
                      bordered
                      pagination={false}
                      loading={isLoading}
                      dataSource={this.state.dataTable ?? []}
                      scroll={{
                        x: 500,
                        y: 500,
                        scrollToFirstRowOnChange: true,
                      }}
                    />
                  </DataTable>
                </Col>
              </Row>
            </div>
          </Form>
        </Modal>
      )
    )
  }
}
export default withRouter(GeneratePaymentModal)
