export interface IRowTermCondition {
  id?: number
  notificationType?: any
  availableLanguages?: any
  notificationTemplate?: any
  method?: string
  parameters?: any
  isActive?: boolean
  isStatic?: boolean
  isMember?: boolean
}

export class RowTermConditionModel implements IRowTermCondition{
  id?: number
  notificationType?: any
  availableLanguages?: any
  notificationTemplate?: any
  method?: string
  parameters?: any
  isActive?: boolean
  isStatic?: boolean
  isMember?: boolean
  constructor() {
    this.id = undefined
  }

  public static assign(obj) {
    if (!obj) return undefined;

    (obj.availableLanguages || []).forEach(item => {
      obj[item.languageName] = item
    })
    const newObj = Object.assign(new RowTermConditionModel(), obj)
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}

export class TermConditionDetailModel {
  id?: number
  notificationType?: any
  notificationTemplates?: any
  templateLanguages?: any
  parameters?: any
  isActive?: boolean
  isStatic?: boolean
  isMember?: boolean
  constructor() {
    this.id = undefined
    this.templateLanguages = {}
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new TermConditionDetailModel(), obj)

    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}
