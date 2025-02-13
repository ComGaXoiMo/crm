import { RowData } from "@models/DataTable"

export interface IRowOU {
  parentId: number;
  code: string;
  displayName: string;
  memberCount: number;
  creatorUserId?: number;
  creationTime?: Date;
  lastModifierUserId?: number;
  lastModifierTime?: Date;
  id?: number;
}

export class RowOUModel extends RowData implements IRowOU {
  parentId: number;
  code: string;
  displayName: string;
  memberCount: number;
  creatorUserId?: number;
  creationTime?: Date;
  lastModifierUserId?: number;
  lastModifierTime?: Date;
  constructor() {
    super()
    this.parentId = 0
    this.code = ""
    this.displayName = ""
    this.memberCount = 0
    this.creatorUserId = undefined
    this.creationTime = undefined
    this.lastModifierUserId = undefined
    this.lastModifierTime = undefined

    this.id = undefined
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new RowOUModel(), obj)
    newObj.displayName = obj.displayName
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = []
    objs?.forEach((item) => results.push(this.assign(item)))
    return results
  }
}
