import { RowData } from "@models/DataTable"
import moment from "moment"

export interface IRowUnit {
  projectId: number;
  projectName: string;
  floorName: string;
  amountMonthly: number;
  amountPerSquareMeter: number;
  size: number;
  orgTenantId: number;
  orgTenantBusinessName: string;
  orgTenantLegalName: string;
  statusName: string;
  unitTypeName: string;
  startDate?: Date;
  expiredDate?: Date;
  description: string;
}

export class RowUnitModel extends RowData implements IRowUnit {
  projectId: number;
  projectName: string;
  floorName: string;
  amountMonthly: number;
  amountPerSquareMeter: number;
  size: number;
  orgTenantId: number;
  orgTenantBusinessName: string;
  orgTenantLegalName: string;
  statusName: string;
  unitTypeName: string;
  commencementDate?: Date;
  expiredDate?: Date;
  moveInDate?: Date;
  moveOutDate?: Date;
  otherLA?: any;
  description: string;
  constructor() {
    super()
    this.projectId = 0
    this.projectName = ""
    this.floorName = ""
    this.amountMonthly = 0
    this.amountPerSquareMeter = 0
    this.size = 0
    this.orgTenantId = 0
    this.orgTenantBusinessName = ""
    this.orgTenantLegalName = ""
    this.statusName = ""
    this.unitTypeName = ""
    this.commencementDate = undefined
    this.expiredDate = undefined
    this.moveInDate = undefined
    this.moveOutDate = undefined
    this.otherLA = {}
    this.description = ""
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new RowUnitModel(), obj)
    newObj.name = obj.unitName
    newObj.amountMonthly = obj.monthly
    newObj.amountPerSquareMeter = obj.per
    newObj.commencementDate = obj.leaseAgreement?.find(
      (item) => item?.expiryDate >= moment().toJSON() && item?.commencementDate <= moment().toJSON()
    )?.commencementDate
    newObj.expiredDate = obj.leaseAgreement?.find(
      (item) => item?.expiryDate  >= moment().toJSON()&& item?.commencementDate <= moment().toJSON()
    )?.expiryDate
    newObj.moveInDate = obj.leaseAgreement?.find(
      (item) => item?.expiryDate  >= moment().toJSON()&& item?.commencementDate <= moment().toJSON()
    )?.moveInDate
    newObj.moveOutDate = obj.leaseAgreement?.find(
      (item) => item?.expiryDate  >= moment().toJSON()&& item?.commencementDate <= moment().toJSON()
    )?.moveOutDate
    newObj.otherLA = obj.leaseAgreement?.find(
      (item) => item?.commencementDate > moment().toJSON()
    )
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}
export class RowUnitStatusModel {
  unitId: number;
  leaseAgreementId: number;
  statusId: number;

  startDate?: Date;
  endDate?: Date;

  commencementDate?: Date;
  expiredDate?: Date;

  constructor() {
    this.unitId = 0
    this.leaseAgreementId = 0
    this.statusId = 0

    this.startDate = undefined
    this.endDate = undefined
    this.commencementDate = undefined
    this.expiredDate = undefined
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new RowUnitStatusModel(), obj)
    newObj.startDate = obj.startDate ? moment(obj.startDate) : null
    newObj.endDate = obj.endDate ? moment(obj.endDate) : null
    newObj.commencementDate = obj.commencementDate
      ? moment(obj.commencementDate)
      : null
    newObj.expiredDate = obj.expiredDate ? moment(obj.expiredDate) : null
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}
