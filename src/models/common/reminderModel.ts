import AppConsts from '@lib/appconst'
const { timeUnits } = AppConsts
export class ReminderModel {
  parentId?: number
  reminderInMinute: number
  period?: number
  isActive: boolean
  moduleId: number
  userIds: Array<any>
  emails: Array<string>

  constructor() {
    this.parentId = 0
    this.reminderInMinute = 0
    this.period = 0
    this.isActive = false
    this.moduleId = 0
    this.userIds = []
    this.emails = []
  }

  public static assign(obj, timeUnit: string) {
    if (!obj) return undefined

    const newObj = Object.assign(new ReminderModel(), obj)
    newObj.userIds = obj.users && obj.users.length > 0 ? obj.users.map((item) => item.id) : []
    let reminderInMinute = obj.reminderInMinute
    switch (timeUnit) {
      case timeUnits.days:
        reminderInMinute = reminderInMinute / (24 * 60)
        break
      case timeUnits.hours:
        reminderInMinute = reminderInMinute / 60
        break
    }
    newObj.reminderInMinute = reminderInMinute
    return newObj
  }
}
