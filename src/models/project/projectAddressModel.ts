export interface IProjectAddress {
  id?: number,
  countryId?: number,
  countryName: string,
  provinceId?: number,
  provinceName: string,
  districtId?: number,
  districtName: string,
  wardId?: number,
  wardName: string,
  address: string,
  latitude: string,
  longitude: string,
  regionId?: number,
  regionName: string,
  geography: any
}

export class ProjectAddressModel implements IProjectAddress {
  id?: number
  countryId?: number
  countryName: string
  provinceId?: number
  provinceName: string
  districtId?: number
  districtName: string
  wardId?: number
  wardName: string
  address: string
  latitude: string
  longitude: string
  regionId?: number
  regionName: string
  geography: any

  constructor() {
    this.id = undefined
    this.countryId = undefined
    this.countryName = ''
    this.provinceId = undefined
    this.provinceName = ''
    this.districtId = undefined
    this.districtName = ''
    this.wardId = undefined
    this.wardName = ''
    this.address = ''
    this.latitude = ''
    this.longitude = ''
    this.regionId = undefined
    this.regionName = ''
    this.geography = {}
  }

  public static

  assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new ProjectAddressModel(), obj)

    return newObj
  }

  public static

  assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}
