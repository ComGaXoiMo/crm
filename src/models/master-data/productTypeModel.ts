import { initMultiLanguageField } from '@lib/helper'

export class ProductTypeModel {
  id?: number
  name?: string
  names?: any[]
  code?: string
  isActive?: boolean
  description?: string
  sortNumber?: number
  serviceFeeIds?: number[]
  productServiceFees?: any[]

  constructor() {
    this.id = undefined
    this.isActive = true
    this.sortNumber = 1
    this.names = initMultiLanguageField()
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new ProductTypeModel(), obj)
    newObj.serviceFeeIds = (obj.productServiceFees || []).map((item) => item?.id)
    return newObj
  }

  public static assigns<T>(objs) {
    const results: ProductTypeModel[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}
