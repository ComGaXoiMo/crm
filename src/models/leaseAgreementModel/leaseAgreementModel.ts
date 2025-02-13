import { RowData } from "@models/DataTable"
import moment from "moment"

export interface IRowLeaseAgreement {
  moveInDate?: any;
}

export class RowLeaseAgreementModel
  extends RowData
  implements IRowLeaseAgreement
{
  moveInDate: any;
  constructor() {
    super()
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new RowLeaseAgreementModel(), obj)
    newObj.moveInDate = obj.moveInDate ? moment(obj.moveInDate) : undefined

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
    newObj.moveInDate = obj.moveInDate ? moment(obj.moveInDate) : undefined
    newObj.commencementDate = obj.commencementDate
      ? moment(obj.commencementDate)
      : undefined
    newObj.expiryDate = obj.expiryDate ? moment(obj.expiryDate) : undefined
    newObj.extensionDate = obj.extensionDate
      ? moment(obj.extensionDate)
      : undefined
    newObj.terminationDate = obj.terminationDate
      ? moment(obj.terminationDate)
      : undefined
    newObj.depositSendDate = obj.depositSendDate ? moment(obj.depositSendDate) : undefined
    newObj.amendmentMoveInDate = obj.amendmentMoveInDate ? moment(obj.amendmentMoveInDate) : undefined
    newObj.moveInDate = obj.moveInDate ? moment(obj.moveInDate) : undefined
    newObj.moveOutDate = obj.moveOutDate ? moment(obj.moveOutDate) : undefined
    newObj.paymentDate = obj.paymentDate ? moment(obj.paymentDate) : undefined
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}

export interface ILeaseAgreementItemModel {
  id?: number;
  contactId?: number;
  companyId?: number;
  title?: string;
  contactName?: string;
  isPrimary?: boolean;
  isActive?: boolean;
}

export class LeaseAgreementItemModel {
  id?: number;
  contactId?: number;
  companyId?: number;
  title?: string;
  contactName?: string;
  isPrimary?: boolean;
  isActive?: boolean;

  constructor(isPrimary?) {
    this.isPrimary = isPrimary
  }
}
