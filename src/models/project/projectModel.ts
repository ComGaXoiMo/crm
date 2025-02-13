import { TemplateModel } from "@models/notificationTemplate"
import { buildFileUrlWithEncToken } from "@lib/helper"
import { defaultAvatar } from "@lib/appconst"
import { RowData } from "@models/DataTable"
import AppConsts, { AppConfiguration } from "@lib/appconst"
import { v4 as uuid } from "uuid"
import { buildFileUrl } from "@lib/helper"
import dayjs from "dayjs"
export class ProjectSettingModel {
  id: number
  projectId: number
  requestPerDay?: number
  newMailTos: string[]
  newMailCCs: string[]
  newMailBCCs: string[]
  updateMailTos: string[]
  updateMailCCs: string[]
  updateMailBCCs: string[]
  reportMailTos: string[]
  reportMailCCs: string[]
  reportMailBCCs: string[]
  notificationUsers: number[]

  constructor() {
    this.id = 0
    this.projectId = 0
    this.requestPerDay = undefined
    this.newMailTos = []
    this.newMailCCs = []
    this.newMailBCCs = []
    this.updateMailTos = []
    this.updateMailCCs = []
    this.updateMailBCCs = []
    this.reportMailTos = []
    this.reportMailCCs = []
    this.reportMailBCCs = []
    this.notificationUsers = []
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new ProjectSettingModel(), obj)
    return newObj
  }
}

export class ProjectFeeTemplateModel {
  id: number
  notificationTypeId: number
  notificationMethod: number
  isMember: boolean
  isActive: boolean
  notificationTemplates: TemplateModel[]
  templateLanguages: any
  parameters: any[]

  constructor() {
    this.id = 0
    this.notificationTypeId = 0
    this.notificationMethod = 0
    this.isMember = false
    this.isActive = false
    this.notificationTemplates = []
    this.templateLanguages = {}
    this.parameters = []
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new ProjectFeeTemplateModel(), obj)

    ;(abp.localization.languages || []).forEach((language) => {
      const templateLanguage = (newObj.notificationTemplates || []).find(
        (template) => template.languageName === language.name
      )
      newObj.templateLanguages[language.name] = TemplateModel.assign(
        templateLanguage || { languageName: language.name }
      )
    })
    return newObj
  }
}

export class ProjectRow {
  id?: number
  uniqueId?: string
  investorName?: string
  hotline?: string
  buildingCount?: number
  unitCount?: number
  description?: string
  address?: string
  isActive?: boolean
  creationTime?: Date
  creatorUserId?: number
  logoUrl?: string
  code?: string
  name?: string

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new ProjectRow(), obj)
    // Hack to cache image request
    newObj.logoUrl = obj.file?.fileUrl ? obj.file?.fileUrl + "&abc.png" : null
    newObj.buildingCount = obj.projectInfo?.totalBuildingCount || 0
    newObj.unitCount = obj.projectInfo?.totalUnitCount || 0

    return newObj
  }

  public static assigns<T>(objs) {
    const results: ProjectRow[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}

export class ProjectDetail {
  id?: number
  uniqueId?: string
  investorName?: string
  hotline?: string
  description?: string
  address?: string
  isActive?: boolean
  creationTime?: Date
  creatorUserId?: number
  logoUrl?: string
  code?: string
  name?: string

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new ProjectDetail(), obj)
    // Hack to cache image request
    newObj.logoUrl = obj.file?.fileUrl ? obj.file?.fileUrl + "&abc.png" : null
    return newObj
  }
}

