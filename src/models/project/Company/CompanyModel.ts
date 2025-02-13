import { UserModel } from '@models/user/IUserModel'


export interface IRowCompany {
  user?: UserModel;
}

export class RowCompanyModel implements IRowCompany {
  user?: UserModel;
 

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new RowCompanyModel(), obj)
    newObj.user = UserModel.assign(obj.user || {})
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}

export class CompanyOptionModel {
  id: number
  name: string
  companyCode: string
  companyLegalName: string
  representative: string
  constructor() {
    this.id = 0
    this.name = ''
    this.companyCode = ''
    this.companyLegalName = ''
    this.representative = ''
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new CompanyOptionModel(), obj)
    newObj.name = obj.companyName
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}

export class CompanyModel {
  id: number
  companyTypeId?: number
  companyCode: string
  companyName: string
  companyLegalName: string
  representative: string
  documentFileId?: Date

  constructor() {
    this.id = 0
    this.companyName = ''
    this.companyCode = ''
    this.companyLegalName = ''
    this.representative = ''
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new CompanyModel(), obj)
    newObj.companyTypeId = obj.companyType?.id
    return newObj
  }
}

export class CompanyTypeModel {
  id: number
  name: string

  constructor() {
    this.id = 0
    this.name = ''
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new CompanyTypeModel(), obj)
    newObj.name = obj.typeName
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}
