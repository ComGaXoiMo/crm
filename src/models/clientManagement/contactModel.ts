import { RowData } from "@models/DataTable"

export interface IRowContact {
  businessName: string;
  legalName: string;
  position?: string;
  level?: string;
  description?: string;
  phone?: string;
  emailAddress?: string;
  address?: string;
}

export class RowContactModel extends RowData implements IRowContact {
  businessName: string;
  legalName: string;
  constructor() {
    super()
    this.businessName = ""
    this.legalName = ""
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new RowContactModel(), obj)
    const primaryContact = (obj.contactContact || []).find(
      (p) => p.isActive && p.isPrimary
    )
    const primaryEmail = (obj.contactEmail || []).find((p) => p.isActive)
    const primaryPhone = (obj.contactPhone || []).find((p) => p.isActive)
    const primaryAddress =
      obj.contactAddress && obj.contactAddress.length > 0
        ? obj.contactAddress[0]
        : null
    newObj.name = `${obj.gender} ${obj.contactName}`
    newObj.businessName = primaryContact?.businessName
    newObj.legalName = primaryContact?.legalName
    newObj.emailAddress = primaryEmail?.email
    newObj.phone = primaryPhone
      ? (primaryPhone.phoneCode ? `(+${primaryPhone.phoneCode})` : "") +
        primaryPhone.phone
      : null
    newObj.address = primaryAddress
      ? [
          primaryAddress.address,
          primaryAddress.districtName,
          primaryAddress.provinceName,
          primaryAddress.countryName,
        ]
          .filter((p) => p)
          .join(", ")
      : null
    newObj.position = obj.title
    newObj.primaryCompany = (obj.contactCompany || []).find(
      (p) => p.isActive && p.isPrimary
    )
    newObj.primaryEmail = (obj.contactEmail || []).find(
      (p) => p.isActive && p.isPrimary
    )
    newObj.primaryPhone = (obj.contactPhone || []).find(
      (p) => p.isActive && p.isPrimary
    )
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}

export class ContactDetailModel extends RowData {
  constructor() {
    super()
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new RowContactModel(), obj)
    newObj.contactTypeIds = (newObj.contactTypeMap || []).map(
      (item) => item.contactTypeId
    )
    newObj.contactUserIds = (newObj.contactUser || []).map(
      (item) => item.userId
    )
    newObj.contactOrganizationUnitIds = (
      newObj.contactOrganizationUnit || []
    ).map((item) => item.organizationUnitId)

    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}

export interface IContactItemModel {
  id?: number;
  contactId?: number;
  companyId?: number;
  title?: string;
  contactName?: string;
  isPrimary?: boolean;
  isActive?: boolean;
}

export class ContactItemModel {
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