export class UnitOptionModel {
  id?: number
  name?: string

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new UnitOptionModel(), obj)
    // Hack to cache image request
    newObj.name = obj.fullUnitCode
    return newObj
  }

  public static assigns<T>(objs) {
    const results: UnitOptionModel[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}

export class ProjectOptionModel {
  id?: number
  name?: string
  normalizedName?: string
  value?: number
  label: string
  code: string
  logoUrl: string
  constructor() {
    this.label = ""
    this.code = ""
    this.logoUrl = ""
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new ProjectOptionModel(), obj)
    newObj.show = true
    newObj.value = obj.id
    newObj.label = obj.name
    newObj.normalizedName = (newObj.name || "").toLowerCase()
    newObj.logoUrl =
      obj.file?.fileUrl && obj.file?.fileUrl.length
        ? buildFileUrlWithEncToken(obj.file?.fileUrl)
        : defaultAvatar
    return newObj
  }

  public static assigns<T>(objs) {
    const results: ProjectOptionModel[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}

export interface IRowProject {
  urlMainPhoto: string
  projectGrade: any
  projectType: any
  projectTransportations: any
  projectFacilities: any
  projectTenants: any
  projectLandlords: any
  description: string
}

export class RowProjectModel extends RowData implements IRowProject {
  // id?: number
  // name?: string
  urlMainPhoto: string
  projectGrade: any
  projectType: any
  projectTransportations: any
  projectFacilities: any
  projectTenants: any
  projectLandlords: any
  description: string
  builtDate: any
  effectiveDate: any
  file?: any
  constructor() {
    super()
    this.urlMainPhoto = ""
    this.projectGrade = []
    this.projectType = []
    this.projectTransportations = []
    this.projectFacilities = []
    this.projectTenants = []
    this.projectLandlords = []
    this.description = ""
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new RowProjectModel(), obj)
    newObj.name = obj.projectName
    newObj.urlMainPhoto =
      obj.urlMainPhoto && obj.urlMainPhoto.length > 0
        ? buildFileUrl(obj.urlMainPhoto.replace("//api", "/api"))
        : AppConsts.noImage

    newObj.projectType = (newObj.projectType || []).map((item) => ({
      id: item.propertyTypeId,
      name: item.typeName,
    }))
    newObj.projectGrade = (newObj.projectGrade || []).map((item) => ({
      id: item.gradeId,
      name: item.gradeName,
    }))
    newObj.projectFacilities = (newObj.projectFacilities || []).map((item) => ({
      id: item.facilityId,
      name: item.facilityName,
    }))
    newObj.projectTransportations = (newObj.projectTransportations || []).map(
      (item) => ({ id: item.transportationId, name: item.transportationName })
    )
    newObj.projectTenants = (newObj.projectTenants || []).map((item) => ({
      id: item.companyId,
      name: item.legalName,
    }))
    newObj.builtDate = obj.builtDate ? dayjs(obj.builtDate) : null
    newObj.effectiveDate = obj.effectiveDate ? dayjs(obj.effectiveDate) : null
    newObj.projectLandlords = (newObj.projectLandlords || []).map((item) => ({
      id: item.companyId,
      name: item.legalName,
    }))
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}

export class ProjectDetailModel extends RowData implements IRowProject {
  // id?: number
  // name?: string
  urlMainPhoto: string
  projectGrade: any
  projectType: any
  projectTransportations: any
  projectFacilities: any
  projectTenants: any
  projectLandlords: any
  description: string
  constructor() {
    super()
    this.urlMainPhoto = ""
    this.projectGrade = []
    this.projectType = []
    this.projectTransportations = []
    this.projectFacilities = []
    this.projectTenants = []
    this.projectLandlords = []
    this.description = ""
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new RowProjectModel(), obj)
    newObj.name = obj.projectName
    newObj.urlMainPhoto = buildFileUrl(
      (obj.urlMainPhoto
        ? `${AppConfiguration.remoteServiceBaseUrl}${obj.urlMainPhoto}`
        : AppConsts.noImage
      ).replace("//api", "/api")
    )
    newObj.projectTypeIds = (newObj.projectType || []).map(
      (item) => item.propertyTypeId
    )
    newObj.gradeIds = (newObj.projectGrade || []).map((item) => item.gradeId)
    newObj.facilityIds = (newObj.projectFacility || []).map(
      (item) => item.facilityId
    )
    newObj.transportation = (newObj.projectTransportation || []).map(
      (item) => item.transportationId
    )
    newObj.projectTransportations = (newObj.projectTransportations || []).map(
      (item) => ({ id: item.transportationId, name: item.transportationName })
    )
    newObj.projectTenants = (newObj.projectTenants || []).map((item) => ({
      id: item.companyId,
      name: item.legalName,
    }))
    newObj.projectLandlords = (newObj.projectLandlords || []).map((item) => ({
      id: item.companyId,
      name: item.legalName,
    }))
    newObj.launchingTime = obj.launchingTime
      ? dayjs(obj.launchingTime)
      : undefined
    newObj.builtDate = obj.builtDate ? dayjs(obj.builtDate) : undefined
    newObj.effectiveDate = obj.effectiveDate
      ? dayjs(obj.effectiveDate)
      : undefined
    newObj.yearRenovated = obj.yearRenovated
      ? dayjs(obj.yearRenovated)
      : undefined
    newObj.outOfDate = obj.outOfDate ? dayjs(obj.outOfDate) : undefined

    newObj.lessorCertificateIssuedDate = obj.lessorCertificateIssuedDate
      ? dayjs(obj.lessorCertificateIssuedDate)
      : undefined
    newObj.representativeCertificateEffectiveDate =
      obj.representativeCertificateEffectiveDate
        ? dayjs(obj.representativeCertificateEffectiveDate)
        : undefined
    newObj.managingAgentCertificateIssuedDate =
      obj.managingAgentCertificateIssuedDate
        ? dayjs(obj.managingAgentCertificateIssuedDate)
        : undefined

    newObj.projectAddress = obj.projectAddress
    // && obj.projectAddress.length ? obj.projectAddress[0] : {}
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}

export class RowFloorModel {
  id?: number
  name: string
  floorName: string
  order?: number
  isActive: boolean
  projectId?: number
  projectName: any
  size: number
  key: any

  constructor() {
    this.isActive = true
    this.name = ""
    this.floorName = ""
    this.projectName = ""
    this.size = 0
    this.key = uuid()
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new RowFloorModel(), obj)
    newObj.name = obj.floorName
    newObj.key = uuid()
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))

    return results
  }
}

export class RowUnitModel {
  id?: number
  floorName: string
  order?: number
  isActive: boolean
  projectId?: number
  projectName: any
  size: number
  key: any

  constructor() {
    this.isActive = true
    this.floorName = ""
    this.projectName = ""
    this.size = 0
    this.key = uuid()
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new RowFloorModel(), obj)
    newObj.key = uuid()
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}
