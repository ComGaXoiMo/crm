import AppConsts from "@lib/appconst"
import { RowData } from "@models/DataTable"
import moment from "moment"
const { activityType } = AppConsts

export interface IRowInquiry {
  moveInDate?: any;
}

export class RowInquiryModel extends RowData implements IRowInquiry {
  moveInDate: any;
  constructor() {
    super()
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new RowInquiryModel(), obj)
    newObj.moveInDate = obj.moveInDate ? moment(obj.moveInDate) : undefined

    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}

export class InquiryDetailModel extends RowData {
  constructor() {
    super()
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new RowInquiryModel(), obj)
    newObj.moveInDate = obj.moveInDate ? moment(obj.moveInDate) : undefined

    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}

export interface IInquiryItemModel {
  id?: number;
  contactId?: number;
  companyId?: number;
  title?: string;
  contactName?: string;
  isPrimary?: boolean;
  isActive?: boolean;
}

export class InquiryItemModel {
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
export class InquirySimpleModel {
  id?: any;
  name?: any;
  contactId?: any;
  contactName?: any;
  occupierName?: any;
  leaseTerm?: any;
  moveInDate?: any;

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new InquirySimpleModel(), obj);
    (newObj.id = obj.id),
      (newObj.name = `${obj.inquiryName} - ${obj.contact?.contactName} - ${obj.creatorUser?.displayName}`),
      (newObj.contactId = obj.contactId),
      (newObj.contactName = obj.contact?.contactName),
      (newObj.occupierName = obj.occupierName),
      (newObj.leaseTerm = obj.leaseTerm !== 0 ? obj.leaseTerm : undefined),
      (newObj.moveInDate = obj.moveInDate ? moment(obj.moveInDate) : undefined)

    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs?.forEach((item) => results.push(this.assign(item)))
    return results
  }
}
export class ActivityModel {
  type?: any;

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new ActivityModel(), obj)
    if (obj.inquiryCall) {
      newObj.type = activityType.call
    } else if (obj.inquiryMail) {
      newObj.type = activityType.mail
    } else if (obj.inquiryProposal) {
      newObj.type = activityType.proposal
    } else if (obj.inquirySiteVisit) {
      newObj.type = activityType.sitevisit
    } else if (obj.inquiryReservation) {
      newObj.type = activityType.reservation
    }

    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs?.forEach((item) => results.push(this.assign(item)))
    return results
  }
}
