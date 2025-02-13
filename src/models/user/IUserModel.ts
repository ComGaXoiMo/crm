export interface IUserModel {
  id: number
  name: string
  surname: string
  displayName: string
  phoneNumber?: string
  userName?: string
  emailAddress?: string
  fileUrl?: string
}

export class UserModel implements IUserModel {
  id: number
  name: string
  surname: string
  displayName: string
  phoneNumber?: string
  userName?: string
  emailAddress?: string
  fileUrl?: string

  constructor(id?, displayName?, userName?, emailAddress?, phoneNumber?, fileUrl?) {
    this.id = id || 0
    this.name = ''
    this.surname = ''
    this.displayName = displayName || ''
    this.phoneNumber = phoneNumber
    this.userName = userName || ''
    this.emailAddress = emailAddress
    this.fileUrl = ''
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new UserModel(), obj || {})
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}

export class UserBalanceModel {
  id: number
  user?: UserModel
  cashNumber?: string
  balanceAmount?: number

  constructor() {
    this.id = 0
    this.balanceAmount = 0
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new UserBalanceModel(), obj || {})
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}

export class UserOption {
  id: number
  value: number
  label: string
  displayName: string
  emailAddress: string

  constructor() {
    this.id = 0
    this.value = 0
    this.label = ''
    this.displayName = ''
    this.emailAddress = ''
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new UserOption(), obj || {})
    newObj.id = obj.id
    newObj.value = obj.id
    newObj.label = obj.displayName
    newObj.displayName = obj.displayName
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    ;(objs || []).forEach((item) => results.push(this.assign(item)))
    return results
  }
}
