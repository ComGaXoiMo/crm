import { RowData } from "@models/DataTable"
import dayjs from "dayjs"
import {
  RowDealPaymentAdjustModel,
  RowDealPaymentModel,
} from "@models/dealContract/dealPaymentRowModel"
import {
  DealDepartmentServiceFee,
  DealDepartmentServiceFeeAdjust,
} from "@models/dealContract/dealDepartmentServiceFee"

export interface IRowDealContractCommercial {
  businessName: string
  legalName: string
  companyId: number
  statusName: string
  statusId: number
  feeAmount: number
  department: string
  businessLine: string
  percentCompleted: string
}

export class RowDealContractCommercialModel
  implements IRowDealContractCommercial, RowData
{
  id?: number
  name?: string
  businessName: string
  legalName: string
  companyId: number
  statusName: string
  statusId: number
  feeAmount: number
  department: string
  businessLine: string
  percentCompleted: string

  constructor() {
    this.businessName = ""
    this.legalName = ""
    this.companyId = 0
    this.statusName = ""
    this.statusId = 0
    this.feeAmount = 0
    this.department = this.businessLine = ""
    this.percentCompleted = ""
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new RowDealContractCommercialModel(), obj)
    newObj.name = obj.dealName
    newObj.department = obj.organizationUnitName
    newObj.businessLine = (obj.dealOrganizationUnit || [])
      .map((p) => p.organizationUnitName)
      .join(", ")
    newObj.percentCompleted = obj.percentCompleted
      ? `${obj.percentCompleted} %`
      : ""
    newObj.allDepartment = (obj.dealOrganizationUnit || []).map(
      (p) => p.organizationUnitName
    )
    newObj.allService = (obj.dealOrganizationUnit || []).map(
      (p) => p.instructionName
    )
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}

export class DealContractCommercialDetailModel extends RowData {
  company: any
  contact: any
  dealShare: any
  expectedCloseDate?: Date
  expiredDate?: Date
  commencementDate?: Date
  reportDate?: Date
  payment: RowDealPaymentModel[]

  constructor() {
    super()
    this.dealShare = []
    this.payment = []
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new DealContractCommercialDetailModel(), obj)
    newObj.company = { id: obj.companyId, businessName: obj.businessName }
    newObj.contact = { id: obj.contactId, contactName: obj.contactName }
    newObj.dealShare = DealDepartmentServiceFee.assigns(
      obj.dealOrganizationUnit
    )
    newObj.startDate = obj.startDate ? dayjs(obj.startDate) : undefined
    newObj.expiredDate = obj.expiredDate ? dayjs(obj.expiredDate) : undefined
    newObj.draftReport = obj.draftReport ? dayjs(obj.draftReport) : undefined
    newObj.finalReport = obj.finalReport ? dayjs(obj.finalReport) : undefined
    newObj.commencementDate = obj.commencementDate
      ? dayjs(obj.commencementDate)
      : undefined
    newObj.reportDate = obj.reportDate ? dayjs(obj.reportDate) : undefined
    newObj.payment = RowDealPaymentModel.assigns(obj.payment)
    newObj.paymentAdjust = obj.paymentAdjust
      ? RowDealPaymentAdjustModel.assigns(obj.paymentAdjust)
      : []
    newObj.dealAdjust =
      obj.dealAdjust && obj.dealAdjust.length
        ? DealDepartmentServiceFeeAdjust.assigns(obj.dealAdjust)
        : [new DealDepartmentServiceFeeAdjust()]

    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}
