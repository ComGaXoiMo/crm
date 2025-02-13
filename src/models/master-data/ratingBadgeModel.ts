import { initMultiLanguageField, mapMultiLanguageField } from '@lib/helper'
import { moduleIds } from '@lib/appconst'

export class RatingBadgeModel {
  id?: number
  name?: string
  names?: any[]
  code?: boolean
  description?: string
  sortNumber?: number
  moduleIds?: number[]
  isActive?: boolean

  constructor() {
    this.id = undefined
    this.sortNumber = 1
    this.isActive = true
    this.names = initMultiLanguageField()
    this.moduleIds = [moduleIds.ratingBadge]
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new RatingBadgeModel(), obj)
    newObj.moduleIds = obj.moduleIds || [moduleIds.ratingBadge]
    newObj.names = mapMultiLanguageField(newObj.names)
    return newObj
  }

  public static assigns<T>(objs) {
    const results: RatingBadgeModel[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}
