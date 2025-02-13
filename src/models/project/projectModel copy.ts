import { RowData } from "@models/DataTable"
import AppConsts, { AppConfiguration } from "@lib/appconst"
import dayjs from "dayjs"
import { v4 as uuid } from "uuid"
import { buildFileUrl } from "@lib/helper"

export interface IRowProject {
  urlMainPhoto: string
  projectGrades: any
  projectTypes: any
  projectTransportations: any
  projectFacilities: any
  projectTenants: any
  projectLandlords: any
  description: string
}

export class RowProjectModel extends RowData implements IRowProject {
  declare id?: number
  declare name?: string
  urlMainPhoto: string
  projectGrades: any
  projectTypes: any
  projectTransportations: any
  projectFacilities: any
  projectTenants: any
  projectLandlords: any
  description: string
  constructor() {
    super()
    this.urlMainPhoto = ""
    this.projectGrades = []
    this.projectTypes = []
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

    newObj.projectTypes = (newObj.projectTypes || []).map((item) => ({
      id: item.propertyTypeId,
      name: item.typeName,
    }))
    newObj.projectGrades = (newObj.projectGrades || []).map((item) => ({
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
  declare id?: number
  declare name?: string
  urlMainPhoto: string
  projectGrades: any
  projectTypes: any
  projectTransportations: any
  projectFacilities: any
  projectTenants: any
  projectLandlords: any
  description: string
  constructor() {
    super()
    this.urlMainPhoto = ""
    this.projectGrades = []
    this.projectTypes = []
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
    newObj.projectTypeIds = (newObj.projectTypes || []).map(
      (item) => item.propertyTypeId
    )
    newObj.gradeIds = (newObj.projectGrades || []).map((item) => item.gradeId)
    newObj.facilityIds = (newObj.projectFacilities || []).map(
      (item) => item.facilityId
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
    newObj.projectAddress =
      obj.projectAddress && obj.projectAddress.length
        ? obj.projectAddress[0]
        : {}
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
