import moment from "moment"

import { v4 as uuid } from "uuid"
export class SettingVatModel {
  id?: number;
  name?: string;
  vatPercent: any;
  startDate: any;
  endDate: any;
  key: any;

  constructor() {
    this.name = ""
    this.key = uuid()
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new SettingVatModel(), obj)

    newObj.startDate = obj.startDate ? moment(obj.startDate) : undefined
    newObj.endDate = obj.endDate ? moment(obj.endDate) : undefined
    newObj.creationTime = obj.creationTime
      ? moment(obj.creationTime)
      : undefined
    newObj.key = uuid()
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}
export class RowVatConfigModel {
  id?: number;
  name?: string;
  vatPercent: any;
  startDate: any;
  endDate: any;
  key: any;

  constructor() {
    this.name = ""
    this.key = uuid()
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new RowVatConfigModel(), obj)
    newObj.name = obj.name
    newObj.startDate = obj.startDate ? moment(obj.startDate) : undefined
    newObj.endDate = obj.endDate ? moment(obj.endDate) : undefined
    newObj.key = uuid()
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}
