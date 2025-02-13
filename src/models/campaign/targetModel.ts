import {RowData} from "@models/DataTable"


export class RowTargetModel extends RowData {

  constructor() {
    super()
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new RowTargetModel(), obj)

    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = [];
    (objs || []).forEach((item) => results.push(this.assign(item)))
    return results
  }
}
