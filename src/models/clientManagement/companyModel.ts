import { RowData } from "@models/DataTable"
import dayjs from "dayjs"

export interface IRowCompany {
  businessName: string
  legalName: string
  description?: string
  phone?: string
  emailAddress?: string
  website?: string
  vatCode?: string
  parentId?: number
  parentBusinessName?: string
  parentLegalName?: string
  leadSourceName?: string
}

export class RowCompanyModel extends RowData implements IRowCompany {
  // id?: number
  // name?: string
  businessName: string
  legalName: string
  constructor() {
    super()
    this.businessName = ""
    this.legalName = ""
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new RowCompanyModel(), obj)
    const [primary] = (obj.companyPhone || []).filter((p) => p.isPrimary)

    newObj.name = obj.businessName
    newObj.phone = primary
      ? (primary.phoneCode ? `(+${primary.phoneCode})` : "") + primary.phone
      : null
    newObj.vatCode = obj.vatcode
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}

export class CompanyDetailModel extends RowData {
  parent: any
  companyTypeMapIds: any[]
  companyTypeMap: any[]
  licenseIssuedDate: any
  constructor() {
    super()
    this.companyTypeMapIds = []
    this.companyTypeMap = []
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new RowCompanyModel(), obj)
    newObj.companyTypeIds = (newObj.companyTypeMap || []).map(
      (item) => item.companyTypeId
    )
    newObj.companyUserIds = (newObj.companyUser || []).map(
      (item) => item.userId
    )
    newObj.companyOrganizationUnitIds = (
      newObj.companyOrganizationUnit || []
    ).map((item) => item.organizationUnitId)
    newObj.parent = { id: obj.parentId, businessName: obj.businessName }
    newObj.licenseIssuedDate = obj.licenseIssuedDate
      ? dayjs(obj.licenseIssuedDate)
      : null

    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}

export interface ICompanyItemModel {
  id?: number
  contactId?: number
  companyId?: number
  title?: string
  businessName?: string
  isPrimary?: boolean
  isActive?: boolean
}

export class CompanyItemModel {
  id?: number
  contactId?: number
  companyId?: number
  title?: string
  businessName?: string
  isPrimary?: boolean
  isActive?: boolean

  constructor(isPrimary?) {
    this.isPrimary = isPrimary
  }
}
