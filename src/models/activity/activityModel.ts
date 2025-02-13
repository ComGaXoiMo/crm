import { RowData } from "@models/DataTable"
import dayjs from "dayjs"

export interface IRowActivity {
  moduleId?: number
  moduleName: string
  referenceId?: number
  referenceName: string
  taskStatusId?: number
  taskStatusName?: string
  taskPriorityId?: number
  taskPriorityName?: string
  startDate?: Date
  endDate?: Date
  description: string
}

export class RowActivityModel extends RowData implements IRowActivity {
  moduleId: number
  moduleName: string
  referenceId: number
  referenceName: string
  taskStatusId?: number
  taskStatusName?: string
  taskPriorityId?: number
  taskPriorityName?: string
  startDate?: Date
  endDate?: Date
  direction: boolean
  description: string
  constructor() {
    super()
    this.moduleId = 0
    this.moduleName = ""
    this.referenceId = 0
    this.referenceName = ""
    this.taskStatusId = 0
    this.taskStatusName = ""
    this.taskPriorityId = 0
    this.taskPriorityName = ""
    this.direction = false
    this.description = ""
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new RowActivityModel(), obj)
    newObj.name = obj.activityName
    newObj.taskStatusName = obj.taskStatusName
    newObj.startDate = obj.dateStart ? dayjs(obj.dateStart) : null
    newObj.endDate = obj.dateEnd ? dayjs(obj.dateEnd) : null
    // 4 calendar
    newObj.start = obj.dateStart ? dayjs(obj.dateStart).toDate() : null
    newObj.end = obj.dateEnd ? dayjs(obj.dateEnd).toDate() : null
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}

export class ActivityDetailModel extends RowData implements IRowActivity {
  id?: number
  moduleId?: number
  moduleName: string
  referenceId?: number
  referenceName: string
  taskStatusId?: number
  taskStatusName?: string
  taskPriorityId?: number
  taskPriorityName?: string
  dateStart?: Date
  dateEnd?: Date
  direction: boolean
  description: string
  constructor() {
    super()
    this.id = undefined
    this.moduleId = undefined
    this.moduleName = ""
    this.referenceId = undefined
    this.referenceName = ""
    this.taskStatusId = undefined
    this.taskStatusName = ""
    this.taskPriorityId = undefined
    this.taskPriorityName = ""
    this.direction = false
    this.description = ""
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new RowActivityModel(), obj)
    newObj.name = obj.activityName
    newObj.activityUserIds = (obj.activityUser || [])
      .filter((item) => item.isActive)
      .map((item) => item.userId)
    newObj.activityOrganizationUnitIds = (obj.activityOrganizationUnit || [])
      .filter((item) => item.isActive)
      .map((item) => item.organizationUnitId)
    newObj.name = obj.activityName
    newObj.dateStart = obj.dateStart ? dayjs(obj.dateStart) : null
    newObj.dateEnd = obj.dateEnd ? dayjs(obj.dateEnd) : null
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}

export interface IActivityReminderModel {
  id?: number
  moduleId?: number
  moduleName: string
  typeId?: number
  type: any
  formatId?: number
  format?: any
  value?: string
}

export class ActivityReminderModel implements IActivityReminderModel {
  id?: number
  moduleId?: number
  moduleName: string
  typeId?: number
  type: any
  formatId?: number
  format?: any
  value?: string
  constructor() {
    this.id = undefined
    this.moduleId = undefined
    this.moduleName = ""
    this.typeId = undefined
    this.type = undefined
    this.formatId = undefined
    this.format = undefined
    this.value = ""
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new ActivityReminderModel(), obj)
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}
