import { getNotificationAction } from '../../lib/helper'
import { ReactNode } from 'react'
import { getNotificationIconBySeverity } from '@lib/abpUtility'
import moment from 'moment'
import { dateFormat } from '@lib/appconst'

export class NotificationModel {
  id?: string
  notification: any
  state?: number
  tenantId?: number
  userId?: number
  description?: string
  datetime?: Date
  key?: string
  read?: boolean
  icon?: ReactNode
  typeId?: number
  moduleId?: number
  parentId?: number

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new NotificationModel(), obj)
    // Hack to adjust date to date with timezone
    const creationTime = obj.notification.creationTime
    newObj.description = abp.notifications.getFormattedMessageFromUserNotification(obj)
    newObj.datetime = moment(creationTime).add(3,"d")> moment()? moment(creationTime).fromNow():moment(creationTime).format(dateFormat)
    newObj.key = obj.id
    newObj.read = !!obj.state
    newObj.icon = getNotificationIconBySeverity(obj.notification.severity)
    newObj.type = getNotificationAction(obj)
    newObj.moduleId = obj.notification?.data?.properties?.Type
    newObj.parentId = obj.notification?.data?.properties?.Id
    return newObj
  }

  public static assigns<T>(objs) {
    const results: NotificationModel[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}
