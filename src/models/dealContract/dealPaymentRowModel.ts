import { RowData } from "@models/DataTable"
import dayjs from "dayjs"
import { v4 as uuid } from "uuid"

export interface IRowDealPayment {
  key: string
  name?: string
  invoiceNo?: string
  estDate?: Date
  estPercent?: number
  paymentTimeLine?: string
  estAmount?: number
  vatAmount?: number
  issued?: string
  usdAmount?: number
  statusName?: string
  statusId?: number
  description?: string
}

export class RowDealPaymentModel implements IRowDealPayment, RowData {
  key: string
  name?: string
  invoiceNo?: string
  estDate?: Date
  estPercent?: number
  paymentTimeLine?: string
  estAmount?: number
  vatAmount?: number
  issued?: string
  usdAmount?: number
  statusName?: string
  statusId?: number
  description?: string
  constructor(key?) {
    this.key = key || ""
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new RowDealPaymentModel(), obj)
    newObj.key = uuid()
    newObj.estDate = newObj.estDate ? dayjs(newObj.estDate) : null
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}

export class RowDealPaymentAdjustModel implements IRowDealPayment, RowData {
  key: string
  name?: string
  invoiceNo?: string
  estDate?: Date
  estPercent?: number
  paymentTimeLine?: string
  estAmount?: number
  vatAmount?: number
  issued?: string
  usdAmount?: number
  statusName?: string
  statusId?: number
  description?: string
  constructor(key?) {
    this.key = key || ""
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new RowDealPaymentModel(), obj)
    newObj.key = uuid()
    newObj.estDate = newObj.estDate ? dayjs(newObj.estDate) : null
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}
