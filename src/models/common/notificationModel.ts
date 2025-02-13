import { getNotificationAction } from "../../lib/helper"
import { ReactNode } from "react"
import { getNotificationIconBySeverity } from "@lib/abpUtility"
import dayjs from "dayjs"
import { dateFormat } from "@lib/appconst"
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime)
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
    newObj.description =
      abp.notifications.getFormattedMessageFromUserNotification(obj)
    newObj.datetime =
      dayjs(creationTime).add(3, "d") > dayjs()
        ? dayjs(creationTime).fromNow()
        : dayjs(creationTime).format(dateFormat)
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
