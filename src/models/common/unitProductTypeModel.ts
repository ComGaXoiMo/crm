/* unit Type, ProductType*/
export interface IunitProductTypeModel {
  propertyTypeId?: number;
  unitTypeId?: number[];
}

export class unitProductTypeModel implements IunitProductTypeModel {
  propertyTypeId?: number;
  unitTypeId?: number[];

  constructor(propertyTypeId?, unitTypeId?) {
    this.propertyTypeId = propertyTypeId
    this.unitTypeId = unitTypeId
  }
}
