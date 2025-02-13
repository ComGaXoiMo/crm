import { notificationMethod } from "@lib/appconst"
import { Status } from "@models/global"
import { mapActiveStatus } from "@lib/helper"

export class TemplateModel {
  languageName: string;
  templateName: string;
  subject: string;
  templateContent: string;

  constructor(languageName?, templateName?, subject?, templateContent?) {
    this.languageName = languageName || ""
    this.templateName = templateName || ""
    this.subject = subject || ""
    this.templateContent = templateContent || ""
  }

  public static assign(obj) {
    if (!obj) return undefined;
    (obj.availableLanguages || []).forEach((item) => {
      obj[item.languageName] = item
    })
    const newObj = Object.assign(new TemplateModel(), obj)
    return newObj
  }
}

export interface IRowNotificationTemplate {
  id?: number;
  notificationType?: any;
  availableLanguages?: any;
  notificationTemplate?: any;
  method?: string;
  parameters?: any;
  isActive?: boolean;
  isStatic?: boolean;
  isMember?: boolean;
}

export class RowNotificationTemplateModel implements IRowNotificationTemplate {
  id?: number;
  notificationTypeId?: any;
  notificationType?: any;
  availableLanguages?: any;
  notificationTemplate?: NotificationTemplateModel;
  method?: string;
  parameters?: any;
  isActive?: boolean;
  isStatic?: boolean;
  isMember?: boolean;
  status?: Status;
  constructor() {
    this.id = undefined
    this.isActive = true
  }

  public static assign(obj) {
    if (!obj) return undefined;
    (obj.availableLanguages || []).forEach((item) => {
      obj[item.languageName] = item
    })
    const newObj = Object.assign(new RowNotificationTemplateModel(), obj)
    newObj.method = notificationMethod[obj.notificationMethod]
    newObj.status = mapActiveStatus(obj.isActive)
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}

export class NotificationTemplateDetailModel {
  id?: number;
  notificationType?: NotificationTypeModel;
  notificationTemplates: NotificationTemplateModel[];
  notificationTemplateLanguages?: any;
  parameters?: any;
  isActive?: boolean;
  isStatic?: boolean;
  isMember?: boolean;
  constructor() {
    this.id = undefined
    this.notificationTemplates = []
    this.notificationTemplateLanguages = {}
    this.isActive = true
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new NotificationTemplateDetailModel(), obj)
    newObj.notificationType = NotificationTypeModel.assign(
      obj.notificationType
    )
    newObj.method = notificationMethod[obj.notificationMethod];
    (abp.localization.languages || []).forEach((language) => {
      const templateLanguage = (newObj.notificationTemplates || []).find(
        (template) => template.languageName === language.name
      )
      newObj.notificationTemplateLanguages[language.name] =
        TemplateModel.assign(
          templateLanguage || { languageName: language.name }
        )
    })
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}

export class NotificationTemplateModel {
  languageName: string;
  subject: string;
  templateName: string;
  templateContent: string;
  groupType:number;
    
    constructor(languageName?, subject?, templateName?, templateContent?,groupType?) {
    this.languageName = languageName
    this.subject = subject
    this.templateName = templateName
    this.templateContent = templateContent 
     this.groupType = groupType
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new NotificationTemplateModel(), obj)
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}

export class NotificationTypeModel {
  id: number;
  value: string;
  label: string;
  code: string;
  constructor(value?, label?, id?, code?) {
    this.id = id
    this.value = value
    this.label = label
    this.code = code
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new NotificationTypeModel(), obj)
    newObj.id = obj.id
    newObj.value = obj.id
    newObj.label = obj.notificationName
    newObj.code = obj.notificationCode
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}
