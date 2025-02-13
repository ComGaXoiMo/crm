import { RowData } from "@models/DataTable"
import dayjs from "dayjs"

export interface IRowLeaseAgreement {
  moveInDate?: any
}

export class RowLeaseAgreementModel
  extends RowData
  implements IRowLeaseAgreement
{
  moveInDate: any
  constructor() {
    super()
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new RowLeaseAgreementModel(), obj)
    newObj.moveInDate = obj.moveInDate ? dayjs(obj.moveInDate) : undefined

    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}

export class LeaseAgreementDetailModel extends RowData {
  constructor() {
    super()
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new LeaseAgreementDetailModel(), obj)
    newObj.moveInDate = obj.moveInDate ? dayjs(obj.moveInDate) : undefined
    newObj.commencementDate = obj.commencementDate
      ? dayjs(obj.commencementDate)
      : undefined
    newObj.expiryDate = obj.expiryDate ? dayjs(obj.expiryDate) : undefined
    newObj.extensionDate = obj.extensionDate
      ? dayjs(obj.extensionDate)
      : undefined
    newObj.terminationDate = obj.terminationDate
      ? dayjs(obj.terminationDate)
      : undefined
    newObj.depositSendDate = obj.depositSendDate
      ? dayjs(obj.depositSendDate)
      : undefined
    newObj.amendmentMoveInDate = obj.amendmentMoveInDate
      ? dayjs(obj.amendmentMoveInDate)
      : undefined
    newObj.moveInDate = obj.moveInDate ? dayjs(obj.moveInDate) : undefined
    newObj.moveOutDate = obj.moveOutDate ? dayjs(obj.moveOutDate) : undefined
    newObj.paymentDate = obj.paymentDate ? dayjs(obj.paymentDate) : undefined
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}

export interface ILeaseAgreementItemModel {
  id?: number
  contactId?: number
  companyId?: number
  title?: string
  contactName?: string
  isPrimary?: boolean
  isActive?: boolean
}

export class LeaseAgreementItemModel {
  id?: number
  contactId?: number
  companyId?: number
  title?: string
  contactName?: string
  isPrimary?: boolean
  isActive?: boolean

  constructor(isPrimary?) {
    this.isPrimary = isPrimary
  }
}
