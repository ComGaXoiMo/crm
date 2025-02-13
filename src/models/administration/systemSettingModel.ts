export interface ISystemSetting {
  payment: FinanceSetting | undefined
}

export class SystemSetting implements ISystemSetting {
  payment: FinanceSetting | undefined

  constructor() {
    this.payment = new FinanceSetting()
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new SystemSetting(), obj)
    newObj.payment = FinanceSetting.assign(obj.payment)
    return newObj
  }
}

export class FinanceSetting {
  minDepositAllowed: number
  penaltyCancellationRequest: number
  commissionPercent: number

  constructor() {
    this.minDepositAllowed = 0
    this.penaltyCancellationRequest = 0
    this.commissionPercent = 0
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new FinanceSetting(), obj)
    return newObj
  }
}
