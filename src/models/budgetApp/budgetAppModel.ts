import { v4 as uuid } from "uuid"

export class RowBudgetAppModel {
  id?: number
  projectId?: number
  project?: any
  type?: any
  year?: any
  key?: any
  jan?: number
  feb?: number
  mar?: number
  apr?: number
  may?: number
  jun?: number
  jul?: number
  aug?: number
  sep?: number
  oct?: number
  nov?: number
  dec?: number

  constructor(type?, year?, projectId?, project?) {
    this.key = uuid()
    this.type = type
    this.year = year
    this.projectId = projectId
    this.project = project
    this.id = undefined
    this.jan = 0
    this.feb = 0
    this.mar = 0
    this.apr = 0
    this.may = 0
    this.jun = 0
    this.jul = 0
    this.aug = 0
    this.sep = 0
    this.oct = 0
    this.nov = 0
    this.dec = 0
  }

  public static assign(obj) {
    if (!obj) return undefined
    const newObj = Object.assign(new RowBudgetAppModel(), obj)

    newObj.key = uuid()
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))

    return results
  }
}
