export class TransportationCostModel {
  id?: number
  truckTypeId?: number
  truckType?: any
  provinceId?: number
  districtId?: number
  price?: number
  description?: string
  location?: any
  locationName?: string
  truck?: any
  isActive: boolean

  constructor() {
    this.id = undefined
    this.isActive = true
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new TransportationCostModel(), obj)
    newObj.location = { province: obj.province, district: obj.district }
    newObj.locationName = `${obj.district?.name}, ${obj.province?.name}`
    return newObj
  }

  public static assigns<T>(objs) {
    const results: TransportationCostModel[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}
