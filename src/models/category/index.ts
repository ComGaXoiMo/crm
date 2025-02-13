export interface Category {
  nameId: string
  name: string
  isActive: boolean
  sortOrder: number
  id: number
}
export class OtherTypeModel {
  requestTypes: any[];
  phoneTypes: any[];
  contactTypes: any[];
  requestSource: any[];
  requirementType: any[];
  requestStatus: any[];
  requestGrade: any[];

  constructor() {
    this.requestTypes = []
    this.phoneTypes = []
    this.contactTypes = []
    this.requestSource = []
    this.requirementType = []
    this.requestStatus = []
    this.requestGrade = []
  }

  public static assign(obj) {
    if (!obj) return undefined

    const newObj = Object.assign(new OtherTypeModel(), obj)

    return newObj
  }
}