import {RowData} from "@models/DataTable"

export interface IRowRequirement {
  requirementTypeId: number
  requirementTypeName: string
  requestTypeId: number
  requestTypeName: string
  tenantId: string
  tenantBusinessName: string
  tenantLegalName: string
  statusName: string
  amountMonthlyFrom: number
  amountMonthlyTo: number
  amountPerSquareMeterFrom: number
  amountPerSquareMeterTo: number
  sizeFrom: number
  sizeTo: number
  startDate?: Date
  expiredDate?: Date
  sourceName: string
  gradeName: string
}

export class RowRequirementModel extends RowData implements IRowRequirement{
  requirementTypeId: number
  requirementTypeName: string
  requestTypeId: number
  requestTypeName: string
  tenantId: string
  tenantBusinessName: string
  tenantLegalName: string
  statusName: string
  amountMonthlyFrom: number
  amountMonthlyTo: number
  amountPerSquareMeterFrom: number
  amountPerSquareMeterTo: number
  sizeFrom: number
  sizeTo: number
  spaceFrom: number
  spaceTo: number
  startDate?: Date
  expiredDate?: Date
  sourceName: string
  gradeName: string
  constructor() {
    super()
    this.requirementTypeId = 0
    this.requirementTypeName = ''
    this.requestTypeId = 0
    this.requestTypeName = ''
    this.tenantId = ''
    this.tenantBusinessName = ''
    this.tenantLegalName = ''
    this.statusName = ''
    this.amountMonthlyFrom = 0
    this.amountMonthlyTo = 0
    this.amountPerSquareMeterFrom = 0
    this.amountPerSquareMeterTo = 0
    this.sizeFrom = 0
    this.sizeTo = 0
    this.spaceFrom = 0
    this.spaceTo = 0
    this.sourceName = ''
    this.gradeName = ''
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new RowRequirementModel(), obj)
    newObj.name = obj.unitName
    newObj.amountMonthlyFrom = obj.monthlyFrom
    newObj.amountMonthlyTo = obj.monthlyTo
    newObj.amountPerSquareMeterFrom = obj.perFrom
    newObj.amountPerSquareMeterTo = obj.perTo
    newObj.spaceFrom = obj.spaceFrom
    newObj.spaceTo = obj.spaceTo

    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}
