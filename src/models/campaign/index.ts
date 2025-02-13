import {RowData} from "@models/DataTable"

export interface IRowCampaign {
  typeId: number
  typeName: string
  statusId: number
  statusName: string
  includeTargets?: any
  excludeTargets?: any
}

export class RowCampaignModel extends RowData implements IRowCampaign{
  typeId: number
  typeName: string
  statusId: number
  statusName: string
  includeTargets?: any
  excludeTargets?: any

  constructor() {
    super()
    this.typeId = 0
    this.typeName = ''
    this.statusId = 0
    this.statusName = ''

  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new RowCampaignModel(), obj)
    newObj.includeTargets = (obj.campaignTarget || []).filter((t) => t.typeName === 'InClude')
    newObj.excludeTargets = (obj.campaignTarget || []).filter((t) => t.typeName === 'ExClude')
    return newObj
  }

  public static assigns<T>(objs) {
    const results: any[] = [];
    (objs || []).forEach((item) => results.push(this.assign(item)))
    return results
  }
}
