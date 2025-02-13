export class TruckTypeModel {
  id?: number
  name?: string
  code?: string
  sortNumber?: number
  width?: number
  high?: number
  allowableLoad?: string
  description?: string
  isActive: boolean

  constructor() {
    this.id = undefined
    this.isActive = true
    this.sortNumber = 1
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new TruckTypeModel(), obj)
    return newObj
  }

  public static assigns<T>(objs) {
    const results: TruckTypeModel[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}
