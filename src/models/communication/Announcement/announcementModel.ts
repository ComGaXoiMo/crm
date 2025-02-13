import { Status } from '@models/global'
import { appStatusColors } from '@lib/appconst'
import { mapActiveStatus } from '@lib/helper'
import moment from 'moment-timezone/moment-timezone'

export interface IAnnouncement {
  id?: number
  subject?: string
  message?: any
  version?: string
  forClient?: boolean
  fromToDate?: any
  startDate?: Date
  endDate?: Date
  announcementTypeId?: number
  isActive?: boolean
  statusId?: number
  statusCode?: string
  status?: Status
  nameId?: string
}

export class AnnouncementModel implements IAnnouncement {
  id?: number
  subject?: string
  message?: any
  version?: string
  forClient?: boolean
  fromToDate?: any
  startDate?: Date
  endDate?: Date
  announcementTypeId?: number
  isActive?: boolean
  statusId?: number
  statusCode?: string
  status?: Status
  nameId?: string

  constructor() {
    this.id = undefined
    this.isActive = true
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new AnnouncementModel(), obj)
    newObj.fromToDate = obj.startDate && obj.endDate ? [moment(obj.startDate), moment(obj.endDate)] : undefined
    newObj.statusCode = obj.status?.code
    newObj.status = mapActiveStatus(obj.isActive)
    const isExpired = moment(obj.endDate).isBefore(moment.now())
    newObj.expiredStatus = isExpired ? new Status('EXPIRED', appStatusColors.expired)
      : new Status('VALID', appStatusColors.valid)
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    ;(objs || []).forEach((item) => results.push(this.assign(item)))
    return results
  }
}
