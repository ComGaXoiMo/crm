export interface IDealDepartmentServiceFee{
  id?: number,
  opportunityId?: number,
  organizationUnitId?: number,
  instructionId?: number,
  isActive: boolean,
  isPrimary: boolean,
  feeAmount?: number
}

export class DealDepartmentServiceFee implements IDealDepartmentServiceFee {
  id?: number
  opportunityId?: number
  organizationUnitId?: number
  instructionId?: number
  isActive: boolean
  isPrimary: boolean
  feeAmount?: number

  constructor(isPrimary?) {
    this.opportunityId = undefined
    this.organizationUnitId = undefined
    this.instructionId = undefined
    this.isActive = false
    this.isPrimary = !!isPrimary
    this.feeAmount = undefined
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new DealDepartmentServiceFee(), obj)
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}

export interface IDealDepartmentServiceFeeAdjust{
  id?: number,
  opportunityId?: number,
  organizationUnitId?: number,
  instructionId?: number,
  isActive: boolean,
  isPrimary: boolean,
  feeAmount?: number
}

export class DealDepartmentServiceFeeAdjust implements IDealDepartmentServiceFeeAdjust {
  id?: number
  opportunityId?: number
  organizationUnitId?: number
  instructionId?: number
  isActive: boolean
  isPrimary: boolean
  feeAmount?: number

  constructor(isPrimary?) {
    this.opportunityId = undefined
    this.organizationUnitId = undefined
    this.instructionId = undefined
    this.isActive = false
    this.isPrimary = !!isPrimary
    this.feeAmount = undefined
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new DealDepartmentServiceFee(), obj)
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}
