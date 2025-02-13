export class TruckBrandModel {
  id?: number
  name?: string
  code?: string
  description?: string
  sortNumber?: number
  isActive: boolean

  constructor() {
    this.id = undefined
    this.isActive = true
    this.sortNumber = 1
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new TruckBrandModel(), obj)
    return newObj
  }

  public static assigns<T>(objs) {
    const results: TruckBrandModel[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}
