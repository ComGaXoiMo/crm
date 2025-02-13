import dayjs from "dayjs"

export class LARevenueModel {
  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new LARevenueModel(), obj)
    newObj.FormatDate = obj.FormatDate
      ? dayjs(obj.FormatDate).format("MM/yyyy")
      : obj.FormatDate

    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}

export class LARevenueLastYearModel {
  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new LARevenueModel(), obj)
    newObj.FormatDate = obj.FormatDate
      ? dayjs(obj.FormatDate).add(1, "years").format("MM/yyyy")
      : obj.FormatDate

    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs.forEach((item) => results.push(this.assign(item)))
    return results
  }
}
